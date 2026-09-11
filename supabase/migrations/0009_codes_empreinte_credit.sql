-- NULLL.CLUB — suite de l'audit du 11/09/2026 (R06, R07).
--
-- 1. Connexion partenaire : chaque code porte une empreinte SHA-256,
--    indexee. La connexion retrouve la bonne ligne directement au lieu de
--    comparer le code saisi a tous les codes actifs, un par un, en bcrypt.
--    bcrypt reste la verification finale.
-- 2. Credit de points : verrou par membre et partenaire, et refus d'un
--    achat identique dans les 30 secondes, dans la meme transaction. Deux
--    envois simultanes ne peuvent plus crediter deux fois. Le partenaire
--    doit etre actif et le montant borne.

alter table public.partner_access_codes add column if not exists code_empreinte text;
create unique index if not exists partner_access_codes_empreinte_idx
  on public.partner_access_codes (code_empreinte) where code_empreinte is not null;

create or replace function public.emettre_code_partenaire(p_partner_id uuid, p_code_hash text, p_empreinte text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  perform 1 from public.partners where id = p_partner_id for update;

  if not found then
    raise exception 'partenaire introuvable';
  end if;

  update public.partner_access_codes
  set active = false
  where partner_id = p_partner_id and active;

  insert into public.partner_access_codes (partner_id, code_hash, code_empreinte, active)
  values (p_partner_id, p_code_hash, p_empreinte, true)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.emettre_code_partenaire(uuid, text, text) from public, anon, authenticated;
grant execute on function public.emettre_code_partenaire(uuid, text, text) to service_role;

create or replace function public.credit_from_purchase(
  p_qr_token text,
  p_partner_id uuid,
  p_label text,
  p_amount numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.profiles;
  v_ratio numeric;
  v_points int;
  v_transaction_id uuid;
  v_current_month_points int;
  v_tier public.loyalty_tiers;
begin
  if p_qr_token is null or length(trim(p_qr_token)) = 0 then
    raise exception 'QR token missing';
  end if;

  if p_amount is null or p_amount <= 0 or p_amount > 1000 then
    raise exception 'Amount out of range';
  end if;

  if p_label is null or length(trim(p_label)) = 0 then
    raise exception 'Label missing';
  end if;

  if not exists (select 1 from public.partners where id = p_partner_id and active) then
    raise exception 'Partner inactive';
  end if;

  select *
  into v_member
  from public.profiles
  where qr_token = p_qr_token;

  if not found then
    raise exception 'Member not found';
  end if;

  -- Un seul credit a la fois pour ce couple membre / partenaire.
  perform pg_advisory_xact_lock(hashtext(v_member.id::text || ':' || p_partner_id::text));

  if exists (
    select 1 from public.transactions
    where member_id = v_member.id
      and partner_id = p_partner_id
      and amount_eur = p_amount
      and created_at > now() - interval '30 seconds'
  ) then
    raise exception 'Duplicate purchase';
  end if;

  select coalesce((value #>> '{}')::numeric, 1)
  into v_ratio
  from public.app_config
  where key = 'points_per_euro';

  v_ratio := coalesce(v_ratio, 1);
  v_points := floor(p_amount * v_ratio)::int;

  insert into public.transactions (member_id, partner_id, label, amount_eur, points_awarded)
  values (v_member.id, p_partner_id, trim(p_label), p_amount, v_points)
  returning id into v_transaction_id;

  insert into public.points_log (user_id, type, points, transaction_id, description)
  values (v_member.id, 'buy', v_points, v_transaction_id, trim(p_label));

  update public.profiles
  set current_month_points = current_month_points + v_points,
      lifetime_points = lifetime_points + v_points
  where id = v_member.id
  returning current_month_points into v_current_month_points;

  v_tier := public.get_member_tier(v_current_month_points);

  return jsonb_build_object(
    'member_first_name', v_member.first_name,
    'points_awarded', v_points,
    'current_month_points', v_current_month_points,
    'tier_name', v_tier.name,
    'discount_percent', coalesce(v_tier.discount_percent, 0)
  );
end;
$$;

-- create or replace garde les droits, mais on les repose pour que le
-- fichier se suffise a lui-meme.
revoke all on function public.credit_from_purchase(text, uuid, text, numeric) from public, anon, authenticated;
grant execute on function public.credit_from_purchase(text, uuid, text, numeric) to service_role;
