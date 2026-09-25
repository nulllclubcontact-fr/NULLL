-- NULLL.CLUB — journal des connexions et taille de la base (25/09/2026).
--
-- 1. journal_auth : connexions réussies ou refusées, blocages du
--    limiteur, déconnexions, codes de double vérification, mots de passe.
--    Le journal Supabase (auth.audit_log_entries) est vide sur ce projet ;
--    on tient le nôtre. Ajout seul, purge à six mois (durée admise par la
--    CNIL pour des journaux de connexion), lecture par la clé de service.
--    L'adresse IP est tronquée dès l'écriture.
-- 2. etat_securite : taille de la base, tables les plus lourdes, activité
--    des admins sur sept jours, en plus de ce que la 0015 donnait.

create table if not exists public.journal_auth (
  id bigint generated always as identity primary key,
  user_id uuid,
  identifiant text,
  action text not null,
  ip text,
  navigateur text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists journal_auth_created_idx on public.journal_auth (created_at desc);
create index if not exists journal_auth_identifiant_idx on public.journal_auth (identifiant, created_at desc);

alter table public.journal_auth enable row level security;
revoke all on public.journal_auth from anon, authenticated;

create or replace function public.journal_auth_immuable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' and old.created_at < now() - interval '6 months' then
    return old;
  end if;

  raise exception 'journal_auth : ajout seul';
end;
$$;

revoke all on function public.journal_auth_immuable() from public, anon, authenticated;

drop trigger if exists journal_auth_sans_modification on public.journal_auth;
create trigger journal_auth_sans_modification
  before update or delete on public.journal_auth
  for each row execute function public.journal_auth_immuable();

-- Les dernières entrées avec le prénom quand le compte existe, et la
-- purge à six mois au passage.
create or replace function public.lire_journal_auth(p_limite integer default 200)
returns table (
  id bigint,
  user_id uuid,
  prenom text,
  identifiant text,
  action text,
  ip text,
  navigateur text,
  details jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.journal_auth j where j.created_at < now() - interval '6 months';

  return query
    select j.id, j.user_id, p.first_name, j.identifiant, j.action, j.ip, j.navigateur, j.details, j.created_at
    from public.journal_auth j
    left join public.profiles p on p.id = j.user_id
    order by j.created_at desc
    limit greatest(1, least(coalesce(p_limite, 200), 1000));
end;
$$;

revoke all on function public.lire_journal_auth(integer) from public, anon, authenticated;
grant execute on function public.lire_journal_auth(integer) to service_role;

-- Compteurs sur une fenêtre, sans ramener les lignes.
create or replace function public.compter_journal_auth(p_heures integer default 24)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'connexions', count(*) filter (where action = 'login_success'),
    'echecs', count(*) filter (where action in ('login_failure', 'mfa_failure', 'password_failure')),
    'blocages', count(*) filter (where action in ('login_blocked', 'mfa_blocked')),
    'identifiants_vises', (
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select identifiant, count(*) as essais
        from public.journal_auth
        where created_at > now() - make_interval(hours => p_heures)
          and action in ('login_failure', 'login_blocked')
          and identifiant is not null
        group by identifiant
        having count(*) >= 3
        order by count(*) desc
        limit 5
      ) x
    )
  )
  from public.journal_auth
  where created_at > now() - make_interval(hours => p_heures);
$$;

revoke all on function public.compter_journal_auth(integer) from public, anon, authenticated;
grant execute on function public.compter_journal_auth(integer) to service_role;

-- ------------------------------------------------------------------
-- etat_securite : + taille, tables lourdes, activité
-- ------------------------------------------------------------------
create or replace function public.etat_securite()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v jsonb;
begin
  select jsonb_build_object(
    'tables', (
      select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
    ),
    'tables_avec_rls', (
      select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
    ),
    'tables_sans_rls', (
      select coalesce(jsonb_agg(c.relname order by c.relname), '[]'::jsonb)
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
    ),
    'policies', (select count(*) from pg_policies where schemaname = 'public'),
    'fonctions_definer', (
      select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prosecdef
    ),
    'definer_sans_search_path', (
      select coalesce(jsonb_agg(p.proname order by p.proname), '[]'::jsonb)
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prosecdef
        and (p.proconfig is null or not exists (select 1 from unnest(p.proconfig) c where c like 'search_path=%'))
    ),
    'journal_lignes', (select count(*) from public.journal_admin),
    'journal_plus_ancien', (select min(created_at) from public.journal_admin),
    'limites_actives', (select count(*) from public.rate_limits where fin_fenetre > now()),
    'limites_max', (select coalesce(max(compte), 0) from public.rate_limits where fin_fenetre > now()),
    'membres', (select count(*) from public.profiles),
    'membres_bannis', (select count(*) from auth.users where banned_until > now()),
    'taille_base_octets', pg_database_size(current_database()),
    'tables_lourdes', (
      select coalesce(jsonb_agg(jsonb_build_object('table', t.relname, 'octets', t.taille, 'lignes', t.lignes) order by t.taille desc), '[]'::jsonb)
      from (
        select c.relname, pg_total_relation_size(c.oid) as taille, c.reltuples::bigint as lignes
        from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public' and c.relkind = 'r'
        order by pg_total_relation_size(c.oid) desc
        limit 6
      ) t
    ),
    'activite', (
      select coalesce(jsonb_agg(jsonb_build_object('admin_id', a.admin_id, 'prenom', p.first_name, 'actions', a.actions, 'derniere', a.derniere) order by a.actions desc), '[]'::jsonb)
      from (
        select j.admin_id, count(*) as actions, max(j.created_at) as derniere
        from public.journal_admin j
        where j.created_at > now() - interval '7 days'
        group by j.admin_id
      ) a left join public.profiles p on p.id = a.admin_id
    ),
    'admins', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', p.id,
        'prenom', p.first_name,
        'nom', p.last_name,
        'derniere_connexion', u.last_sign_in_at,
        'fournisseur', u.raw_app_meta_data ->> 'provider',
        'email_confirme', u.email_confirmed_at is not null,
        'banni', u.banned_until is not null and u.banned_until > now(),
        'double_verification', exists (
          select 1 from auth.mfa_factors f where f.user_id = p.id and f.status = 'verified'
        )
      ) order by u.last_sign_in_at desc nulls last), '[]'::jsonb)
      from public.profiles p join auth.users u on u.id = p.id
      where p.role = 'admin'
    ),
    'sessions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', s.id,
        'user_id', s.user_id,
        'prenom', p.first_name,
        'aal', s.aal::text,
        'depuis', s.created_at,
        'rafraichie', s.refreshed_at,
        'expire', s.not_after,
        'navigateur', left(coalesce(s.user_agent, ''), 160),
        'ip', case when s.ip is null then null else regexp_replace(host(s.ip), '[.:][0-9a-f]+$', '.x') end
      ) order by coalesce(s.refreshed_at, s.created_at) desc), '[]'::jsonb)
      from auth.sessions s join public.profiles p on p.id = s.user_id
      where p.role = 'admin'
    )
  ) into v;

  return v;
end;
$$;

revoke all on function public.etat_securite() from public, anon, authenticated;
grant execute on function public.etat_securite() to service_role;
