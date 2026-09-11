-- NULLL.CLUB — fermer les droits trop larges relevés par l'audit du 11/09/2026.
--
-- Les droits de table par defaut de Supabase donnent UPDATE sur toutes les
-- colonnes a anon et authenticated. Avec la policy « profiles_update_own »,
-- un membre pouvait donc ecrire role = 'admin' sur sa propre ligne depuis
-- n'importe quel client. Et les fonctions de fidelite, security definer,
-- restaient executables par PUBLIC : un visiteur pouvait remettre les
-- points de tout le monde a zero.

-- ------------------------------------------------------------------
-- Profils : un membre ne modifie que ses informations personnelles
-- ------------------------------------------------------------------
revoke insert, update, delete on public.profiles from anon, authenticated;

-- medical_notes reste ouvert le temps que le code qui ne l'envoie plus
-- soit en ligne ; la migration 0007 le referme ensuite.
grant update (
  first_name,
  last_name,
  phone,
  birth_date,
  instagram_handle,
  emergency_contact_name,
  emergency_contact_phone,
  medical_notes
) on public.profiles to authenticated;

-- ------------------------------------------------------------------
-- Fonctions reservees au serveur (cle service)
-- ------------------------------------------------------------------
revoke all on function public.credit_from_purchase(text, uuid, text, numeric) from public, anon, authenticated;
grant execute on function public.credit_from_purchase(text, uuid, text, numeric) to service_role;

revoke all on function public.reset_monthly_points() from public, anon, authenticated;
grant execute on function public.reset_monthly_points() to service_role;

-- Fonction de declencheur : personne n'a a l'appeler directement.
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Les fonctions de course demandent une session : rien a faire pour anon.
revoke all on function public.register_for_race(uuid) from anon;
revoke all on function public.cancel_registration(uuid) from anon;
revoke all on function public.checkin_by_token(text, uuid) from anon;

-- ------------------------------------------------------------------
-- S'inscrire : decharge exigee, capacite verifiee aussi a la reactivation
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

  if not exists (select 1 from public.profiles where id = v_user and consent_waiver) then
    return jsonb_build_object('ok', false, 'reason', 'waiver_required');
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

  if found and v_existante.status <> 'cancelled' then
    return jsonb_build_object('ok', false, 'reason', 'already_registered', 'token', v_existante.qr_code_token);
  end if;

  -- Avant l'insertion comme avant la reactivation : une place liberee par
  -- une annulation a pu etre reprise entre-temps.
  if v_race.max_participants is not null then
    select count(*) into v_inscrits
    from public.race_registrations
    where race_id = p_race_id and status <> 'cancelled';

    if v_inscrits >= v_race.max_participants then
      return jsonb_build_object('ok', false, 'reason', 'race_full');
    end if;
  end if;

  if found then
    update public.race_registrations
    set status = 'registered'
    where id = v_existante.id
    returning * into v_nouvelle;

    return jsonb_build_object('ok', true, 'reason', 'reactivated', 'token', v_nouvelle.qr_code_token);
  end if;

  insert into public.race_registrations (race_id, user_id)
  values (p_race_id, v_user)
  returning * into v_nouvelle;

  return jsonb_build_object('ok', true, 'reason', 'registered', 'token', v_nouvelle.qr_code_token);
end;
$$;

revoke all on function public.register_for_race(uuid) from public, anon;
grant execute on function public.register_for_race(uuid) to authenticated;

-- ------------------------------------------------------------------
-- Annuler : l'inscription est verrouillee, un scan simultane attend
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

  select * into v_reg from public.race_registrations where id = p_registration_id for update;

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

revoke all on function public.cancel_registration(uuid) from public, anon;
grant execute on function public.cancel_registration(uuid) to authenticated;

-- ------------------------------------------------------------------
-- Pointer : l'heure renvoyee est celle qui vient d'etre ecrite
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

-- ------------------------------------------------------------------
-- Un membre voit les sorties auxquelles il est inscrit, meme fermees
-- ------------------------------------------------------------------
drop policy if exists "races_select_registered" on public.races;
create policy "races_select_registered"
  on public.races for select
  to authenticated
  using (
    exists (
      select 1 from public.race_registrations r
      where r.race_id = races.id and r.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------
-- Inscriptions -> profils : la liste des inscrits de l'admin en depend
-- ------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'race_registrations_user_profile_fkey') then
    alter table public.race_registrations
      add constraint race_registrations_user_profile_fkey
      foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
end;
$$;

-- ------------------------------------------------------------------
-- Le vrai point de depart
-- ------------------------------------------------------------------
update public.races
set location = 'Parking du chemin de la Cible',
    address = 'Parking du chemin de la Cible, près du lycée Émile Zola, Aix-en-Provence'
where location in ('Parking Emile Zola', 'Parking Émile Zola');
