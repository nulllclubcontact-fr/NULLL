# État du chantier admin et sécurité, et ce qu'il reste à faire

Écrit le 25 septembre 2026 après la mise en production du commit `cd2c192`. C'est le document à ouvrir en premier : il dit ce qui est en place, ce qui attend une clé ou un compte, et ce qui reste à décider. Les détails sont dans les autres fichiers de ce dossier.

## 1. Ce qui est fait et en production

| Domaine | En place |
| --- | --- |
| **Traçabilité** | Journal d'administration en ajout seul, douze mois (`/admin/journal`). Journal des connexions : connexions, échecs, blocages, codes, mots de passe, six mois, IP tronquées. Exports d'inscrits et sauvegardes tracés avec leur auteur. |
| **Comptes admin** | Double vérification TOTP, volontaire puis imposée par le code et par la base (`is_admin()`). Session admin de douze heures. Page Équipe : ajout et retrait d'un admin par e-mail, retrait de la double vérification en cas de téléphone perdu. |
| **Connexion** | Dix essais par quart d'heure et par identifiant, trente par adresse, blocage tracé. Réinitialisation et changement de mot de passe tracés. |
| **Barrages** | `/admin/*` renvoyé à la connexion sans session, avant tout rendu (`proxy.ts`). Identifiants validés avant la base. Raccourcis de statut qui n'avancent que dans un sens. |
| **Base** | 16 tables sur 16 avec RLS, 15 fonctions privilégiées toutes avec `search_path` fixé. Migrations 0013 à 0016 jouées sur `nulll-supabase`. |
| **En-têtes** | nosniff, X-Frame-Options, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS (Vercel). CSP complète en observation, rapports dans les logs via `/api/csp`. |
| **Supervision** | `/api/sante` (200 ou 503). Erreurs serveur en JSON dans les logs Vercel. SDK Sentry câblé serveur, edge et navigateur, inactif tant que le DSN manque. |
| **Qualité** | CI GitHub « Qualité » : lint, types, tests à chaque push et PR. Job SonarCloud prêt, sauté tant que le secret manque. Gabarit de PR. 15 tests unitaires sur les règles admin. |
| **Terrain** | Pointage manuel depuis la fiche. Duplication d'une sortie à sept jours. Scans conservés hors ligne et renvoyés au retour du réseau. Redirection vers la fiche après création. |
| **Tableau de bord Sécurité** | `/admin/securite`, lisible avant tout : ton compte, admins protégés, sessions, tentatives freinées, déploiement, base (RLS, taille, tables lourdes), en-têtes vérifiés sur le site, équipe, sessions admin, journal des connexions avec filtres, services testés avec temps de réponse, activité de l'équipe, cartes Sentry, SonarCloud, GitHub, UptimeRobot, sauvegarde, checklists Sécurité (22 points) et RGPD (12 points). |
| **Documentation** | `docs/admin` : méthode, audit, spécifications, backlog, recette, exploitation. |

## 2. Ce qui attend une clé, un jeton ou un compte

Tout se pose dans Vercel → le projet `nulll` → Settings → Environment Variables, pour Production et Preview, puis un redéploiement (Deployments → ⋯ → Redeploy). Tant qu'une variable manque, la carte correspondante de la page Sécurité affiche « À configurer » avec son nom.

| Service | À créer | Variables | Où c'est expliqué |
| --- | --- | --- | --- |
| **Sentry** (erreurs en production) | Compte sentry.io, organisation, projet Next.js. Jeton avec `project:read`, `event:read`, `org:read`. | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | `05-exploitation.md`, section « Sentry » |
| **SonarCloud** (qualité du code) | Compte sonarcloud.io via GitHub, import du dépôt, clé de projet `nulllclubcontact-fr_NULLL`, analyse par CI. Jeton personnel. | GitHub → Secrets → `SONAR_TOKEN`. Vercel → `SONAR_PROJECT_KEY=nulllclubcontact-fr_NULLL` | `05-exploitation.md`, section « SonarCloud » |
| **GitHub** (chaîne CI) | Rien d'obligatoire, le dépôt est public. Facultatif : jeton à granularité fine, dépôt NULLL, permission Actions en lecture. | `GITHUB_TOKEN` (facultatif) | `05-exploitation.md` |
| **UptimeRobot** (disponibilité) | Compte uptimerobot.com, moniteur HTTP sur `https://nulll.club/api/sante` toutes les 5 minutes, alerte e-mail. Clé API **en lecture seule**. | `UPTIMEROBOT_API_KEY` | `05-exploitation.md`, section « UptimeRobot » |
| **Resend** (carte Services, e-mails) | Déjà en place pour les mails. La carte lit les domaines vérifiés avec la clé existante. | `RESEND_API_KEY` (déjà posée) | rien à faire |
| **Visites** | Facultatif : identifiants de compte à exclure du compteur en plus des admins. | `VISITES_EQUIPE` | `.env.example` |

Pour tester en local : les mêmes variables dans `.env.local`, qui n'est jamais commité.

## 3. Réglages à faire une fois, sans code

1. **GitHub → Settings → Branches → `main`** : « Require status checks to pass », cocher « Lint, types, tests ». Sans ça, la CI prévient mais n'empêche rien.
2. **Supabase → Authentication → Multi-Factor → TOTP** : vérifié activé le 25 septembre (l'enrôlement a fonctionné).
3. **Supabase → Authentication → Password** : aligner la longueur minimale sur celle que le site imposera (voir point 4 ci-dessous).
4. **Vercel → Settings → Spend Management** : plafond et alertes.

## 4. Nettoyage de la recette du 25 septembre

- Retirer l'accès admin de `recette-claude@test.nulll.club` depuis `/admin/equipe` (avec un autre compte admin). Le compte a la double vérification active et sert de preuve que le flux fonctionne ; il peut ensuite être supprimé côté Supabase.
- Supprimer la sortie « Recette Claude : sortie test » du 3 octobre si elle existe encore (elle était publiée, donc visible sur le site).
- Tom et Tobias : première connexion après le déploiement, l'administration demandera une reconnexion (session de plus de douze heures), puis proposera d'activer la double vérification dans Sécurité. À faire tous les deux.

## 5. Ce qui reste à décider ou à faire (par ordre conseillé)

| Priorité | Quoi | Nature |
| --- | --- | --- |
| 1 | Poser les clés du point 2 et faire les réglages du point 3 | Comptes et réglages, une heure |
| 2 | Mots de passe : 12 caractères minimum et refus des mots de passe fuités (Have I Been Pwned, k-anonymat) | Code, une demi-journée, voir `06-securite-a-apporter.md` point 2 |
| 3 | `pnpm audit --audit-level=high` dans la CI, et Dependabot (`.github/dependabot.yml`, ajouté avec ce document) | Code, une heure |
| 4 | Base de staging séparée de la production (A-10) | Infrastructure Supabase, une demi-journée |
| 5 | CSP en mode blocage après deux semaines de rapports propres (A-12), puis nonces | Code, mi-octobre |
| 6 | Sauvegarde automatique horaire par GitHub Actions et test de restauration hebdomadaire | Code et secrets GitHub, un jour ; en attendant, bouton « Télécharger une sauvegarde » |
| 7 | Registre des traitements RGPD, sous-traitants et transferts écrits dans la politique de confidentialité, export des données du membre en un clic | Rédaction et code, un jour |
| 8 | Tests de bout en bout du scanner et de la connexion (Playwright) sur la preview | Code, deux jours |
| 9 | Règles SonarJS en local (`eslint-plugin-sonarjs`) | Dépendance, à décider |

## 6. Comment continuer

- Le backlog vivant est `03-backlog.md` ; la recette à rejouer est `04-recette.md` ; quand ça casse, `05-exploitation.md`.
- Chaque livraison passe par une branche et une PR, la CI, la recette sur la preview, puis `main`. Vercel déploie `main` tout seul.
- `06-securite-a-apporter.md` a été écrit par une autre session le même jour ; ses points 1 (limiteur de connexion) et 8 (Sentry) sont faits, le reste est repris dans le tableau ci-dessus.
