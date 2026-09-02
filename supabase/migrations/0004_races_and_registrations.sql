-- NULLL.CLUB — courses, inscriptions, presences.
--
-- Trois principes tiennent tout le fichier :
--
-- 1. Le jeton du QR n'est jamais fourni par le client. Un declencheur
--    l'ecrase a chaque insertion : personne ne choisit son propre QR.
-- 2. S'inscrire et pointer passent par des fonctions, pas par des
--    insertions directes. La capacite, la date limite et le doublon se
--    verifient dans la meme transaction que l'ecriture — une regle RLS
--    ne sait pas faire ca sans laisser une fenetre de course.
-- 3. Le role admin se lit par une fonction security definer. Une regle
--    qui lirait profiles pour savoir si on est admin declencherait la
--    RLS de profiles, donc elle-meme, a l'infini.

-- ------------------------------------------------------------------
-- Profils : role et informations utiles le jour d'une course
-- ------------------------------------------------------------------
alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists instagram_handle text;
alter table public.profiles add column if not exists emergency_contact_name text;
alter table public.profiles add column if not exists emergency_contact_phone text;
alter table public.profiles add column if not exists medical_notes text;
alter table public.profiles add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles add constraint profiles_role_check check (role in ('user', 'admin'));
  end if;
end;
$$;

-- Lire le role sans declencher la RLS de profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------------
-- Horodatage de modification
-- ------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------
-- Courses
-- ------------------------------------------------------------------
create table if not exists public.races (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  location text,
  address text,
  city text default 'Aix-en-Provence',
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  distance_km numeric(5,2),
  max_participants integer check (max_participants is null or max_participants > 0),
  registration_open boolean not null default true,
  registration_deadline timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'completed', 'cancelled')),
  cover_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists races_status_start_idx on public.races (status, start_datetime);
create index if not exists races_slug_idx on public.races (slug);

drop trigger if exists races_touch_updated_at on public.races;
create trigger races_touch_updated_at before update on public.races
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------------
-- Inscriptions
-- ------------------------------------------------------------------
create table if not exists public.race_registrations (
  id uuid primary key default gen_random_uuid(),
  race_id uuid not null references public.races(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  qr_code_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'registered' check (status in ('registered', 'cancelled', 'checked_in', 'no_show')),
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  checked_in_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint race_registrations_unique_per_user unique (race_id, user_id)
);

create index if not exists race_registrations_race_idx on public.race_registrations (race_id, status);
create index if not exists race_registrations_user_idx on public.race_registrations (user_id, created_at desc);

drop trigger if exists race_registrations_touch_updated_at on public.race_registrations;
create trigger race_registrations_touch_updated_at before update on public.race_registrations
  for each row execute function public.touch_updated_at();

-- Le jeton ne vient jamais du client, meme s'il en fournit un.
create or replace function public.force_registration_token()
returns trigger
language plpgsql
as $$
begin
  new.qr_code_token = encode(gen_random_bytes(24), 'hex');
  return new;
end;
$$;

drop trigger if exists race_registrations_force_token on public.race_registrations;
create trigger race_registrations_force_token before insert on public.race_registrations
  for each row execute function public.force_registration_token();

-- ------------------------------------------------------------------
-- Historique des scans
-- ------------------------------------------------------------------
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.race_registrations(id) on delete cascade,
  race_id uuid references public.races(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  scanned_by uuid references auth.users(id),
  scanned_at timestamptz default now(),
  scan_result text not null check (scan_result in ('success', 'already_checked_in', 'invalid_qr', 'wrong_race', 'cancelled_registration')),
  notes text
);

create index if not exists checkins_race_scanned_idx on public.checkins (race_id, scanned_at desc);

-- ------------------------------------------------------------------
-- Points : prepare, volontairement inutilise cote interface
-- ------------------------------------------------------------------
create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  race_id uuid references public.races(id) on delete set null,
  points int not null,
  reason text,
  created_at timestamptz default now()
);

create index if not exists points_ledger_user_idx on public.points_ledger (user_id, created_at desc);

-- ------------------------------------------------------------------
-- S'inscrire : capacite, date limite et doublon dans la meme transaction
-- ------------------------------------------------------------------
create or replace function public.register_for_race(p_race_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_race public.races;
  v_inscrits int;
  v_existante public.race_registrations;
  v_nouvelle public.race_registrations;
begin
  if v_user is null then
    return jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  end if;

  -- Verrou sur la course : deux inscriptions simultanees ne peuvent pas
  -- lire le meme compteur et depasser la capacite toutes les deux.
  select * into v_race from public.races where id = p_race_id for update;

  if not found or v_race.status <> 'published' then
    return jsonb_build_object('ok', false, 'reason', 'race_unavailable');
  end if;

  if not v_race.registration_open then
    return jsonb_build_object('ok', false, 'reason', 'registration_closed');
  end if;

  if v_race.registration_deadline is not null and v_race.registration_deadline < now() then
    return jsonb_build_object('ok', false, 'reason', 'deadline_passed');
  end if;

  if v_race.start_datetime < now() then
    return jsonb_build_object('ok', false, 'reason', 'race_started');
  end if;

  select * into v_existante
  from public.race_registrations
  where race_id = p_race_id and user_id = v_user;

  if found then
    if v_existante.status = 'cancelled' then
      update public.race_registrations
      set status = 'registered'
      where id = v_existante.id
      returning * into v_nouvelle;

      return jsonb_build_object('ok', true, 'reason', 'reactivated', 'token', v_nouvelle.qr_code_token);
    end if;

    return jsonb_build_object('ok', false, 'reason', 'already_registered', 'token', v_existante.qr_code_token);
  end if;

  if v_race.max_participants is not null then
    select count(*) into v_inscrits
    from public.race_registrations
    where race_id = p_race_id and status <> 'cancelled';

    if v_inscrits >= v_race.max_participants then
      return jsonb_build_object('ok', false, 'reason', 'race_full');
    end if;
  end if;

  insert into public.race_registrations (race_id, user_id)
  values (p_race_id, v_user)
  returning * into v_nouvelle;

  return jsonb_build_object('ok', true, 'reason', 'registered', 'token', v_nouvelle.qr_code_token);
end;
$$;

revoke all on function public.register_for_race(uuid) from public;
grant execute on function public.register_for_race(uuid) to authenticated;

-- ------------------------------------------------------------------
-- Annuler : seulement la sienne, et seulement tant que rien n'est pointe
-- ------------------------------------------------------------------
create or replace function public.cancel_registration(p_registration_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_reg public.race_registrations;
  v_race public.races;
begin
  if v_user is null then
    return jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  end if;

  select * into v_reg from public.race_registrations where id = p_registration_id;

  if not found or v_reg.user_id <> v_user then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if v_reg.checked_in then
    return jsonb_build_object('ok', false, 'reason', 'already_checked_in');
  end if;

  select * into v_race from public.races where id = v_reg.race_id;

  if v_race.start_datetime < now() then
    return jsonb_build_object('ok', false, 'reason', 'race_started');
  end if;

  update public.race_registrations set status = 'cancelled' where id = p_registration_id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.cancel_registration(uuid) from public;
grant execute on function public.cancel_registration(uuid) to authenticated;

-- ------------------------------------------------------------------
-- Pointer un participant : un seul aller-retour, tous les cas traces
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

  if v_reg.race_id <> p_race_id then
    v_resultat := 'wrong_race';
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
    where id = v_reg.id;
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

revoke all on function public.checkin_by_token(text, uuid) from public;
grant execute on function public.checkin_by_token(text, uuid) to authenticated;

-- ------------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------------
alter table public.races enable row level security;
alter table public.race_registrations enable row level security;
alter table public.checkins enable row level security;
alter table public.points_ledger enable row level security;

-- Courses : les publiees sont visibles de tous, y compris hors connexion.
drop policy if exists "races_select_published" on public.races;
create policy "races_select_published"
  on public.races for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "races_admin_select" on public.races;
create policy "races_admin_select"
  on public.races for select to authenticated using (public.is_admin());

drop policy if exists "races_admin_write" on public.races;
create policy "races_admin_write"
  on public.races for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Inscriptions : chacun voit les siennes. Personne n'ecrit en direct —
-- ni insertion ni mise a jour : tout passe par les fonctions ci-dessus,
-- sinon un membre pourrait se declarer present tout seul.
drop policy if exists "registrations_select_own" on public.race_registrations;
create policy "registrations_select_own"
  on public.race_registrations for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "registrations_admin_select" on public.race_registrations;
create policy "registrations_admin_select"
  on public.race_registrations for select
  to authenticated using (public.is_admin());

drop policy if exists "registrations_admin_write" on public.race_registrations;
create policy "registrations_admin_write"
  on public.race_registrations for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- Presences : ecriture par la fonction uniquement, lecture par l'admin
-- et par le membre pour son propre historique.
drop policy if exists "checkins_admin_select" on public.checkins;
create policy "checkins_admin_select"
  on public.checkins for select to authenticated using (public.is_admin());

drop policy if exists "checkins_select_own" on public.checkins;
create policy "checkins_select_own"
  on public.checkins for select to authenticated using (auth.uid() = user_id);

-- Profils : l'admin lit et corrige tout le monde.
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select to authenticated using (public.is_admin());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Le grand livre de points reste ferme : aucune policy, donc invisible
-- tant que l'interface ne l'utilise pas.

-- ------------------------------------------------------------------
-- Les trois sorties deja annoncees sur le site
-- ------------------------------------------------------------------
insert into public.races (title, slug, description, location, address, start_datetime, distance_km, status, registration_open)
values
  ('Première sortie', 'sortie-2026-09-26', 'La toute première sortie du club. 5 km, allure conversation, personne n''est laissé derrière.', 'Parking Emile Zola', 'GF56+VC Aix-en-Provence', '2026-09-26T08:30:00+02:00', 5, 'published', true),
  ('Deuxième sortie', 'sortie-2026-10-03', 'On remet ça. 6 km au même endroit, même heure.', 'Parking Emile Zola', 'GF56+VC Aix-en-Provence', '2026-10-03T08:30:00+02:00', 6, 'published', true),
  ('Troisième sortie', 'sortie-2026-10-10', 'Troisième samedi. 5,5 km.', 'Parking Emile Zola', 'GF56+VC Aix-en-Provence', '2026-10-10T08:30:00+02:00', 5.5, 'published', true)
on conflict (slug) do nothing;
