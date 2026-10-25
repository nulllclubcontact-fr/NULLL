-- Les admins (hors comptes de test) sont inscrits a toutes les sorties :
-- ils accedent ainsi aux photos de chacune depuis leur espace membre.
-- Une inscription deja pointee (checked_in) reste telle quelle ; une
-- inscription annulee repasse en inscrite.

create or replace function public.inscrire_admins_a_la_sortie(p_race_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.race_registrations (race_id, user_id, status)
  select p_race_id, p.id, 'registered'
  from public.profiles p
  where p.role = 'admin'
    and coalesce(p.email, '') not like '%@test.nulll.club'
  on conflict (race_id, user_id) do update
    set status = 'registered', updated_at = now()
    where public.race_registrations.status not in ('registered', 'checked_in');
$$;

revoke all on function public.inscrire_admins_a_la_sortie(uuid) from public, anon, authenticated;

create or replace function public.races_inscrire_admins()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.inscrire_admins_a_la_sortie(new.id);
  return new;
end;
$$;

revoke all on function public.races_inscrire_admins() from public, anon, authenticated;

drop trigger if exists races_inscrire_admins on public.races;
create trigger races_inscrire_admins after insert on public.races
  for each row execute function public.races_inscrire_admins();

-- Sorties deja creees.
select public.inscrire_admins_a_la_sortie(id) from public.races;
