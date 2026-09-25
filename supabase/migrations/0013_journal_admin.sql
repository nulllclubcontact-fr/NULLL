-- NULLL.CLUB — journal des actions d'administration (25/09/2026).
--
-- Qui a fait quoi, quand. Les scans ont déjà leur trace dans checkins ;
-- ici on garde le reste : export des inscrits (données personnelles),
-- création, modification, annulation ou suppression d'une sortie,
-- changement de statut, partenaires et codes d'accès.
--
-- Le journal est en ajout seul : ni mise à jour ni effacement, même avec
-- la clé de service. Il se purge tout seul au bout de douze mois, à la
-- lecture, comme les visites (migration 0012).
create table if not exists public.journal_admin (
  id bigint generated always as identity primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  cible text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists journal_admin_created_idx on public.journal_admin (created_at desc);

-- Aucune policy : seul le serveur (clé de service) écrit et lit.
alter table public.journal_admin enable row level security;
revoke all on public.journal_admin from anon, authenticated;

-- Ajout seul, quel que soit le rôle : un journal qu'on peut réécrire ne
-- prouve rien.
create or replace function public.journal_admin_immuable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' and old.created_at < now() - interval '12 months' then
    return old;
  end if;

  raise exception 'journal_admin : ajout seul';
end;
$$;

revoke all on function public.journal_admin_immuable() from public, anon, authenticated;

drop trigger if exists journal_admin_sans_modification on public.journal_admin;
create trigger journal_admin_sans_modification
  before update or delete on public.journal_admin
  for each row execute function public.journal_admin_immuable();

-- Lecture pour la page « Journal » : les entrées les plus récentes avec le
-- prénom de l'admin. Les douze mois dépassés partent au passage.
create or replace function public.lire_journal_admin(p_limite integer default 200)
returns table (
  id bigint,
  admin_id uuid,
  prenom text,
  nom text,
  action text,
  cible text,
  details jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.journal_admin j where j.created_at < now() - interval '12 months';

  return query
    select j.id, j.admin_id, p.first_name, p.last_name, j.action, j.cible, j.details, j.created_at
    from public.journal_admin j
    left join public.profiles p on p.id = j.admin_id
    order by j.created_at desc
    limit greatest(1, least(coalesce(p_limite, 200), 500));
end;
$$;

revoke all on function public.lire_journal_admin(integer) from public, anon, authenticated;
grant execute on function public.lire_journal_admin(integer) to service_role;
