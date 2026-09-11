-- NULLL.CLUB — suite de l'audit du 11/09/2026.
--
-- 1. Limiteur partage. Les compteurs de tentatives vivaient en memoire,
--    donc un par instance serverless : sur Vercel, chaque nouvelle
--    instance repartait a zero. Ils vivent desormais en base, et le
--    compte se fait en une seule instruction atomique.
-- 2. Code partenaire : creation et revocation des anciens dans la meme
--    transaction, sous verrou du partenaire. Deux generations simultanees
--    ne peuvent plus laisser deux codes actifs, ni aucun.
-- 3. Pointage : une sortie en brouillon ou annulee ne se pointe pas.

-- ------------------------------------------------------------------
-- Limiteur
-- ------------------------------------------------------------------
create table if not exists public.rate_limits (
  cle text primary key,
  compte integer not null default 0,
  fin_fenetre timestamptz not null
);

-- Aucune policy : table reservee a la cle service.
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

/**
 * Compte un essai pour « p_cle » et dit s'il reste autorise : au plus
 * p_max essais par fenetre de p_fenetre_secondes. Renvoie true si l'essai
 * passe, false s'il faut refuser.
 */
create or replace function public.consommer_limite(p_cle text, p_fenetre_secondes integer, p_max integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_compte integer;
begin
  insert into public.rate_limits as r (cle, compte, fin_fenetre)
  values (p_cle, 1, now() + make_interval(secs => p_fenetre_secondes))
  on conflict (cle) do update
    set compte = case when r.fin_fenetre < now() then 1 else r.compte + 1 end,
        fin_fenetre = case when r.fin_fenetre < now() then now() + make_interval(secs => p_fenetre_secondes) else r.fin_fenetre end
  returning compte into v_compte;

  -- Menage opportuniste : les fenetres eteintes depuis un jour partent.
  if random() < 0.02 then
    delete from public.rate_limits where fin_fenetre < now() - interval '1 day';
  end if;

  return v_compte <= p_max;
end;
$$;

/** Efface le compteur apres un succes (connexion reussie). */
create or replace function public.effacer_limite(p_cle text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rate_limits where cle = p_cle;
$$;

revoke all on function public.consommer_limite(text, integer, integer) from public, anon, authenticated;
revoke all on function public.effacer_limite(text) from public, anon, authenticated;
grant execute on function public.consommer_limite(text, integer, integer) to service_role;
grant execute on function public.effacer_limite(text) to service_role;

-- ------------------------------------------------------------------
-- Code partenaire atomique
-- ------------------------------------------------------------------
create or replace function public.emettre_code_partenaire(p_partner_id uuid, p_code_hash text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  -- Verrou du partenaire : une seconde generation attend la premiere.
  perform 1 from public.partners where id = p_partner_id for update;

  if not found then
    raise exception 'partenaire introuvable';
  end if;

  update public.partner_access_codes
  set active = false
  where partner_id = p_partner_id and active;

  insert into public.partner_access_codes (partner_id, code_hash, active)
  values (p_partner_id, p_code_hash, true)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.emettre_code_partenaire(uuid, text) from public, anon, authenticated;
grant execute on function public.emettre_code_partenaire(uuid, text) to service_role;

-- ------------------------------------------------------------------
-- Pointage : statut de la sortie verifie
-- ------------------------------------------------------------------
create or replace function public.checkin_by_token(p_token text, p_race_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin uuid := auth.uid();
  v_reg public.race_registrations;
  v_profil public.profiles;
  v_statut_course text;
  v_resultat text;
begin
  if not public.is_admin() then
    return jsonb_build_object('ok', false, 'result', 'forbidden');
  end if;

  select * into v_reg
  from public.race_registrations
  where qr_code_token = trim(p_token)
  for update;

  if not found then
    insert into public.checkins (race_id, scanned_by, scan_result, notes)
    values (p_race_id, v_admin, 'invalid_qr', left(coalesce(p_token, ''), 80));

    return jsonb_build_object('ok', false, 'result', 'invalid_qr');
  end if;

  select status into v_statut_course from public.races where id = v_reg.race_id;

  if v_reg.race_id <> p_race_id then
    v_resultat := 'wrong_race';
  elsif v_statut_course in ('draft', 'cancelled') then
    v_resultat := 'race_unavailable';
  elsif v_reg.status = 'cancelled' then
    v_resultat := 'cancelled_registration';
  elsif v_reg.checked_in then
    v_resultat := 'already_checked_in';
  else
    v_resultat := 'success';
  end if;

  if v_resultat = 'success' then
    update public.race_registrations
    set checked_in = true,
        checked_in_at = now(),
        checked_in_by = v_admin,
        status = 'checked_in'
    where id = v_reg.id
    returning * into v_reg;
  end if;

  insert into public.checkins (registration_id, race_id, user_id, scanned_by, scan_result)
  values (v_reg.id, v_reg.race_id, v_reg.user_id, v_admin, v_resultat);

  select * into v_profil from public.profiles where id = v_reg.user_id;

  return jsonb_build_object(
    'ok', v_resultat = 'success',
    'result', v_resultat,
    'first_name', v_profil.first_name,
    'last_name', v_profil.last_name,
    'checked_in_at', v_reg.checked_in_at
  );
end;
$$;

revoke all on function public.checkin_by_token(text, uuid) from public, anon;
grant execute on function public.checkin_by_token(text, uuid) to authenticated;
