-- NULLL.CLUB — repare la generation du jeton QR.
--
-- Trouve en jouant le parcours complet dans une transaction annulee :
-- register_for_race echouait sur
--   « function gen_random_bytes(integer) does not exist ».
--
-- pgcrypto est installe dans le schema « extensions », pas « public ».
-- Les fonctions security definer posent « set search_path = public »,
-- ce qui protege d'un detournement de resolution de noms mais retire
-- « extensions » du chemin. Le corps d'une fonction plpgsql resout ses
-- noms a l'execution : le declencheur ne trouvait donc plus la fonction.
--
-- Les valeurs par defaut des colonnes ne souffrent pas du probleme :
-- PostgreSQL les resout une fois, a la creation de la table, et garde la
-- reference. C'est pour cela que les inscriptions membres de 0001
-- fonctionnaient malgre le meme motif.
--
-- Le declencheur porte desormais son propre chemin, qui inclut
-- « extensions ». On garde un chemin explicite plutot que de le laisser
-- vide : une fonction sans search_path fixe herite de celui de l'appelant.

create or replace function public.force_registration_token()
returns trigger
language plpgsql
set search_path = public, extensions
as $$
begin
  new.qr_code_token = encode(gen_random_bytes(24), 'hex');
  return new;
end;
$$;
