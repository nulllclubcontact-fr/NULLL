-- NULLL.CLUB — compteur de visites des pages publiques (22/09/2026).
--
-- Mesure d'audience maison, sans cookie : le visiteur n'est reconnu que
-- par une empreinte du jour (adresse, navigateur et date passés dans un
-- hachage salé). Elle change chaque jour et ne permet pas de retrouver
-- l'adresse. On ne garde que 13 mois, la durée admise par la CNIL.
create table if not exists public.visites (
  id bigint generated always as identity primary key,
  jour date not null default (now() at time zone 'Europe/Paris')::date,
  visiteur text not null,
  chemin text not null,
  source text,
  created_at timestamptz not null default now()
);

create index if not exists visites_jour_idx on public.visites (jour);

-- Aucune policy : seul le serveur (clé de service) lit et écrit.
alter table public.visites enable row level security;
revoke all on public.visites from anon, authenticated;

-- Par jour : visiteurs distincts et pages vues. Les 13 mois dépassés
-- partent au passage, sans tâche planifiée à entretenir.
create or replace function public.stats_visites(p_debut date, p_fin date)
returns table (jour date, visiteurs bigint, pages bigint)
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.visites where visites.jour < (now() at time zone 'Europe/Paris')::date - interval '13 months';

  return query
    select v.jour, count(distinct v.visiteur), count(*)
    from public.visites v
    where v.jour between p_debut and p_fin
    group by v.jour
    order by v.jour;
end;
$$;

revoke all on function public.stats_visites(date, date) from public, anon, authenticated;
grant execute on function public.stats_visites(date, date) to service_role;
