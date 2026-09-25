# Backlog — espace admin

Kanban de suivi. Une ligne par user story, avec son sprint, son état et sa taille (S : moins d'une demi-journée, M : une journée, L : deux à trois jours). Les références S1…, Q1…, F1… renvoient à `01-audit.md`.

États : `à faire` · `en cours` · `à recetter` · `fait`.

## Sprint 1 — semaine du 22 septembre 2026 · « On sait qui fait quoi, et on le voit quand ça casse »

| Réf. | En tant que… je veux… afin de… | Taille | Audit | État |
| --- | --- | --- | --- | --- |
| A-01 | admin, retrouver qui a exporté, supprimé, annulé ou créé quoi et quand, afin de répondre à une question de membre ou de la CNIL | M | S1, F1 | à recetter |
| A-02 | admin, que toute tentative d'atteindre `/admin` sans être connecté soit renvoyée à la connexion avant même le rendu, afin de fermer les routes qu'un layout ne couvre pas | S | S2 | à recetter |
| A-03 | développeur, que les identifiants reçus des formulaires soient validés avant la base, afin d'éviter des erreurs SQL bruyantes et des comportements fragiles | S | S3 | à recetter |
| A-04 | admin, que les raccourcis de statut n'avancent que dans un sens, afin qu'un formulaire forgé ne republie pas une sortie terminée | S | S4 | à recetter |
| A-05 | développeur, que lint, types et tests tournent sur chaque PR, et que les règles métier de l'admin aient des tests, afin de ne plus pousser du code cassé en prod | M | Q1, Q2, Q4 | à recetter |
| A-05b | équipe, être prévenue quand le site ou sa base ne répond plus, et retrouver une erreur serveur dans les logs, afin de réagir avant les membres | S | Q3 | à recetter (sonde externe à brancher, voir `05-exploitation.md`) |

**Livré dans le code** : migration `0013_journal_admin.sql`, `lib/admin/journal.ts`, `lib/admin/regles.ts` + tests, page `/admin/journal` et son onglet, `middleware.ts`, `instrumentation.ts`, `app/api/sante/route.ts`, `.github/workflows/qualite.yml`, `.github/pull_request_template.md`, actions sorties et partenaires, export CSV.

**Reste à faire pour clore le sprint** : jouer la migration 0013 sur Supabase, recette (voir `04-recette.md`), activer le check « Qualité » comme obligatoire sur `main`, brancher une sonde sur `/api/sante`.

## Sprint 2 — « Un admin, c'est un compte qu'on protège »

| Réf. | En tant que… je veux… afin de… | Taille | Audit | État |
| --- | --- | --- | --- | --- |
| A-06 | admin sur le parking, marquer présent un membre dont le téléphone est déchargé, afin de ne pas le compter absent | M | F5 | à recetter |
| A-07 | admin, activer un second facteur (application TOTP) et devoir le saisir pour entrer dans `/admin`, afin qu'un mot de passe volé ne suffise pas | L | S5 | à recetter |
| A-08 | admin, que ma session admin expire plus vite qu'une session membre (12 h), afin de limiter ce qu'un appareil oublié expose | S | S6 | à recetter |
| A-09 | admin, donner ou retirer le rôle admin à un membre depuis l'interface, avec trace au journal, afin de ne plus passer par la console Supabase | M | S9 | à recetter |
| A-10 | développeur, une base de staging séparée de la production, afin de tester une migration sans risque | M | Q5 | à faire (infrastructure, pas de code : voir `05-exploitation.md`) |
| A-11 | admin, être emmené sur la fiche de la sortie juste après l'avoir créée, afin d'ajouter la photo et vérifier sans la chercher | S | F2 | à recetter |

**Livré dans le code** : migration `0014_pointage_manuel_et_double_verification.sql` (fonction `pointer_inscription`, `is_admin()` qui exige aal2 quand un facteur est vérifié), `lib/admin/require-admin.ts` (session 12 h, double vérification), `/admin/verification`, `/admin/reconnexion`, `/admin/securite`, `/admin/equipe` et leurs actions, bouton « Pointer » sur la fiche, redirection vers la fiche après création.

**Ajouté pendant la recette du 25 septembre** : la page Sécurité est devenue un tableau de bord (migration `0015_etat_securite.sql`, `lib/admin/securite.ts`) : état des comptes et de la double vérification de toute l'équipe, sessions admin actives avec leur niveau, limiteurs en cours, RLS et fonctions privilégiées de la base, en-têtes HTTP vérifiés sur le site lui-même, déploiement, journal de sécurité. Trois corrections issues de la recette : formulaire de création conservé après un refus, bandeau « créée et publiée » distinct de « créée en brouillon », QR d'enrôlement affiché sans next/image.

**Préalable côté Supabase** : Authentication → Multi-Factor → TOTP activé (il l'est par défaut sur les projets récents ; vérifier). Sans cela, « Activer la double vérification » affiche son message d'erreur et tout le reste fonctionne.

## Sprint 3 — « Moins de ressaisie, plus de terrain »

| Réf. | En tant que… je veux… afin de… | Taille | Audit | État |
| --- | --- | --- | --- | --- |
| A-12 | développeur, une CSP en mode rapport pendant deux semaines puis en mode blocage, afin de fermer les injections de script sans casser Google ni Supabase | M | S7 | à recetter (mode rapport livré ; passage en blocage après deux semaines de logs propres) |
| A-13 | développeur, que l'exclusion de l'équipe des statistiques ne demande plus de changer le code, afin de ne pas redéployer pour un UUID | S | S8 | à recetter (variable `VISITES_EQUIPE`, les deux comptes actuels restent exclus par défaut) |
| A-14 | développeur, renommer `middleware.ts` en `proxy.ts`, afin de suivre la convention Next 16 | S | Q6 | à recetter |
| A-15 | admin, dupliquer une sortie en changeant seulement la date, afin de ne pas ressaisir le samedi suivant | M | F3 | à recetter (+7 jours, brouillon, sans photo) |
| A-16 | admin sur le parking, que les scans faits sans réseau soient gardés et envoyés dès le retour du réseau, afin de ne perdre aucune présence | L | F4 | à recetter (file d'attente dans le navigateur, renvoi au retour du réseau et toutes les 15 s) |

**Livré dans le code** : `next.config.mjs` (en-tête `Content-Security-Policy-Report-Only`), `app/api/csp/route.ts`, `app/api/visite/route.ts`, `proxy.ts`, action `dupliquerCourse`, `RaceScanner.tsx`.

## Sprint 4 — « Voir ce que les autres voient » (services extérieurs)

| Réf. | En tant que… je veux… afin de… | Taille | État |
| --- | --- | --- | --- |
| A-17 | admin, voir les erreurs de production des dernières 24 h et les problèmes ouverts sur la page Sécurité, afin de réagir avant un membre | M | à recetter : SDK Sentry câblé, carte prête, variables à poser (voir `05-exploitation.md`) |
| A-18 | admin, voir bugs, vulnérabilités, points sensibles et duplication du code, afin de savoir si la base de code se dégrade | M | à recetter : job SonarCloud dans la CI, carte prête, projet à créer sur sonarcloud.io |
| A-19 | admin, voir l'état des derniers runs de la chaîne GitHub, afin de savoir si `main` est sain | S | à recetter : fonctionne sans configuration (dépôt public) |
| A-20 | admin, voir la disponibilité sur 24 h et 7 jours et les incidents mesurés de l'extérieur, afin de ne pas découvrir une panne par un membre | S | à recetter : carte prête, moniteur UptimeRobot à créer |
| A-21 | admin, télécharger une sauvegarde complète des tables métier, tracée au journal, afin de ne dépendre d'aucun plan Supabase | S | à recetter |

## Sprint 5 — « Le journal des connexions » (sans service extérieur)

| Réf. | En tant que… je veux… afin de… | Taille | État |
| --- | --- | --- | --- |
| A-22 | admin, voir connexions, mots de passe erronés, blocages, codes acceptés ou refusés, avec compteurs 24 h et filtres, afin de repérer une attaque sur un compte | L | à recetter : table `journal_auth` (migration 0016), écrite depuis connexion, déconnexion, réinitialisation, changement de mot de passe, codes, retrait par un admin, expiration ; limiteur de connexion ajouté au passage (dix essais par quart d'heure et par identifiant) |
| A-23 | admin, voir chaque service (Auth, base, stockage, mail) testé avec son temps de réponse, afin de localiser une panne | M | à recetter : Authentification, base, stockage, e-mails (Resend), avec temps de réponse |
| A-24 | admin, voir la taille de la base et les tables les plus lourdes, afin d'anticiper le plan Supabase | S | à recetter : taille de la base et six tables les plus lourdes dans la carte Base de données |
| A-25 | admin, voir qui a fait combien d'actions cette semaine, afin de suivre l'activité de l'équipe | S | à recetter : actions par admin sur sept jours, sous la carte Services |
| A-26 | admin, une checklist Sécurité et RGPD (en place, partiel, absent) issue de l'audit, afin de savoir ce qui reste à faire | S | à recetter : deux cartes, 22 points sécurité dont 8 mesurés en direct, 12 points RGPD |

## Idées non planifiées

- Rappel automatique la veille d'une sortie aux inscrits (e-mail), avec désinscription en un clic.
- Statistiques de fidélité : membres qui ne sont pas venus depuis X sorties.
- Export du journal en CSV, pour l'archiver hors ligne à chaque fin d'année.
- Tests end-to-end du scanner avec un QR de test (Playwright), déclenchés sur la preview Vercel.

## Roadmap indicative

| Période | Contenu |
| --- | --- |
| 25 septembre | Sprints 1 à 3 écrits d'un bloc, en attente de recette (voir `04-recette.md`) |
| Semaine du 29 septembre | Recette des trois sprints sur la preview, migrations 0013 et 0014 en prod, mise en production |
| Semaine du 6 octobre | A-10 (staging Supabase), sonde externe sur `/api/sante`, premier lundi de revue du journal |
| Mi-octobre | CSP en mode blocage si les logs sont propres (A-12) |
| Ensuite | Maintenance : revue du journal et des alertes chaque lundi, backlog repriorisé selon les retours des sorties |
