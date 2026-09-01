-- NULLL.CLUB — RLS sur les commandes, et index manquants.
--
-- 0002 a cree checkout_orders et checkout_order_items sans activer RLS.
-- Dans Supabase, une table du schema public sans RLS est exposee par
-- PostgREST aux roles anon et authenticated. La cle anon voyage dans le
-- navigateur de chaque visiteur : nom, prenom, e-mail et telephone de
-- toutes les commandes etaient donc lisibles par n'importe qui.
--
-- Les commandes sont ecrites par le service role (app/api/checkout), qui
-- contourne RLS. Activer RLS sans aucune policy ferme la lecture publique
-- sans rien casser — meme parti pris que app_config, partners et
-- partner_access_codes dans 0001.

alter table public.checkout_orders enable row level security;
alter table public.checkout_order_items enable row level security;

-- Aucune policy, volontairement : ces deux tables sont reservees au
-- service role. Toute policy ajoutee ici ouvrirait des donnees
-- personnelles a des clients non authentifies.

-- L'historique membre filtre points_log par user_id puis trie par date
-- (app/membre/(panel)/historique). 0001 ne posait aucun index dessus :
-- la requete balayait toute la table a chaque affichage.
create index if not exists points_log_user_id_created_at_idx
  on public.points_log (user_id, created_at desc);

-- Les lignes d'une commande ne sont jamais lues autrement que par
-- order_id, et une cle etrangere ne cree pas d'index cote enfant.
create index if not exists checkout_order_items_order_id_idx
  on public.checkout_order_items (order_id);
