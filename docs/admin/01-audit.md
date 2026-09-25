# Audit technique et sécurité — espace admin

Date : 25 septembre 2026. Périmètre : `app/admin/**`, `lib/admin/**`, `middleware.ts`, les migrations Supabase qui portent les droits admin, et la route `/api/visite` qui reconnaît les admins. Méthode : lecture du code et des migrations, exécution de `lint`, `typecheck`, `test`, comparaison avec les pratiques attendues (OWASP ASVS niveau 1, recommandations CNIL sur la traçabilité).

## Ce qui est déjà bien

Il faut le dire avant les constats : la base est solide, bien au-dessus d'un site associatif moyen.

- **Le rôle admin est relu en base à chaque requête** (`requireAdminUser`, `isAdminUser`), jamais déduit d'un cookie. Un membre ordinaire qui tape l'URL est renvoyé vers son espace sans apprendre que la page existe.
- **La RLS fait le deuxième barrage.** `is_admin()` est une fonction `security definer` ; les policies `races_admin_*`, `registrations_admin_*`, `profiles_select_admin` s'appuient dessus. Même un bug dans le code Next ne donnerait pas les données à un non-admin.
- **La migration 0006 a fermé la faille classique** : un membre ne peut plus écrire `role = 'admin'` sur sa propre ligne (`revoke insert, update, delete on profiles`, puis `grant update` colonne par colonne).
- **Le scan est atomique côté SQL** (`checkin_by_token` verrouille l'inscription avec `for update`, trace chaque tentative dans `checkins`, y compris les refus).
- **Les codes partenaires** sont générés côté serveur (`randomBytes(9)`), affichés une seule fois, stockés en bcrypt.
- **Les limiteurs sont partagés** entre instances serverless via la table `rate_limits` (migration 0008), pas en mémoire.
- **L'export CSV neutralise les formules** (`champ()` préfixe `=`, `+`, `-`, `@`), avec tests.
- **Les photos** partent du navigateur vers Supabase par URL signée à usage unique ; le serveur ne relaie pas le fichier. Seule une URL de notre bucket est acceptée en base.
- **Les en-têtes de sécurité** sont posés globalement (`nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Referrer-Policy`, `Permissions-Policy` qui limite la caméra au site).
- **Les pages admin sont `noindex`** et rendues dynamiquement, donc jamais mises en cache.
- **Une lecture en échec s'affiche comme telle** sur le tableau de bord, pas comme un zéro rassurant.

## Constats

Chaque constat porte un niveau (critique, problématique, bénin), une référence, et son état. Le niveau suit la grille de `README.md`.

### Sécurité

| # | Niveau | Constat | État |
| --- | --- | --- | --- |
| S1 | Problématique | **Aucune trace des actions d'administration.** Export des inscrits (e-mails, téléphones), suppression ou annulation d'une sortie, création d'un partenaire, émission d'un code : rien ne dit qui l'a fait ni quand. Les scans sont tracés (`checkins`), le reste non. La CNIL attend un registre des accès aux données personnelles ; sans lui, impossible de répondre à « qui a exporté la liste du 12 septembre ? ». | **Corrigé sprint 1** : migration `0013_journal_admin.sql` (table en ajout seul, purge à 12 mois), `lib/admin/journal.ts`, page `/admin/journal`, appels dans toutes les actions et l'export. |
| S2 | Problématique | **`/admin` n'a aucun barrage avant le rendu.** Le layout `(courses)` protège ses pages, mais la route `export` compte sur son propre contrôle, et toute future page posée hors du groupe `(courses)` serait ouverte par défaut. Le middleware ne couvre que `/pro`. | **Corrigé sprint 1** : le middleware redirige vers la connexion tout appel à `/admin/*` sans cookie de session Supabase. Le contrôle en base reste dans `requireAdminUser`. |
| S3 | Bénin | **Identifiants non validés avant la requête.** `race_id`, `partner_id`, `[id]` de l'export partaient tels quels à Postgres. Un identifiant mal formé provoquait une erreur SQL absorbée en « introuvable » ; sans risque d'injection (requêtes paramétrées), mais bruyant dans les logs et fragile. `lib/admin/repo.ts` et `sortie-choisie.ts` validaient déjà, les actions non. | **Corrigé sprint 1** : `identifiantValide()` dans `lib/admin/regles.ts`, appliqué à toutes les actions et à l'export. |
| S4 | Bénin | **Le raccourci de statut acceptait n'importe quelle transition.** Depuis la liste, un formulaire forgé pouvait passer une sortie « terminée » à « publiée » sans passer par la fiche. | **Corrigé sprint 1** : `transitionRapidePermise()` n'autorise que publier, fermer, terminer. La fiche complète garde toutes les possibilités. |
| S5 | Problématique | **Pas de second facteur pour les comptes admin.** Un mot de passe volé (hameçonnage, fuite) donne l'admin entier : exports, codes partenaires, annulation de sorties. Supabase Auth propose le TOTP (`auth.mfa`) sans dépendance. | **Corrigé sprint 2** : TOTP volontaire par admin (`/admin/securite`), exigé à l'entrée (`/admin/verification`) et par `is_admin()` en base (migration 0014). Un autre admin peut le retirer en cas de téléphone perdu (`/admin/equipe`). |
| S6 | Bénin | **Sessions admin longues.** Sans « session courte », le cookie Supabase vaut 400 jours. Pour un compte qui manipule des données personnelles, une expiration plus courte (ou une reconnexion avant export) serait plus prudente. | **Corrigé sprint 2** : douze heures après la connexion, `/admin/*` renvoie à la connexion (`sessionAdminExpiree`, `/admin/reconnexion`). La session membre continue. |
| S7 | Bénin | **Pas de CSP complète.** `next.config.mjs` l'explique : le bouton Google et Supabase chargent des scripts qu'une politique stricte casserait. `frame-ancestors 'none'` est posé. Une CSP en mode `report-only` permettrait de mesurer avant de bloquer. | **Corrigé sprint 3, en observation** : CSP complète en `Report-Only`, rapports dans les logs via `/api/csp`. Passage en blocage après deux semaines propres. |
| S8 | Bénin | **Les identifiants de l'équipe sont en dur dans `/api/visite`.** Deux UUID dans le code pour exclure Tom et Tobias des statistiques. Fonctionne, mais un changement de compte demande un déploiement. Le rôle admin est déjà exclu par ailleurs. | **Corrigé sprint 3** : variable `VISITES_EQUIPE`, les deux comptes actuels restent exclus par défaut. |
| S9 | Bénin | **Les admins sont nommés à la main en base.** Aucune interface pour donner ou retirer le rôle, donc aucune trace (voir S1) de qui a été promu. | **Corrigé sprint 2** : `/admin/equipe`, ajout par e-mail d'un membre existant, retrait (jamais soi-même, jamais le dernier), tout au journal. |

### Qualité et maintenabilité

| # | Niveau | Constat | État |
| --- | --- | --- | --- |
| Q1 | Problématique | **Aucune intégration continue.** `lint`, `typecheck`, `test` existent dans `package.json` mais rien ne les exécute sur une PR. Un `git push` cassé part en production via Vercel. | **Corrigé sprint 1** : `.github/workflows/qualite.yml`. À activer comme « required check » dans les réglages de la branche `main` (voir `05-exploitation.md`). |
| Q2 | Problématique | **Les règles métier de l'admin n'étaient pas testables.** `slugifier`, `lireNombres`, la liste des statuts vivaient dans le fichier d'actions (`"use server"`), inaccessibles à `node --test`. | **Corrigé sprint 1** : `lib/admin/regles.ts` + `regles.test.ts` (6 tests, 30 assertions). |
| Q3 | Problématique | **Aucune remontée d'erreur serveur.** `app/error.tsx` affiche une page propre mais ne signale rien. Une panne de Supabase à 8 h un samedi (jour de scan) ne serait vue que par les admins sur place. | **Corrigé sprint 1** : `instrumentation.ts` (`onRequestError`) écrit une ligne JSON par erreur dans les logs Vercel ; `/api/sante` répond 200 ou 503 pour une sonde externe. Alerte à brancher (voir `05-exploitation.md`). |
| Q4 | Bénin | **Pas de gabarit de PR ni de checklist de revue.** Les commits partent directement sur `main`. | **Corrigé sprint 1** : `.github/pull_request_template.md`. |
| Q5 | Bénin | **Pas d'environnement de staging nommé.** Vercel crée une preview par branche, mais la base Supabase est la même qu'en production : une migration testée sur une preview s'applique à la prod. | **À faire, infrastructure** (A-10) : projet Supabase de staging, ou branche Supabase. Documenté dans `05-exploitation.md`. |
| Q6 | Bénin | **`middleware.ts` porte le nom déprécié.** Next 16 préfère `proxy.ts`. Fonctionne, avertissement possible aux prochaines versions. | **Corrigé sprint 3** : `proxy.ts`. |
| Q7 | Bénin | **Un avertissement lint** hors admin (`app/opengraph-image.tsx`, balise `<img>`). Sans conséquence : cette image est générée côté serveur. | Laissé tel quel, hors périmètre. |

### Fonctionnel (création et gestion des sorties)

| # | Niveau | Constat | État |
| --- | --- | --- | --- |
| F1 | Bénin | **Pas de retour arrière visible sur une suppression.** La suppression est en deux temps (résumé puis confirmation), sans JavaScript, c'est bien. Mais après coup, rien ne dit à l'équipe que la sortie a été supprimée ni par qui. | **Corrigé sprint 1** via le journal (S1). |
| F2 | Bénin | **La création ne renvoie pas vers la fiche.** Après « Créer », le message reste dans le formulaire replié ; l'admin doit chercher la sortie dans la liste pour ajouter la photo ou vérifier. | **Corrigé sprint 2** : redirection vers la fiche avec un bandeau « Sortie créée en brouillon ». |
| F3 | Bénin | **Pas de duplication de sortie.** Les sorties se répètent (même lieu, même heure, chaque samedi) et sont ressaisies à chaque fois. | **Corrigé sprint 3** : « Dupliquer (+7 jours) » sur la fiche, en brouillon, sans photo. |
| F4 | Bénin | **Le scanner ne fonctionne qu'en ligne.** Un scan sans réseau échoue silencieusement (« Scan impossible »). Sur un parking à 8 h, le réseau n'est pas garanti. | **Corrigé sprint 3** : file d'attente dans le navigateur, renvoi au retour du réseau. L'heure de pointage est celle du renvoi. |
| F5 | Bénin | **Pas de pointage manuel.** Un membre sans téléphone (batterie vide) ne peut pas être marqué présent ; l'admin doit passer par Supabase. | **Corrigé sprint 2** : bouton « Pointer » sur la fiche, même fonction de décision et même trace (`checkins`, note « manuel »). |

## Vérifications exécutées

| Commande | Avant sprint 1 | Après sprint 1 |
| --- | --- | --- |
| `pnpm typecheck` | OK | OK |
| `pnpm lint` | 1 avertissement (hors admin) | 1 avertissement (hors admin) |
| `pnpm test` | 6 tests, 0 échec | 15 tests, 0 échec |
| `pnpm install --frozen-lockfile` (pnpm 10) | OK | OK |

Aucun test end-to-end n'existe ; le scanner et les formulaires sont recettés à la main (voir `04-recette.md`).
