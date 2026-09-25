-- NULLL.CLUB — pointage manuel et double vérification des admins (25/09/2026).
--
-- 1. Un membre dont le téléphone est déchargé peut être marqué présent
--    depuis la fiche de la sortie. Même décision, même trace (checkins)
--    que le scan, avec la note « manuel ».
-- 2. Un admin qui a activé la double vérification (TOTP) doit l'avoir
--    passée (aal2) pour que is_admin() soit vrai : la RLS refuse alors
--    ses données à une session qui n'aurait que le mot de passe. Un admin
--    sans facteur garde l'accès : l'activation reste volontaire, mais
--    une fois faite, elle s'impose.

-- ------------------------------------------------------------------
-- is_admin : rôle admin, et aal2 si un facteur est vérifié
-- ------------------------------------------------------------------
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
  )
  and (
    coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
    or not exists (
      select 1 from auth.mfa_factors f
      where f.user_id = auth.uid() and f.status = 'verified'
    )
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------------
-- Pointage manuel
-- ------------------------------------------------------------------
create or replace function public.pointer_inscription(p_registration_id uuid)
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
  where id = p_registration_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'result', 'invalid_qr');
  end if;

  select status into v_statut_course from public.races where id = v_reg.race_id;

  if v_statut_course in ('draft', 'cancelled') then
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

  -- 'race_unavailable' n'est pas dans la contrainte de checkins : on le
  -- rend sans le tracer, comme le scan le ferait sans l'inscription.
  if v_resultat <> 'race_unavailable' then
    insert into public.checkins (registration_id, race_id, user_id, scanned_by, scan_result, notes)
    values (v_reg.id, v_reg.race_id, v_reg.user_id, v_admin, v_resultat, 'manuel');
  end if;

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

revoke all on function public.pointer_inscription(uuid) from public, anon;
grant execute on function public.pointer_inscription(uuid) to authenticated;
