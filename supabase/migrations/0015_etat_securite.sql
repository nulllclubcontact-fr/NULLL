-- NULLL.CLUB — état de sécurité pour le tableau de bord admin (25/09/2026).
--
-- Une seule fonction, lue avec la clé de service, qui rassemble ce que
-- seule la base sait : RLS et policies, fonctions sensibles, sessions
-- des admins, limiteurs en cours, taille du journal. Rien n'est écrit.
-- Les adresses IP des sessions sont tronquées : la page sert à repérer
-- une session inconnue, pas à pister un collègue.
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
