-- NULLL.CLUB — le champ « À savoir sur ta santé » a disparu du profil.
-- A appliquer une fois le code qui ne l'envoie plus deploye : la version
-- precedente ecrivait encore medical_notes et serait refusee.

revoke update (medical_notes) on public.profiles from authenticated;
update public.profiles set medical_notes = null where medical_notes is not null;
