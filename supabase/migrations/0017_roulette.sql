-- NULLL.CLUB — roulette de l'accueil (28/09/2026).
--
-- Un visiteur tourne la roue une fois : il gagne une Red Bull, une Bee Zen
-- ou rien. Le tirage est fait par le serveur ; un gain donne un code à
-- montrer le samedi, que l'équipe marque « remis ». Aucune donnée
-- personnelle : le visiteur n'est reconnu que par un cookie aléatoire et
-- une empreinte hachée de son adresse (limite d'abus), comme les visites.
create table if not exists public.roulette_tirages (
  id uuid primary key default gen_random_uuid(),
  lot text not null check (lot in ('redbull', 'beezen', 'rien')),
  code text unique,
  empreinte text not null,
  created_at timestamptz not null default now(),
  remis_at timestamptz,
  remis_par uuid references auth.users (id) on delete set null,
  constraint roulette_code_si_gain check ((lot = 'rien') = (code is null))
);

create index if not exists roulette_tirages_gains_idx on public.roulette_tirages (lot, created_at) where lot <> 'rien';

-- Aucune policy : seul le serveur (clé de service) lit et écrit.
alter table public.roulette_tirages enable row level security;
revoke all on public.roulette_tirages from anon, authenticated;
