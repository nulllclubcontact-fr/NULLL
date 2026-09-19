-- NULLL.CLUB — accord pour les photos et vidéos des sorties (19/09/2026).
--
-- Consentement distinct de la décharge et facultatif : on peut courir sans
-- l'accorder. null = le membre n'a pas encore répondu (comptes créés avant
-- cette case), à traiter comme un refus tant qu'il ne répond pas.
alter table public.profiles add column if not exists consent_image boolean;
alter table public.profiles add column if not exists consent_image_at timestamptz;

-- La date se pose côté base à chaque changement de réponse : un client ne
-- peut pas antidater son accord.
create or replace function public.dater_consent_image()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.consent_image is distinct from old.consent_image then
    new.consent_image_at := case when new.consent_image is null then null else now() end;
  else
    new.consent_image_at := old.consent_image_at;
  end if;
  return new;
end;
$$;

create or replace function public.dater_consent_image_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.consent_image_at := case when new.consent_image is null then null else now() end;
  return new;
end;
$$;

drop trigger if exists profiles_dater_consent_image on public.profiles;
create trigger profiles_dater_consent_image
  before update on public.profiles
  for each row execute function public.dater_consent_image();

drop trigger if exists profiles_dater_consent_image_insert on public.profiles;
create trigger profiles_dater_consent_image_insert
  before insert on public.profiles
  for each row execute function public.dater_consent_image_insert();

-- Le membre change sa réponse depuis son profil, quand il veut.
grant update (consent_image) on public.profiles to authenticated;
