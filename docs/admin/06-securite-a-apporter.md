# Sécurité : ce qu'il reste à apporter à NULLL

État au 25 septembre 2026, comparé à COGEDOC (l'autre projet, qui a reçu le même chantier sécurité ces derniers jours). À lire avec `01-audit.md` et `03-backlog.md` : ce document ne reprend pas ce qui y est déjà marqué corrigé.

## Déjà en place (ne pas refaire)

- Double vérification TOTP des admins, exigée par le code et par `is_admin()` en base (migration 0014), session admin de 12 h.
- Journal d'administration en ajout seul (0013), tableau de bord Sécurité (0015).
- En-têtes : `nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Referrer-Policy`, `Permissions-Policy` ; CSP complète en `Report-Only` avec rapports vers `/api/csp`.
- Limiteur partagé en base (`lib/limite.ts`, migration 0008), branché sur les SMS, le formulaire de contact et l'espace pro.
- CI `.github/workflows/qualite.yml` : lint, types, tests.
- Sonde `/api/sante` (200 ou 503), erreurs serveur en JSON dans les logs (`instrumentation.ts`).

## À vérifier avant tout

1. **Les migrations 0013, 0014 et 0015 sont-elles jouées en production ?** Le backlog dit « à jouer ». Sans elles, le journal, la double vérification et la page Sécurité échouent en prod. Vérifier dans Supabase → Database → Migrations (ou `select * from supabase_migrations.schema_migrations`).
2. **TOTP activé côté Supabase** : Authentication → Multi-Factor → TOTP.
3. **Aucune autre session ne travaille sur le dépôt** (dernier commit `0a30fa1`, 25/09 16 h 47).

## Faisable tout de suite (code seul, pas de dépendance ni de compte)

| # | Quoi | Pourquoi | Où |
| --- | --- | --- | --- |
| 1 | **Limiter les tentatives de connexion membre** : 5 échecs par compte ou 20 par adresse en 15 min, puis blocage 15 min. Remettre à zéro après un succès (`oublierEssais`). | Aujourd'hui `signInWithPassword` n'a aucun frein : on peut essayer des mots de passe sans fin. | `app/membre/actions.ts` (connexion, vers la ligne 277), réutiliser `essaiAutorise` / `adresseAppelant` de `lib/limite.ts`. Ne jamais compter les adresses de bouclage (`::1`, `127.0.0.1`, `::ffff:127.0.0.1`), sinon les tests se bloquent entre eux. |
| 2 | **Mots de passe de 12 caractères au moins, refus des mots de passe fuités** (API Have I Been Pwned par k-anonymat : seuls les 5 premiers caractères du SHA-1 partent). | Minimum actuel : 6 caractères. | `app/membre/actions.ts` (`updateMemberPassword`, inscription), `app/membre/mot-de-passe/PasswordForm.tsx` et `app/membre/register/RegisterForm.tsx` (`minLength`). Si HIBP ne répond pas, laisser passer. Aligner le réglage Supabase → Authentication → Password (longueur minimale). |
| 3 | **Surveillance automatique** : workflow GitHub `surveillance.yml` toutes les 5 min qui appelle `https://nulll.club/api/sante` et échoue sur un 503 (GitHub envoie alors un mail). | La sonde existe mais personne ne la regarde (backlog A-05b). | `.github/workflows/`. Modèle : `cogedoc/.github/workflows/surveillance.yml`. Deux échecs de suite avant d'alerter. |
| 4 | **Dependabot** : mises à jour de sécurité des dépendances et des actions GitHub, chaque semaine. | Aucune veille sur les failles des dépendances. | `.github/dependabot.yml` (écosystèmes `npm` et `github-actions`). Modèle : `cogedoc/.github/dependabot.yml`. |
| 5 | **`pnpm audit --audit-level=high` dans la CI.** | Une dépendance vulnérable part aujourd'hui en production sans alerte. | Étape en plus dans `qualite.yml`. |
| 6 | **Rendre le check « Qualité » obligatoire sur `main`** (GitHub → Settings → Branches). | Sinon la CI prévient mais n'empêche rien. | Réglage GitHub, pas de code. |

## Demande une décision ou un compte

| # | Quoi | Ce qu'il faut | Remarque |
| --- | --- | --- | --- |
| 7 | **Règles SonarJS** (`eslint-plugin-sonarjs`) dans `pnpm lint` | Accord : c'est une dépendance (règle 7 de `CODEX_RULES.md`). | Gratuit, local. SonarQube Cloud gratuit refuse l'analyse CI d'un dépôt privé : sur COGEDOC on passe par l'analyse automatique de SonarCloud. |
| 8 | **Sentry** | Accord (dépendance `@sentry/nextjs`) + compte sentry.io, région UE, DSN. | Le point d'accroche existe : `Sentry.captureRequestError` dans `onRequestError` (`instrumentation.ts`). Ajouter l'hôte d'ingestion à la CSP. |
| 9 | **Sauvegarde horaire de la base** par GitHub Actions (artefacts privés 7 jours) | Secrets dans le dépôt `nulllclubcontact-fr/NULLL` : URL Supabase, clé, compte technique. | Plan gratuit Supabase = aucune sauvegarde. Modèle : `cogedoc/.github/workflows/sauvegarde.yml` + `scripts/sauvegarde.mjs`. Les données contiennent des téléphones et des e-mails : artefacts privés, durée courte. |
| 10 | **Test de restauration hebdomadaire** (la sauvegarde rechargée dans une base vierge, contrôles lignes / clés étrangères / RLS) | Le point 9 d'abord. | Modèle : `cogedoc/.github/workflows/restauration.yml` + `scripts/restauration.mjs`. |
| 11 | **Base de staging** (A-10) | Projet Supabase séparé ou branche Supabase. | Aujourd'hui une preview Vercel écrit dans la base de prod. |
| 12 | **Double vérification pour les membres ?** | Décision produit. | Probablement inutile pour un membre ; déjà en place pour les admins. |

## Plus tard (déjà planifié)

- **CSP en blocage** mi-octobre, si deux semaines de rapports `/api/csp` sont propres (A-12), puis nonces pour retirer `'unsafe-inline'`.
- **Registre RGPD** (article 30) : lister les traitements (inscriptions, présences, visites, photos, droit à l'image, journal), leurs durées et leurs sous-traitants (Supabase, Vercel, envoi SMS et mails). Modèle : `cogedoc/src/lib/rgpd.ts`.
- **Tests de bout en bout** du scanner et de la connexion (Playwright) sur la preview.

## Ordre conseillé

1. Vérifications ci-dessus (migrations, TOTP).
2. Points 1 et 2 (connexion) : ce sont les seules vraies failles ouvertes aujourd'hui.
3. Points 3 à 6 (surveillance, dépendances, CI).
4. Décider 7 et 8, puis 9 et 10.
5. Tenir `01-audit.md` et `03-backlog.md` à jour à chaque point livré.

## Pièges connus (vécus sur COGEDOC)

- `gh` bascule souvent de compte : le dépôt appartient à `nulllclubcontact-fr`. En cas de « Repository not found », `gh auth switch --user nulllclubcontact-fr`.
- Un limiteur qui compte `::1` bloque les tests entre eux.
- Une migration appliquée par le connecteur Supabase peut être refusée par le mode automatique de Claude Code : la jouer dans le SQL Editor.
- Toute nouvelle adresse appelée depuis le navigateur (Sentry, HIBP si appelé côté client) doit être ajoutée à la CSP.
