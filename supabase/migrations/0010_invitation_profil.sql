-- NULLL.CLUB — fenetre « complete ton profil » a la premiere connexion.
-- Decision du 12/09/2026 : facultative, montree une seule fois. Le drapeau
-- est ecrit par le serveur (cle service) ; aucun droit pour les membres.
alter table public.profiles add column if not exists invitation_profil_vue boolean not null default false;
