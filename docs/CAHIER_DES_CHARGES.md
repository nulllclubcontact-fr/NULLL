# Cahier des charges évolutif : nulll.club

> **À lire avant toute intervention.** Ce document décrit l'état réel du site,
> les constats prouvés, les corrections faites et ce qui reste à faire. Il se
> met à jour après chaque changement. Voir la procédure de reprise (section F).

- Version du document : 1.0, créée le 15/09/2026
- Référence de code auditée : `main` @ `3c5f710` (« Pied de page : compact sur telephone », 12/09/2026)
- Branche de travail : `audit/seo-perf-securite-auth` (non poussée, non déployée au 15/09/2026). Changements **non commités** : aucune identité git (`user.name`, `user.email`) n'est configurée sur la machine ; à commiter par le propriétaire ou après configuration de son identité.
- Production auditée : https://nulll.club (Vercel, région `cdg1`), le 15/09/2026
- Annexes : [`docs/annexes/emails-auth.md`](annexes/emails-auth.md) (e-mails, Supabase Auth, SMTP, DNS)
- Preuves brutes (non versionnées, dossier `qa-artifacts/` ignoré par git) : rapports d'audit
  `qa-artifacts/audit-seo.md`, `qa-artifacts/audit-securite-statique.md`, mesures
  `qa-artifacts/mesures/`, captures `qa-artifacts/captures/`, HTML rendu `qa-artifacts/preuves/`.
  Ces fichiers restent sur la machine qui a mené l'audit : les copier à côté du dépôt
  si une autre personne reprend le projet.

---

## A. Contexte et objectifs

### A.1 Le club et ses publics

NULLL.CLUB est un social run club associatif basé à Aix-en-Provence : une sortie
gratuite chaque samedi à 8h30, départ parking du chemin de la Cible, près du
lycée Émile Zola, 5 à 6 km à allure conversation. Le sport est le prétexte, le
lien social est l'objectif. Référence éditoriale et graphique :
`NULLL_CLUB_CONTEXT.md` et `CODEX_RULES.md` à la racine du dépôt.

Publics :
- **Visiteurs** d'Aix et des environs (jeunes adultes, étudiants, actifs, créatifs,
  débutants ou réguliers) qui cherchent à courir en groupe ou à rencontrer du monde.
- **Membres** : compte, décharge signée, inscription aux sorties, QR à présenter.
- **Administrateurs** du club : sorties, inscrits, pointage, réseau de partenaires.
- **Partenaires** (commerçants) : espace pro par code, statistiques.

### A.2 Objectifs du site et parcours principaux

1. Comprendre rapidement ce qu'est le club (accueil, page Club).
2. Découvrir et choisir une sortie (`/fr/runs`).
3. Créer un compte, confirmer son adresse, signer la décharge, s'inscrire à une sortie, retrouver son QR.
4. Suivre le club (Instagram), contacter le club.
5. Merch (boutique fermée au 15/09/2026, `BOUTIQUE_OUVERTE = false`).
6. Référencement local (run club, courir, événements running à Aix).

### A.3 Architecture réelle (vérifiée)

| Élément | Valeur | Preuve |
|---|---|---|
| Framework | Next.js 16.3.4 (App Router, Turbopack), React 19.2.7, TypeScript 6.0.3, Tailwind 3.4.19 | `package.json` |
| Hébergement | Vercel, équipe `NULLL` (offre Hobby), projet `nulll` lié à GitHub `nulllclubcontact-fr/NULLL` (déploiement automatique de `main` en production, des autres branches en preview), région `cdg1`, Node 24 | API Vercel, 15/09/2026 |
| Base Supabase | projet `nulll-supabase` (`skyqbuunpwvzvabxhjug`), région `eu-west-3` (Paris), Postgres 17.6, organisation gérée via l'intégration Vercel | API Supabase, 15/09/2026 |
| Base, comptes, stockage | Supabase (`@supabase/ssr` 0.12.7, `@supabase/supabase-js` 2.116.0), 10 migrations versionnées dans `supabase/migrations` | dépôt |
| Auth en production | e-mail + mot de passe (confirmation obligatoire), Google ; téléphone désactivé ; inscriptions ouvertes | `GET /auth/v1/settings` (clé publique), 15/09/2026 |
| Connexion Google | bouton officiel Google Identity Services + `signInWithIdToken` avec nonce | `components/auth/boutons-sociaux.tsx` |
| SMS | hook Supabase « Send SMS » vers `/api/auth/sms` (signature vérifiée), passerelle SMSGate | `app/api/auth/sms/route.ts` |
| E-mail du domaine | OVH (MX `mx0…mx3.mail.ovh.net`), SPF OVH, DKIM OVH actif (`ovhmo-selector-1/2`), pas de DMARC | zone OVH (API), DNS public |
| Domaine | `nulll.club` (certificat Let's Encrypt `CN=nulll.club`) ; `www.nulll.club` pointe vers Vercel sans certificat valide | `curl -v`, DNS |
| Analytics / traceurs | aucun dans le code ; bandeau d'information cookies (pas de consentement) | `components/bandeau-cookies.tsx`, recherche dans le code |
| Tests | `node --test lib/verifications.test.ts` (règles pures) | `package.json` |
| Middleware | `middleware.ts` (convention dépréciée au profit de `proxy.ts` en Next 16, fonctionne encore) | avertissement du build |

Rendu : pages publiques statiques ou ISR (`revalidate = 60` pour les sorties),
espaces membre, admin et pro dynamiques. Sorties passées filtrées en base
(`lib/races/repo.ts`).

### A.4 Contraintes

- **Graphiques** : direction artistique brutaliste validée (crème `#F1EDE9`, bordeaux `#773331`,
  sombre `#3A1A18`, jaune `#FFB200`, rose `#EBA0CD` ; Anton, Roboto Condensed, Caveat).
  Ne pas l'uniformiser ni l'adoucir (`CODEX_RULES.md`).
- **Éditoriales** : ton direct, court, décalé ; jamais d'informations inventées (dates, lieux,
  horaires, prix, partenaires, témoignages, chiffres).
- **Techniques** : pas de nouvelle dépendance ni de refonte sans besoin démontré ; changements ciblés.
- **Budgétaires** : association ; aucun service payant sans accord explicite.

### A.5 Règles de sécurité et de données à préserver

- Toute autorisation se vérifie côté serveur (action serveur, route, RLS), jamais seulement dans l'interface.
- Le rôle admin se relit en base (`profiles.role`), jamais depuis `user_metadata`.
- La clé `service_role` reste dans les modules `server-only`, jamais dans un composant client.
- Les colonnes privilégiées de `profiles` restent non modifiables par un membre (droits par colonne, migration 0006).
- Les jetons des e-mails ne passent ni dans les journaux, ni dans le Referer, ni chez un tiers.
- Aucun secret, jeton ou donnée personnelle réelle dans ce document, dans git ou dans les preuves.
- Tests actifs de sécurité : uniquement en local ou en préproduction, avec des comptes fictifs.

---

## B. État de référence

### B.1 Fonctionnalités existantes (constatées dans le code et en production)

- Pages publiques (FR uniquement) : `/fr`, `/fr/runs`, `/fr/communaute`, `/fr/merch`, `/fr/contact`,
  guides `/fr/run-club-aix-en-provence`, `/fr/courir-a-aix-en-provence`, `/fr/evenements-running-aix`,
  `/confidentialite`, `/mentions-legales`. Anciennes URL (`/about`, `/community`, `/fr/about`,
  `/fr/a-propos`, slugs anglais sous `/fr`) redirigées en 308.
- Espace membre : inscription (e-mail ; téléphone si activé), connexion (« rester connecté »),
  Google, mot de passe oublié, décharge versionnée, sorties, QR, profil, historique.
- Admin : tableau de bord, sorties (création, édition, suppression, export CSV neutralisé), scanner, réseau partenaires.
- Pro : connexion par code (bcrypt, limité), scan, statistiques.
- Formulaire de contact (limité à 5 envois / 15 min par IP), commande fermée (403).

### B.2 Points forts à conserver

- SEO technique : HTTPS, redirections 308 propres, un H1 par page, titles et descriptions uniques,
  contenu entièrement rendu côté serveur, pages privées en `noindex` sans `Disallow`, vraies 404,
  aucun lien interne cassé, sorties passées retirées automatiquement, JSON-LD Event fidèle (prix 0 €, pas de fin inventée).
- NAP cohérent sur toutes les pages (samedi 8h30, parking du chemin de la Cible, téléphone, e-mail).
- Performance : TTFB ~20 ms (CDN), CLS 0, TBT < 50 ms en laboratoire.
- Accessibilité Lighthouse 100 sur les 4 pages mesurées (mesure automatique uniquement).
- Sécurité : aucune faille critique ni élevée trouvée dans le code (voir D ci-dessous et `qa-artifacts/audit-securite-statique.md`) ;
  RLS active sur 14 tables, droits par colonne sur `profiles`, fonctions SQL transactionnelles,
  session pro HMAC `timingSafeEqual`, hook SMS signé, pas d'open redirect, CSV neutralisé,
  `frame-ancestors 'none'`, `nosniff`, HSTS.
- Aucune clé secrète dans le bundle public ni dans l'historique git (vérifié : seule la chaîne
  `sb_secret_` du code de la bibliothèque apparaît).

### B.3 Problèmes identifiés (synthèse, détail en section C)

| Priorité | Fiches |
|---|---|
| Critique, résolu le 15/09/2026 | AUTH-001 (e-mails non délivrés aux inscrits : SMTP OVH configuré) |
| Haute | AUTH-002, AUTH-003, AUTH-004, SEO-001, SEO-002, SEC-012, SEO-014 |
| Moyenne | SEC-001, SEC-002, SEC-003, SEO-003, SEO-004, SEO-005, PERF-001, PERF-002, AUTH-005, AUTH-006 |
| Basse | SEC-004 à SEC-011, SEC-013, SEO-006 à SEO-013, PERF-003 à PERF-008, UX-001, UX-002 |

### B.4 Corrections effectuées et état de déploiement

Environnements : **L** = vérifié en local (build de production, Supabase factice) ;
**P** = préproduction ; **Prod** = production. Au 15/09/2026, **rien n'est déployé**.

| Fiche | Changement | L | P | Prod |
|---|---|---|---|---|
| AUTH-002 | page `/auth/confirmer` + action `confirmerLienEmail` | build, captures, tests unitaires | non | non |
| AUTH-003 | écran « Regarde tes mails » + renvoi limité | build, typage | non | non |
| AUTH-004 | gabarits HTML + texte confirmation et réinitialisation | rendu 390 px / 800 px / images bloquées | — | non collés |
| AUTH-007 | connexion non confirmée → renvoi ; message de lien clarifié ; `/?code=` → `/auth/callback` | build, redirection vérifiée | non | non |
| SEC-002 | limites connexion / inscription / réinitialisation | typage | non | non |
| SEC-006 | pas de réécriture du profil d'un compte existant | typage | non | non |
| PERF-001 | `preload` + `fetchPriority="high"` sur les photos LCP de l'accueil et de `/fr/runs` | HTML + A/B (LCP mobile −205 ms) | non | non |
| PERF-002 | Supabase retiré des pages publiques | 0 chunk Supabase sur `/fr` ; A/B −67 Ko JS par page | non | non |
| SEO-001 | récit de la première sortie selon la date + `revalidate` | HTML vérifié (« Pas encore ») | non | non |
| SEO-002 | 3 guides dans le pied de page, « À lire aussi », lien Club → événements | HTML vérifié | non | non |
| SEO-003 (partiel) | title de la page événements aligné sur son H1 | HTML vérifié | non | non |
| SEO-005 | JSON-LD : `@id`, accents, horaires faux retirés, URL, nom d'Event, LinkedIn | HTML vérifié (sauf Event : pas de sortie en local) | non | non |
| SEO-006 | `x-default` = page elle-même | HTML vérifié | non | non |
| SEO-008 | `/about` → `/fr/communaute` en un saut | vérifié | non | non |
| SEO-010 | `dynamicParams = false` : vraie page 404 | vérifié (128 mots au lieu de 4) | non | non |
| SEO-011 | canonical et og des pages légales | vérifié | non | non |
| SEO-012 | og/twitter image avec dimensions et alt (pages principales et légales) | HTML vérifié | non | non |
| SEC-001 (partiel) | plafond global 40 SMS/heure dans le hook | typage, build | non | non |
| SEC-004 | session pro liée au code d'accès (`codeId`), révocation = déconnexion | typage, build | non | non |
| SEC-005 | `x-vercel-forwarded-for` en priorité pour les limites | typage | non | non |
| SEC-009 (partiel) | optimiseur d'images limité à l'hôte Supabase du projet (lu dans `NEXT_PUBLIC_SUPABASE_URL`) | build | non | non |
| SEC-010 | `/api/checkout` : contrôle d'origine, 5 commandes/h par IP, téléphone normalisé | 403 sans Origin ou avec Origine étrangère (L) | non | non |
| PERF-007 | `middleware.ts` → `proxy.ts` | build sans avertissement ; `/about`, `/?code=` vérifiés | non | non |
| PERF-008 | images de partage sans Edge Runtime, logo lu sur disque | `/opengraph-image` 200, PNG 1200×630, désormais statique | non | non |
| SEO-013 | contenus hérités supprimés (`sharedEvents`, `buildRuns`, `home`, `aboutPage`, `runs`) | typage, build | non | non |
| UX-002 | une seule balise robots sur la 404 | `noindex` seul (L) | non | non |

### B.5 Mesures initiales (production, laboratoire)

Protocole : Lighthouse 12.8.2 local, Chromium 1223 sans interface, profils mobile (défaut
Lighthouse : Moto G Power, 4G lente simulée) et `--preset=desktop`, 3 exécutions par page,
**médianes**, le 15/09/2026 vers 00h00 UTC, depuis une connexion résidentielle. Fichiers :
`qa-artifacts/mesures/lighthouse-avant/`, synthèse `lighthouse-avant-medianes.txt`.

| Page · profil | Perf | A11y | BP | SEO | LCP ms | CLS | TBT ms | FCP ms | TTFB ms | Poids Ko | Req. | JS Ko |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /fr · mobile | 94 | 100 | 100 | 100 | 3039 | 0 | 43 | 972 | 21 | 621 | 30 | 226 |
| /fr · desktop | 100 | 100 | 100 | 100 | 628 | 0 | 0 | 273 | 19 | 760 | 41 | 252 |
| /fr/runs · mobile | 95 | 100 | 100 | 100 | 2873 | 0 | 33 | 928 | 19 | 568 | 30 | 226 |
| /fr/runs · desktop | 100 | 100 | 100 | 100 | 594 | 0 | 0 | 254 | 19 | 745 | 41 | 252 |
| /fr/run-club-aix-en-provence · mobile | 96 | 100 | 100 | 100 | 2731 | 0 | 32 | 931 | 19 | 422 | 27 | 226 |
| /fr/run-club-aix-en-provence · desktop | 100 | 100 | 100 | 100 | 577 | 0 | 0 | 257 | 19 | 475 | 38 | 252 |
| /membre/register · mobile | 86 | 100 | 100 | 66* | 4156 | 0 | 23 | 931 | 19 | 793 | 37 | 338 |
| /membre/register · desktop | 97 | 100 | 100 | 66* | 1304 | 0.017 | 0 | 261 | 19 | 848 | 50 | 364 |

\* SEO 66 attendu : la page est volontairement `noindex`.

Diagnostics principaux (mobile) : image LCP chargée en priorité basse (`fetchpriority=high`
absent), chunk Supabase de 68 Ko compressés (56 Ko inutilisés) sur toutes les pages publiques,
images servies plus grandes que l'affichage (~60-110 Ko récupérables par page), 14 Ko de
JavaScript hérité, script Google Identity 99 Ko sur les pages de compte, LCP de
`/membre/register` sur le texte du bandeau cookies (apparition après hydratation).

**Données terrain (CrUX, INP réel)** : non disponibles. L'API PageSpeed Insights a répondu
« quota exceeded » (quota anonyme partagé). Aucun INP n'est validé par ce document (fiche PERF-006).

### B.6 Mesures après correction

Comparaison A/B en local (même machine, même Lighthouse, builds de production `main` et
branche servis par `next start`, Supabase factice) : voir section B.6.1, complétée à la fin
des mesures. La comparaison en production reste à faire après déploiement (PERF-009).

#### B.6.1 Résultats A/B local

Conditions : 15/09/2026, 02h05-02h45, MacBook arm64, Lighthouse 12.8.2, `next start` des builds de production
de `main` (port 3300) et de la branche (port 3200), mêmes variables factices (Supabase injoignable :
pas de sorties affichées, pas de bouton Google), 3 exécutions alternées par page et profil, médianes.
Fichiers : `qa-artifacts/mesures/ab-local/`, synthèse `qa-artifacts/mesures/ab-local-medianes.txt`.
Les valeurs absolues diffèrent de la production (pas de CDN, pas de données) : **seuls les écarts
comptent**. `/membre/register` a été remesuré avec la version finale (« finale ») environ 15 minutes
après la série principale, sur la même machine.

| Page · profil | Perf main → branche | LCP ms main → branche | Écart LCP | JS Ko | Poids Ko | Priorité image LCP |
|---|---|---|---|---|---|---|
| /fr · mobile | 90 → 91 | 3693 → 3488 | **−205** | 225 → 157 (−67) | 622 → 554 | High → High |
| /fr · desktop | 100 → 100 | 731 → 676 | −55 | 251 → 183 (−67) | 760 → 693 | High → High |
| /fr/runs · mobile | 92 → 94 | 3312 → 3107 | **−205** | 225 → 157 (−67) | 447 → 380 | Low → High |
| /fr/runs · desktop | 100 → 100 | 683 → 679 | −3 | 251 → 183 (−67) | 561 → 494 | High → High |
| /fr/run-club-aix-en-provence · mobile | 93 → 95 | 3164 → 2881 | **−283** | 225 → 157 (−67) | 421 → 355 | — |
| /fr/run-club-aix-en-provence · desktop | 100 → 100 | 642 → 592 | −49 | 251 → 183 (−67) | 475 → 408 | — |
| /membre/register · mobile (finale) | 90 → 88 | 3686 → 3986 | +300, non significatif (exécutions 3552-3986 contre 3593-3989) | 238 → 237 | 590 → 590 | Low → Low |
| /membre/register · desktop (finale) | 99 → 100 | 938 → 758 | −180 | 264 → 263 | 646 → 646 | Low → Low |

TBT et CLS inchangés (TBT 0 à 26 ms, CLS 0) sur toutes les pages en version finale.

Version intermédiaire écartée : avec `preload` + `fetchPriority="high"` sur la photo des pages de compte,
`/membre/register` mobile passait à LCP 4804 ms (+1118 ms, 3 exécutions sur 3 plus lentes) et TBT 51 ms.
Sur ces pages, l'élément LCP est le texte du bandeau cookies affiché après l'hydratation, pas la photo
voilée : la photo préchargée retardait le JavaScript. Changement retiré (voir E et PERF-001).

Limites : laboratoire seulement (aucun INP ni donnée terrain) ; 3 exécutions par cas ; machine non isolée.

### B.7 Informations manquantes et hypothèses à valider

| Sujet | Hypothèse ou manque | Comment lever |
|---|---|---|
| SMTP personnalisé | **vérifié le 15/09 : absent** (envoi par `noreply@mail.app.supabase.io`) | — |
| Gabarits actuels | « gabarit par défaut » selon le propriétaire ; non lisible par l'API disponible | tableau de bord Supabase |
| Migrations appliquées en production | **vérifié** : schéma conforme à 0010, mais aucune migration enregistrée dans `schema_migrations` | — |
| RLS, grants, policies Storage réelles | **vérifié le 15/09** (fiche SEC-012) | — |
| Site URL / Redirect URLs Supabase, réglages Auth (OTP, mots de passe) | non lisibles par l'API disponible | tableau de bord Supabase → Authentication |
| Variables d'environnement Vercel | noms non lisibles par l'API disponible ; `SESSION_SECRET` manquait le 10/09 (SEC-015) ; previews déployées depuis `corrections-audit` sur la même base que la production (déduit : un seul projet Supabase) | tableau de bord Vercel |
| Search Console | non consultée | accès Google Search Console |
| Code postal `13090` du JSON-LD | non visible sur le site | confirmation du propriétaire / fiche Google |
| Boîte e-mail OVH et ses quotas | boîte `staff@nulll.club` confirmée et utilisée par Supabase (15/09/2026) ; quota d'envoi OVH non lu (jeton API sans droit e-mail) | propriétaire / espace client OVH |
| Heure de fin des sorties | non publiée | propriétaire (pour `openingHoursSpecification`) |

---

## C. Fiches de travail

Statuts : `à préciser` · `prêt` · `en cours` · `bloqué` · `implémenté à vérifier` · `validé` · `déployé`.
Chaque statut précise l'environnement. Effort : S (< 1 h), M (1 à 4 h), L (> 4 h).

### AUTH : inscription, confirmation d'e-mail

#### AUTH-001 · Vérifier que les e-mails d'authentification sont réellement délivrés
- **Objectif** : garantir qu'un inscrit hors équipe reçoit l'e-mail de confirmation.
- **Problème** : sans SMTP personnalisé, Supabase n'envoie qu'aux membres de l'équipe du projet, 2 e-mails/heure.
- **Preuve (vérifiée en production le 15/09/2026, journaux Auth du projet `skyqbuunpwvzvabxhjug`)** : événement `mail.send` avec `mail_from: noreply@mail.app.supabase.io`, `mail_type: confirmation` → **le service d'envoi intégré de Supabase est utilisé, aucun SMTP personnalisé**. La seule inscription par e-mail des dernières 24 h visait l'adresse du compte propriétaire du projet, ce qui explique qu'elle ait abouti. Base : 7 comptes, tous confirmés (4 identités e-mail, 4 Google, 3 comptes e-mail seulement) ; aucun compte non confirmé en attente.
- **Impact** : **confirmé** : toute personne extérieure à l'équipe Supabase qui s'inscrit par e-mail ne reçoit pas le mail de confirmation (limite « équipe seulement, 2/heure » du service intégré). Le parcours d'inscription par e-mail est inutilisable pour le public tant que le SMTP n'est pas configuré. Google fonctionne.
- **Concerné** : Supabase → Authentication → Emails → SMTP.
- **Actuel** : inconnu. **Attendu** : SMTP personnalisé actif, e-mail reçu en boîte de réception d'une adresse de test hors équipe en moins de 2 minutes.
- **Solution** : options A (boîte OVH) ou B (prestataire transactionnel), annexe §5.
- **Étapes** : 1) lire la configuration ; 2) choisir l'option ; 3) configurer ; 4) test d'envoi.
- **Dépendances** : accès Supabase ; décision option ; AUTH-006 pour la délivrabilité.
- **Priorité** : critique (bloque le parcours principal si confirmé). **Effort** : S (lecture) + M (configuration).
- **Acceptation** : e-mail reçu sur une adresse de test hors équipe, en-têtes `spf=pass`, `dkim=pass`.
- **Tests / preuves** : capture de la configuration (sans mot de passe), en-têtes du mail reçu.
- **Risques / retour arrière** : désactiver le SMTP personnalisé.
- **Blocage** : accès Supabase (`/mcp`), choix de l'expéditeur.
- **Statut** : **résolu en production le 15/09/2026** (option A choisie par le propriétaire) : SMTP personnalisé `ssl0.ovh.net:465`, expéditeur `NULLL.CLUB <staff@nulll.club>`, `rate_limit_email_sent` relevé de 2 à 60 par heure (API de gestion Supabase). Preuve : inscription test avec une adresse hors équipe, mail de confirmation reçu en boîte de réception Gmail en moins de 2 s, en-têtes `spf=pass`, `dkim=pass header.s=ovhmo-selector-1` ; compte de test supprimé ensuite. Gabarit de confirmation français aux couleurs du site appliqué en production le 15/09/2026 (`supabase/emails/confirmation.production.html`, variante `{{ .ConfirmationURL }}` compatible avec le code en ligne ; objet « Confirme ton adresse email · NULLL.CLUB ») ; preuve : mail reçu, clic simulé → 303 vers `https://nulll.club#access_token=…`, compte de test supprimé. Idem pour la réinitialisation (`supabase/emails/reinitialisation.production.html`, objet « Ton nouveau mot de passe · NULLL.CLUB ») : mail reçu, clic simulé → 303 vers `/auth/callback?next=/membre/mot-de-passe`, compte de test supprimé. Les gabarits `confirmation.html` et `reinitialisation.html` (lien `/auth/confirmer`) ne doivent remplacer ceux-ci qu'après déploiement de cette branche. Reste : DMARC (AUTH-006). **Mise à jour** : 15/09/2026.

#### AUTH-002 · Confirmation par `/auth/confirmer` (jeton dans le fragment, validation au clic)
- **Objectif** : confirmation fiable, y compris sur un autre appareil, résistante aux scanners de liens.
- **Problème** : le lien par défaut (`{{ .ConfirmationURL }}`) passe par `/auth/v1/verify` puis revient avec un code PKCE qui ne s'échange que dans le navigateur de l'inscription ; `signUp` n'avait pas d'adresse de retour (retour sur la racine, où `?code=` était perdu par la redirection vers `/fr`) ; un scanner de messagerie peut consommer le lien.
- **Preuve** : `app/membre/actions.ts` (ancien `signUp({ email, password })` sans `emailRedirectTo`) ; `app/page.tsx` (`permanentRedirect("/fr")`) ; `app/auth/callback/route.ts` (`exchangeCodeForSession`). Comportement en production : **non testé** (pas de boîte de test).
- **Impact** : nouvel inscrit confirmé mais non connecté, message « lien expiré » trompeur sur un autre appareil.
- **Concerné** : `app/auth/confirmer/page.tsx`, `components/auth/confirmer-lien.tsx`, `app/membre/confirmation-actions.ts`, `lib/auth/confirmation.ts`, `lib/verifications.test.ts`.
- **Actuel (branche)** : la page lit `#token_hash&type&next`, efface le fragment, affiche « Confirmer mon adresse email » ; le clic appelle `verifyOtp({ token_hash, type })` ; états : confirmé, lien incomplet, expiré/déjà utilisé (avec renvoi), panne réseau (réessayer).
- **Attendu, exemple** : Léa s'inscrit sur son ordinateur, ouvre le mail sur son téléphone, clique, voit « Adresse confirmée », arrive sur `/membre` connectée sur son téléphone.
- **Étapes restantes** : déploiement, puis collage du gabarit (AUTH-004), puis test bout en bout (AUTH-008).
- **Dépendances** : AUTH-004, AUTH-005.
- **Priorité** : haute. **Effort** : M (fait) ; test S.
- **Acceptation** : les 9 lignes du tableau de test de l'annexe §7 passent.
- **Tests** : unitaires (lecture du fragment, refus des jetons altérés, aucune destination libre) : 4 tests OK ; captures `qa-artifacts/captures/pages/confirmer-*.png` ; HTML `noindex` + `no-referrer` vérifié.
- **Risques** : un client mail qui supprimerait le fragment (non observé) → lien de secours affiché en clair. Retour arrière : recoller le gabarit par défaut, le code accepte les deux formats.
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### AUTH-003 · Écran « Regarde tes mails » et renvoi limité
- **Objectif** : dire clairement quoi faire après l'inscription et permettre un renvoi sûr.
- **Problème** : après inscription, redirection vers la page de connexion avec un bandeau, sans renvoi possible.
- **Preuve** : ancien `redirect("/membre/login?message=confirme")` dans `registerMember`.
- **Impact** : inscrits bloqués si le mail n'arrive pas ou part en spam.
- **Concerné** : `app/membre/register/RegisterForm.tsx`, `components/auth/renvoi-confirmation.tsx`, `app/membre/confirmation-actions.ts` (`renvoyerConfirmation`).
- **Actuel (branche)** : écran avec adresse saisie, durée du lien, conseil spams, bouton « Renvoyer l'e-mail » bloqué 60 s, lien « Recommencer ». Réponse identique que le compte existe ou non.
- **Attendu** : « On vient d'envoyer un lien à lea@exemple.fr… » ; 4e renvoi dans l'heure refusé avec « Trop de demandes pour le moment. Réessaie dans une heure. »
- **Limites** : 3 renvois/heure par adresse, 10/heure par connexion (table `rate_limits`, migration 0008), en plus des 60 s Supabase.
- **Priorité** : haute. **Effort** : M (fait).
- **Acceptation** : renvoi reçu ; bouton bloqué 60 s ; limite effective ; aucun message ne révèle l'existence d'un compte.
- **Tests** : typage/build OK ; envoi réel non testé.
- **Risques** : limiteur en échec ouvert si la base est indisponible (choix existant, SEC-005).
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### AUTH-004 · Gabarits e-mail NULLL.CLUB (confirmation et mot de passe oublié)
- **Objectif** : e-mails transactionnels en français, à l'identité du club, lisibles partout.
- **Problème** : gabarit Supabase par défaut en production (déclaration du propriétaire) ; fichiers du dépôt sans lien de secours ni durée ni bouton adapté au mobile.
- **Concerné** : `supabase/emails/confirmation.html|.txt`, `supabase/emails/reinitialisation.html|.txt`.
- **Contenu retenu** : objet « Confirme ton adresse email · NULLL.CLUB » ; préheader « Un clic pour activer ton compte et choisir ta première sortie. » ; logo crème (`https://nulll.club/assets/nulll-new/logo-cream.png`, alt « NULLL.CLUB ») ; bouton pleine largeur « Confirmer mon adresse email » ; « Le lien reste valable 1 heure et ne sert qu'une fois » ; lien de secours en clair ; « Tu n'as pas créé de compte ? Ignore ce mail… » ; pied avec contact. Tableaux, styles en ligne, polices système (Arial Black / Arial), `color-scheme: light`.
- **Règles graphiques** : fond `#3A1A18`, carte `#F1EDE9` bordure 2 px `#773331`, bandeau `#773331`, bouton `#FFB200` texte `#773331`, accent `#EBA0CD`. Pas d'image obligatoire à la compréhension.
- **Preuves** : captures `qa-artifacts/captures/emails/confirmation-390.png`, `-800.png`, `-390-images-bloquees.png`, `reinitialisation-390.png` ; aucun débordement horizontal à 390 px (mesuré).
- **Limite** : Supabase n'envoie qu'un corps HTML ; les `.txt` sont des références.
- **Étapes** : coller objets et corps (annexe §3) après AUTH-001 et le déploiement de AUTH-002.
- **Priorité** : haute. **Effort** : S (collage).
- **Acceptation** : rendu correct dans Gmail (web + mobile), Outlook, Apple Mail ; bouton et lien de secours fonctionnels.
- **Retour arrière** : « Reset to default » dans Supabase.
- **Statut** : implémenté à vérifier (fichiers, rendu navigateur) ; non collé. **Mise à jour** : 15/09/2026.

#### AUTH-005 · Réglages Supabase Auth (URL, expiration, changements sécurisés)
- **Objectif** : réglages cohérents avec le flux et le texte des e-mails.
- **Solution** : annexe §4 (Site URL `https://nulll.club`, Redirect URLs, OTP 3600 s, Secure email/password change).
- **Dépendances** : accès Supabase, accord.
- **Priorité** : moyenne. **Effort** : S.
- **Acceptation** : captures des écrans de réglage ; `DUREE_LIEN_EMAIL` égal au réglage.
- **Statut** : prêt, bloqué (accès + accord). **Mise à jour** : 15/09/2026.

#### AUTH-006 · Délivrabilité : DKIM et DMARC
- **Problème** : pas de DMARC ; DKIM non détecté sur les sélecteurs courants.
- **Preuve** : `dig TXT _dmarc.nulll.club` vide ; SPF `v=spf1 include:mx.ovh.com ~all`.
- **Impact** : e-mails transactionnels plus souvent classés en spam.
- **Solution** : DKIM OVH (option A) ou DKIM du prestataire (option B) ; DMARC `p=none` puis `quarantine` (annexe §6). Ne pas dupliquer le SPF.
- **Priorité** : moyenne. **Effort** : S.
- **Acceptation** : en-têtes `dkim=pass`, `dmarc=pass` sur un mail reçu.
- **Retour arrière** : supprimer `_dmarc` / désactiver DKIM.
- **Statut** : prêt, bloqué (décision option + accord DNS). **Mise à jour** : 15/09/2026.

#### AUTH-007 · Connexion avant confirmation, anciens liens
- **Changements (branche)** : `loginMember` détecte `email_not_confirmed` (seulement avec le bon mot de passe) et affiche le renvoi ; message `/membre/login?erreur=lien` clarifié (« …ou a été ouvert dans un autre navigateur. Si tu confirmais ton adresse, essaie de te connecter. ») ; `/?code=…` redirigé vers `/auth/callback` (anciens e-mails sans adresse de retour).
- **Preuve** : `curl -I /?code=abc123` → 307 `/auth/callback?code=abc123` (L) ; `/` → 308 `/fr` inchangé.
- **Priorité** : moyenne. **Effort** : S (fait).
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### AUTH-008 · Test bout en bout avec une boîte de test
- **Objectif** : distinguer rendu, envoi accepté, réception, lien, confirmation, session.
- **Préalable** : environnement de préproduction avec un projet Supabase de test, ou accord explicite pour un compte de test en production (adresse dédiée, supprimée après test).
- **Étapes** : tableau annexe §7.
- **Statut** : bloqué (accès + environnement). **Mise à jour** : 15/09/2026.

### SEC : sécurité et données personnelles

Méthode : audit statique du code et des migrations (lecture seule), inspection à faible impact de
la production (en-têtes, bundle public, réglages Auth publics). **Aucun test actif** n'a été mené :
pas d'environnement isolé ni de comptes fictifs A/B disponibles. Aucune faille critique ou élevée
n'est confirmée ; l'audit ne permet pas de conclure que le site est « totalement sécurisé ».

#### SEC-001 · Abus d'envoi de SMS
- **Constat (code)** : inscription par téléphone, renvoi et code de mot de passe oublié sans limite applicative ; limite du hook : 3 codes / 10 min **par numéro**, sans plafond global ; numéros internationaux acceptés.
- **Preuve** : `app/membre/actions.ts` (signUp phone, resend sms, signInWithOtp), `app/api/auth/sms/route.ts:91`, `lib/auth/telephone.ts:16`.
- **Condition** : fournisseur téléphone actif. **Au 15/09/2026 il est désactivé** (`phone: false`) → risque latent.
- **Impact** : coûts SMS, SIM bloquée, SMS non sollicités.
- **Correctif fait (branche)** : plafond global `essaiAutorise("sms-global", "tous", 3600, 40)` dans `app/api/auth/sms/route.ts`, après la limite par numéro.
- **Reste, à décider par le propriétaire** : refuser les numéros hors France (`^\+33[67]\d{8}$`) : le club est local, mais un membre au numéro étranger serait exclu ; limiteur en échec fermé pour ce hook seulement ; CAPTCHA Supabase (Turnstile) avant réactivation du téléphone.
- **Priorité** : moyenne (basse tant que le téléphone reste désactivé). **Effort** : S.
- **Acceptation** : 41e SMS de l'heure refusé (429) ; test en local avec hook simulé.
- **Statut** : implémenté à vérifier (L, typage) pour le plafond ; à préciser pour le reste. **Mise à jour** : 15/09/2026.

#### SEC-002 · Limites applicatives sur connexion, inscription, réinitialisation
- **Constat** : les appels Supabase partent du serveur Vercel ; la limite Supabase par IP voit l'adresse du serveur, commune à tous.
- **Correctif fait (branche)** : `loginMember` 30 essais / 15 min par IP et 10 / 15 min par identifiant (remis à zéro au succès) ; `registerMember` 10 / heure par IP ; `resetMemberPassword` 20 / heure par IP et 5 / heure par identifiant. Messages neutres.
- **Reste** : vérification des codes SMS (`verifierCodeInscription`, `verifierCodeReinitialisation`) non limitée côté application (téléphone désactivé) ; longueur minimale du mot de passe 6 (UX-001).
- **Acceptation** : 11e connexion échouée sur un même identifiant en 15 min → « Trop d'essais… » ; un autre membre se connecte normalement.
- **Tests à écrire** : test d'intégration sur un Supabase de test (non disponible).
- **Risque** : limiteur en échec ouvert ; IP dérivée de `x-forwarded-for` (SEC-005).
- **Statut** : implémenté à vérifier (L, typage). **Mise à jour** : 15/09/2026.

#### SEC-003 · Conservation et suppression des données
- **Constat (code)** : la politique de confidentialité (`app/confidentialite/page.tsx:179-195`) promet suppression après 3 ans d'inactivité et conservation de la décharge 10 ans ; aucune tâche de purge ; aucun parcours « Supprimer mon compte » ; la suppression d'un compte efface la décharge en cascade ; colonne `medical_notes` vidée mais présente.
- **Impact** : écart entre promesse RGPD et réalité ; perte de la preuve de décharge en cas de suppression.
- **Solution proposée** : table `waiver_acceptances` (`on delete set null`), fonction `purger_donnees()` planifiée (`pg_cron`), `drop column medical_notes`, action de suppression avec ré-authentification.
- **Décision nécessaire** : durées exactes à faire valider (ce document n'est pas un avis juridique).
- **Priorité** : moyenne. **Effort** : L.
- **Statut** : à préciser. **Mise à jour** : 15/09/2026.

#### SEC-004 · Session pro valide après régénération du code
- **Constat** : cookie `{partnerId, exp}` ; la rotation désactive les codes, pas les sessions (12 h).
- **Preuve** : `lib/pro/guard.ts:92-103`, `lib/admin/repo.ts:187-205`.
- **Correctif fait (branche)** : `codeId` dans la charge du cookie (`lib/pro/guard.ts`, `app/pro/actions.ts`) ; `getActiveProSession` vérifie `partner_access_codes.active` et `partners.active` pour ce code.
- **Effet au déploiement** : les sessions pro ouvertes avec l'ancien format de cookie sont invalidées ; chaque partenaire se reconnecte une fois avec son code.
- **Acceptation** : après « nouveau code » dans l'admin, la session pro précédente renvoie sur `/pro/login`.
- **Priorité** : basse. **Effort** : S. **Statut** : implémenté à vérifier (L, typage). **Mise à jour** : 15/09/2026.

#### SEC-005 · Limiteur : échec ouvert, IP, anciens codes pro
- **Constat** : `lib/limite.ts:22-25` (échec ouvert), `:41-43` (`x-forwarded-for`, sinon « local ») ; `app/pro/actions.ts:105-133` bcrypt sur tous les anciens codes sans empreinte.
- **Correctif fait (branche)** : `x-vercel-forwarded-for` lu en priorité (`lib/limite.ts`).
- **Reste** : désactiver les codes sans empreinte (`update public.partner_access_codes set active=false where code_empreinte is null`, migration de production, accord requis) puis supprimer la branche « anciens codes » de `loginPro` ; échec ouvert conservé (choix documenté).
- **Priorité** : basse. **Effort** : S. **Statut** : implémenté à vérifier (L) pour l'IP ; prêt, bloqué (accord) pour la migration. **Mise à jour** : 15/09/2026.

#### SEC-006 · Réécriture du profil d'un compte non confirmé
- **Constat** : `upsert` service_role sur l'id renvoyé par `signUp`, qui peut être celui d'un compte existant non confirmé.
- **Correctif fait (branche)** : profil écrit seulement si le compte a été créé il y a moins de 2 minutes ; sinon, même écran « Regarde tes mails » (le mail est renvoyé par Supabase). Adresse déjà confirmée (`identities` vide) : même écran, sans écriture.
- **Acceptation** : réinscription avec l'adresse d'un compte non confirmé existant → nom inchangé en base.
- **Statut** : implémenté à vérifier (L, typage ; test d'intégration non disponible). **Mise à jour** : 15/09/2026.

#### SEC-007 · Énumération de comptes à l'inscription
- **Constat** : « Ce mail existe déjà » n'apparaît que si la confirmation d'e-mail est désactivée.
- **Preuve** : confirmation activée en production (`mailer_autoconfirm: false`) → **non applicable aujourd'hui**. L'ancien message « Compte créé, profil bloqué » (fuite par échec d'écriture du profil) est supprimé par SEC-006.
- **Statut** : validé (non applicable en l'état de la configuration). **Mise à jour** : 15/09/2026.

#### SEC-008 · Changement de mot de passe sans ré-authentification
- **Correctif** : activer « Secure password change » (AUTH-005) ; hors session de récupération, exiger l'ancien mot de passe.
- **Priorité** : basse. **Effort** : S (réglage). **Statut** : prêt, bloqué (accès). **Mise à jour** : 15/09/2026.

#### SEC-009 · Envoi de photos : validation déclarative, optimiseur ouvert
- **Constat** : type et poids fournis par le navigateur (`app/admin/courses-actions.ts:65-80`) ; restrictions du bucket posées seulement à sa création ; `next.config.mjs` autorise `*.supabase.co` (tous les projets Supabase) dans l'optimiseur d'images.
- **Correctif fait (branche)** : `remotePatterns` limité à l'hôte de `NEXT_PUBLIC_SUPABASE_URL`, lu au build (`next.config.mjs`) ; sans variable, aucune image distante n'est acceptée.
- **Reste** : migration `storage.buckets` (10 Mo, 4 types d'image) après SEC-012 ; validation serveur du type réel du fichier (lecture des premiers octets) dans `courses-actions.ts`.
- **Priorité** : basse (admin uniquement). **Effort** : S. **Statut** : implémenté à vérifier (L) pour l'optimiseur ; prêt pour le reste. **Mise à jour** : 15/09/2026.

#### SEC-010 · Route de commande sans protections (latente)
- **Constat** : `app/api/checkout/route.ts` sans limite ni contrôle d'`Origin` ; répond 403 (boutique fermée).
- **Correctif fait (branche)** : contrôle `Origin`/`Host` (403 sinon), 5 commandes/heure par IP, téléphone normalisé en E.164 (refusé s'il est illisible).
- **Preuve** : `POST /api/checkout` sans `Origin` ou avec une origine étrangère → 403 (L).
- **Reste** : le même contrôle d'origine sur `/api/contact` (non appliqué : à vérifier que le formulaire de contact envoie bien l'en-tête `Origin`, ce qui est le cas d'un `fetch` navigateur, avant de l'activer).
- **Priorité** : basse. **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEC-011 · Durcissement des droits SQL
- **Constat (migrations)** : seules `profiles` et `rate_limits` retirent les droits par défaut ; RLS seule protège les 12 autres tables (aucune policy permissive trouvée) ; `is_admin()` exécutable par `anon` ; fonctions definer en `search_path = public`.
- **Correctif** : migration `0011_durcir_droits.sql` (révocations par table, `revoke execute on function public.is_admin() from anon`, `drop function public.emettre_code_partenaire(uuid,text)`, `set search_path = ''`).
- **État réel confirmé (SEC-012)** : droits par défaut sur 12 tables, `is_admin` ouvert à `anon`, ancienne surcharge présente. La migration doit aussi : `alter function public.touch_updated_at() set search_path = ''` ; installer `pg_cron` et planifier `reset_monthly_points` (ou documenter que le programme de fidélité est en pause) ; désactiver les 3 anciens codes partenaires.
- **Priorité** : moyenne (relevée : état confirmé). **Effort** : M. **Statut** : prêt, bloqué (accord pour une migration de production). **Mise à jour** : 15/09/2026.

#### SEC-012 · Vérifier l'état réel de la base de production
- **Objectif** : confirmer que la configuration versionnée est active.
- **Requêtes (lecture seule)** : `select version from supabase_migrations.schema_migrations` ; `select * from pg_policies where schemaname in ('public','storage')` ; `select grantee, table_name, privilege_type from information_schema.role_table_grants where table_schema='public' and grantee in ('anon','authenticated')` ; `select proname, prosecdef, proconfig, proacl from pg_proc where pronamespace='public'::regnamespace` ; `select id, public, file_size_limit, allowed_mime_types from storage.buckets`.
- **Tests d'accès prévus (environnement de test, comptes fictifs A et B)** : visiteur → aucune donnée privée ; A → lecture/modification de `profiles` de B refusée ; A → colonnes `role`, `lifetime_points`, `qr_token` non modifiables ; A → actions admin refusées (actions serveur appelées directement) ; `races` publiées sans champs privés.
- **Résultat des requêtes (15/09/2026, lecture seule)** :
  - `supabase_migrations.schema_migrations` : **vide**. Les migrations 0001 à 0010 ont été appliquées par l'éditeur SQL, pas par l'outil de migration ; le schéma observé correspond bien à l'état après 0010 (`rate_limits`, `emettre_code_partenaire` à 3 arguments, `invitation_profil_vue`, `medical_notes` encore présente).
  - RLS activée sur les 14 tables ; 16 policies, toutes conformes aux migrations ; 7 tables sans policy (réservées à la clé service).
  - Droits par défaut confirmés : `anon` et `authenticated` ont SELECT/INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER sur 12 tables (seules `profiles` et `rate_limits` sont restreintes). RLS seule protège.
  - `is_admin()` exécutable par `anon` ; `touch_updated_at` sans `search_path` ; `emettre_code_partenaire(uuid,text)` (ancienne surcharge) toujours présente. Toutes les fonctions definer en `search_path=public`.
  - Bucket `sorties` : public, 10 Mo, 4 types d'image (conforme au code). Aucune policy Storage.
  - `pg_cron` **absent** : la remise à zéro mensuelle des points (`reset_monthly_points`) n'est planifiée nulle part.
  - Protection contre les mots de passe divulgués : désactivée (advisor Supabase).
  - 3 anciens codes partenaires actifs sans empreinte (SEC-005) ; 3 partenaires ; 3 sorties à venir ; 8 inscriptions ; 2 admins.
- **Advisors Supabase (sécurité)** : `anon_security_definer_function_executable` (is_admin), `function_search_path_mutable` (touch_updated_at), `auth_leaked_password_protection`, `rls_enabled_no_policy` ×7 (informatif). Liens : https://supabase.com/docs/guides/database/database-linter
- **Reste** : tests d'accès A/B avec comptes fictifs (environnement de test).
- **Priorité** : haute. **Effort** : M. **Statut** : validé pour l'état de la base ; tests A/B bloqués (environnement de test). **Mise à jour** : 15/09/2026.

#### SEC-015 · Erreurs d'exécution en production (Vercel, 7 derniers jours)
- **Constat (15/09/2026, projet Vercel `nulll`, équipe `NULLL`, offre Hobby)** :
  - `Missing SESSION_SECRET environment variable` sur `/pro/login`, 4 fois le 10/09 (déploiement `dpl_3AGkro…`) : la variable était absente ou trop courte. Aucune occurrence depuis ; **à vérifier** dans Vercel → Settings → Environment Variables que `SESSION_SECRET` (≥ 32 caractères) existe pour Production.
  - `AuthApiError: Request rate limit reached` ×14 et `Refresh Token Not Found` ×8 sur `/membre` le 08/09 (un seul visiteur, une minute) : rafale de renouvellements de session ; sans suite depuis le partage de session par `cache()` du 12/09.
  - `fetch failed` sur `/membre/login` ×1 (12/09) : coupure réseau ponctuelle vers Supabase.
- **Priorité** : basse. **Statut** : à préciser (vérification de la variable). **Mise à jour** : 15/09/2026.

#### SEC-013 · En-têtes HTTP
- **Constat (production)** : HSTS `max-age=63072000` sans `includeSubDomains`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` ; pas de CSP complète (choix documenté dans `next.config.mjs` : bouton Google et Supabase).
- **Proposition** : CSP en `Content-Security-Policy-Report-Only` d'abord (`default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com; frame-src https://accounts.google.com; connect-src 'self' https://*.supabase.co https://accounts.google.com; img-src 'self' data: https://*.supabase.co https://*.googleusercontent.com; style-src 'self' 'unsafe-inline' https://accounts.google.com`), observer, puis appliquer.
- **Priorité** : basse. **Effort** : M. **Statut** : à préciser. **Mise à jour** : 15/09/2026.

#### SEC-014 · Dépendances vulnérables
- **Constat** : `pnpm.overrides` corrige déjà `brace-expansion`, `browserslist`, `js-yaml`, `baseline-browser-mapping`.
- **Preuve** : `pnpm audit --prod` et `pnpm audit` (15/09/2026, lockfile de la branche) : « No known vulnerabilities found » (`qa-artifacts/preuves/pnpm-audit-prod.txt`). Base de l'audit : avis publiés sur le registre npm à cette date ; à relancer à chaque mise à jour de dépendances.
- **Statut** : validé (L, 15/09/2026). **Mise à jour** : 15/09/2026.

### PERF : performances

#### PERF-001 · Image LCP en priorité haute
- **Problème** : `priority` ne pose pas `fetchpriority="high"` en Next 16 ; l'image principale partait en priorité basse.
- **Preuve** : Lighthouse `lcp-discovery-insight` « fetchpriority=high should be applied : false », requête `hero-city.jpg` priorité `Low` (production).
- **Correctif fait** : `preload` + `fetchPriority="high"` sur la photo principale de l'accueil (`components/home-experience.tsx`) et de `/fr/runs` (`app/[locale]/runs/page.tsx`) ; logo de l'en-tête et filigrane de `/identification` en `loading="eager"` sans préchargement. Pages de compte (`account-shell`), photo des fondateurs et `PosterPhoto` : `priority` d'origine conservé.
- **Preuve après** : HTML local `<link rel="preload" as="image" … fetchPriority="high">` pour `hero-city.jpg` ; A/B B.6.1 : LCP mobile −205 ms sur `/fr` et `/fr/runs`, priorité de la photo de `/fr/runs` passée de Low à High.
- **Régression évitée** : la même règle sur les pages de compte augmentait le LCP mobile de `/membre/register` de 1118 ms (l'élément LCP y est le bandeau cookies, pas la photo) ; retirée, remesurée : écart non significatif.
- **Acceptation** : en production, LCP mobile médian de `/fr` et `/fr/runs` inférieur aux valeurs B.5 (3039 et 2873 ms) sur 3 exécutions, sans régression visuelle.
- **Suite possible (PERF-010)** : sur les pages de compte, le LCP est le texte du bandeau cookies qui apparaît après l'hydratation ; le rendre dès le HTML serveur (ou le réserver visuellement) réduirait ce LCP. À mesurer avant tout changement.
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### PERF-002 · Client Supabase retiré des pages publiques
- **Problème** : `components/lien-compte.tsx` ouvrait le client Supabase pour afficher « Mon compte » : chunk de 260 Ko bruts / 68 Ko compressés sur chaque page.
- **Correctif fait** : lecture de la présence du cookie `sb-…-auth-token` ; aucun droit n'en dépend (`/membre` revérifie la session côté serveur).
- **Preuve après** : 0 chunk contenant `GoTrueClient`/`RealtimeClient` parmi les 11 scripts de `/fr` (L).
- **Limite connue** : une session expirée affiche « Mon compte » jusqu'au clic, qui mène alors à la connexion.
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### PERF-003 · Images plus grandes que l'affichage
- **Preuve** : Lighthouse `uses-responsive-images` : `principle-meet.webp` w=750 (92 Ko, 43 Ko récupérables), `apres-course-sol.webp` w=750 (146 Ko, 69 Ko), visuels Supabase des sorties.
- **Correctif** : ajuster `sizes` au rendu réel (ex. `sizes="(max-width: 760px) 100vw, 45vw"` → mesurer la largeur affichée à 412 px et corriger) ; `quality={70}` sur les photos plein cadre sombres voilées.
- **Priorité** : basse. **Effort** : S. **Statut** : prêt. **Mise à jour** : 15/09/2026.

#### PERF-004 · Script Google Identity sur les pages de compte
- **Preuve** : `accounts.google.com/gsi/client` 99 Ko, 71 Ko inutilisés, police Google Sans chargée (`/membre/register`).
- **Options** : charger le script au premier survol/focus de la zone Google, ou `strategy="lazyOnload"`. Décision : l'effet sur le taux de connexion Google est à surveiller.
- **Priorité** : basse. **Effort** : M. **Statut** : à préciser. **Mise à jour** : 15/09/2026.

#### PERF-005 · Polices
- **Preuve** : 3 fichiers woff2 (12 + 73 + 45 Ko) en priorité haute.
- **Action** : vérifier les graisses réellement utilisées de Roboto Condensed (400/500/700) et Caveat (400/600/700) ; retirer celles qui ne servent pas.
- **Priorité** : basse. **Effort** : S. **Statut** : à préciser. **Mise à jour** : 15/09/2026.

#### PERF-006 · Données terrain (Core Web Vitals réels, INP)
- **Constat** : API PageSpeed Insights « quota exceeded » ; aucune donnée CrUX consultée.
- **Options** : Search Console (rapport Core Web Vitals, gratuit) ; relancer PageSpeed Insights plus tard ou avec une clé API ; Vercel Speed Insights (vérifier le coût de l'offre avant activation).
- **Statut** : bloqué (accès Search Console). **Mise à jour** : 15/09/2026.

#### PERF-007 · `middleware.ts` → `proxy.ts`
- **Preuve** : avertissement du build Next 16.3.4 ; documentation Next « middleware … deprecated and has been renamed to proxy ».
- **Correctif fait (branche)** : `git mv middleware.ts proxy.ts`, fonction renommée `proxy` ; build sans avertissement ; `/about` → 308 `/fr/communaute`, `/?code=x` → 307 `/auth/callback?code=x` (L). `/pro` sans cookie à revérifier en préproduction.
- **Priorité** : basse. **Effort** : S. **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### PERF-008 · Edge Runtime déprécié (`app/opengraph-image.tsx`, `app/twitter-image.tsx`)
- **Correctif fait (branche)** : `runtime = "edge"` retiré ; logo lu sur disque (`readFile` + data URI) au lieu d'un `fetch` relatif. `/opengraph-image` devient statique (généré au build).
- **Preuve** : `GET /opengraph-image` → 200, `image/png`, 1200×630, 60 Ko (L).
- **Priorité** : basse. **Effort** : S. **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### PERF-009 · Comparaison en production après déploiement
- **Protocole** : même commande Lighthouse que B.5 (3 exécutions, médianes, mêmes pages), à heure comparable ; puis Search Console 28 jours après.
- **Statut** : bloqué (déploiement). **Mise à jour** : 15/09/2026.

### SEO : référencement

Source détaillée : `qa-artifacts/audit-seo.md` (48 requêtes, 15/09/2026).

#### SEO-001 · Contenu daté de la première sortie
- **Problème** : `/fr/communaute` et sa FAQ structurée disaient « a lieu le samedi 26 septembre 2026 », faux à partir du 27/09.
- **Correctif fait** : `lib/site-content.ts` calcule `premiereSortieFaite` (26/09/2026 8h30 Paris) : statut de la ligne de vie, réponse FAQ (« Pas encore… » → « Oui. Notre première sortie collective a eu lieu… On court depuis tous les samedis, même heure, même endroit. »), texte Instagram ; `revalidate = 3600` sur `app/[locale]/communaute/page.tsx`.
- **À valider par le propriétaire** : la phrase « On court depuis tous les samedis, même heure, même endroit. » suppose que le rendez-vous hebdomadaire est maintenu ; la modifier sinon.
- **Acceptation** : le 27/09 au plus tard 1 h après 8h30, la FAQ affiche « Oui… a eu lieu ».
- **Statut** : implémenté à vérifier (L : « Pas encore » affiché). **Mise à jour** : 15/09/2026.

#### SEO-002 · Maillage interne des guides
- **Problème** : `/fr/evenements-running-aix` sans aucun lien interne (orpheline hors sitemap) ; guides non reliés entre eux.
- **Correctif fait** : pied de page, colonne Navigation : « Run club à Aix », « Courir à Aix », « Événements running » (remplace « Guide local ») ; bloc « À lire aussi » en fin de chaque guide ; lien « les événements running à Aix » dans le paragraphe « Pour aller plus loin » de la page Club.
- **Preuve** : HTML local de `/fr` contient les 3 liens ; `/fr/evenements-running-aix` lie les 2 autres guides.
- **Statut** : implémenté à vérifier (L ; contrôle visuel du pied de page mobile à faire). **Mise à jour** : 15/09/2026.

#### SEO-003 · Pages en concurrence : une intention par page
- **Problème** : « run club Aix » visé par l'accueil, la page Club et le guide ; « courir à Aix » par le title de l'accueil et le guide ; section « Où l'on court autour d'Aix » du guide run club qui reprend le guide « courir » ; page événements dont le title ne correspond pas au H1.
- **Répartition cible** :

| URL | Intention | Title proposé | Meta description proposée |
|---|---|---|---|
| `/fr` | marque + social run club | `NULLL.CLUB · Social run club à Aix-en-Provence` | `Le social run club d’Aix-en-Provence. Une sortie gratuite chaque samedi à 8h30, à une allure qui permet de discuter. Tous niveaux.` |
| `/fr/run-club-aix-en-provence` | « run club / club de course Aix » | inchangé : `Run club à Aix-en-Provence | NULLL.CLUB` | inchangée |
| `/fr/courir-a-aix-en-provence` | « où courir / parcours » | inchangé : `Courir à Aix-en-Provence | Lieux et repères` | inchangée |
| `/fr/evenements-running-aix` | « événements / agenda running Aix » | **fait** : `Événements running à Aix-en-Provence | NULLL.CLUB` | `Le rendez-vous running du samedi 8h30 à Aix-en-Provence, les prochaines dates du club et l’après-course. Gratuit et ouvert à tous.` |
| `/fr/runs` | transactionnel « s'inscrire à une sortie » | inchangé | inchangée |
| `/fr/communaute` | histoire du club | inchangé | inchangée |

- **Textes de remplacement** (`lib/site-content.ts`, article `localClub`, section « Où l’on court autour d’Aix ») :
  - Titre : `Des parcours en ville et autour d’Aix`
  - Paragraphe 1 : `Chaque sortie du club annonce son parcours et sa distance. Le départ habituel reste le parking du chemin de la Cible, samedi à 8h30.`
  - Paragraphe 2 : `Pour courir seul en semaine, parc Jourdan, la Torse ou le lac du Réaltor : les repères sont dans notre guide pour courir à Aix-en-Provence.`
- **Section « Les temps forts de l’année à Aix »** (article `localEvents`) : ne cite aucun événement. Soit la remplacer par des événements réels vérifiés par le propriétaire (nom, date, lien officiel), soit la retirer. Ne rien inventer.
- **Maillage** : H2 de la page Club « Rejoindre un club de sport à Aix-en-Provence » → garder ; ajouter dans son premier paragraphe un lien vers `/fr/run-club-aix-en-provence` (nécessite un corps avec lien, aujourd'hui texte simple).
- **Données structurées** : aucune nouvelle ; `BreadcrumbList` existant.
- **Statut** : prêt (textes à valider pour le ton), partiellement implémenté (title événements, L). **Mise à jour** : 15/09/2026.

#### SEO-004 · H1 de l'accueil réduit à la marque
- **Preuve** : `<h1 id="home-title">NULLL<span>.CLUB</span></h1>` (`components/home-experience.tsx:31`).
- **Proposition sans changer le visuel** : garder le logotype, ajouter dans le H1 une ligne visible aux styles de `.home-label` : `NULLL.CLUB` + `<span class="home-label">Social run club à Aix-en-Provence</span>`, en retirant le `<p class="home-label">` actuel « Social sport club · Aix-en-Provence » placé au-dessus (même texte, même place visuelle, balise différente). À valider visuellement : la règle CSS `#home-title span` stylise déjà le `<span>` « .CLUB » et doit être ciblée plus finement.
- **Priorité** : moyenne. **Effort** : S. **Statut** : à préciser (validation DA). **Mise à jour** : 15/09/2026.

#### SEO-005 · Données structurées cohérentes
- **Correctif fait** : `@id` commun `https://nulll.club/#club` (Organization, SportsClub, `WebSite.publisher`, `Event.organizer`) ; accents (« Course à pied », « Provence-Alpes-Côte d’Azur ») ; suppression d'`openingHoursSpecification` (08:00-12:00 contredisait 8h30, aucune heure de fin publiée) ; `SportsClub.url` = accueil ; `Event.name` = `Sortie NULLL.CLUB · <date affichée>` ; LinkedIn sans `?viewAsMember=true`.
- **Reste** : code postal `13090` à confirmer ; `geo` possible dans `Event.location` depuis `lib/rendez-vous.ts` ; heure de fin si le club la publie.
- **Tests** : validateur Schema.org / test des résultats enrichis Google sur l'URL de production après déploiement.
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-006 · `x-default`
- **Correctif fait** : `x-default` = canonical de la page (`lib/seo.ts`). **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-007 · Anciennes URL `/en/*` en 404
- **Constat** : 8 URL `/en/…` en 404 ; aucune version anglaise.
- **Action** : seulement si Search Console montre du trafic ou des liens vers `/en/*`, ajouter des 308 vers les équivalents FR.
- **Statut** : à préciser (Search Console). **Mise à jour** : 15/09/2026.

#### SEO-008 · Chaîne de redirection `/about`
- **Correctif fait** : `/about` → `/fr/communaute` (308, un saut). **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-009 · `/fr/merch` mince tant que la boutique est fermée
- **Constat** : 106 mots hors en-tête et pied, 3 produits « Bientôt », dans le sitemap.
- **Options** : `noindex, follow` et retrait du sitemap tant que `BOUTIQUE_OUVERTE = false` ; ou enrichir la page (matières, coupe, date d'ouverture réelle).
- **Décision** : propriétaire (le merch est un objectif du site). **Statut** : à préciser. **Mise à jour** : 15/09/2026.

#### SEO-010 · Page 404 vide dans le HTML initial
- **Correctif fait** : `export const dynamicParams = false` dans `app/[locale]/layout.tsx`.
- **Preuve après** : `/en` et `/xx/runs` rendent « On a perdu cette page » (128 mots, `lang="fr"`) (L).
- **Reste** : deux balises `robots` (`noindex` et `noindex, follow`) sur la 404 (UX-002).
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-011 · Pages légales sans canonical
- **Correctif fait** : canonical et `openGraph` (title, description, url) sur `/confidentialite` et `/mentions-legales`. **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-012 · Image de partage sans dimensions ni texte alternatif
- **Correctif fait** : `og:image` et `twitter:image` avec `width 1200`, `height 630`, `alt` (`lib/seo.ts`) ; même image redonnée aux pages légales, dont l'`openGraph` ajouté (SEO-011) masquait l'image du fichier.
- **Note** : une première version retirait l'image en comptant sur `app/opengraph-image.tsx` ; le HTML local a montré que l'image disparaissait alors. Corrigé (voir E).
- **Preuve** : HTML local de `/fr`, `/fr/evenements-running-aix`, `/confidentialite`, `/mentions-legales` : `og:image`, `og:image:width=1200`, `og:image:alt` présents.
- **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-013 · Contenus hérités non affichés
- **Constat** : `sharedEvents`/`buildRuns` (lieu « Parking Émile Zola », dates en dur), `aboutPage`, `home.faq` non lus.
- **Correctif fait (branche)** : blocs supprimés de `lib/site-content.ts` après vérification qu'aucun composant ne lisait `copy.home`, `copy.aboutPage` ni `copy.runs` (les sorties viennent de `lib/races/repo.ts`). Typage et build OK.
- **Priorité** : basse. **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### SEO-014 · `www.nulll.club` en erreur de certificat
- **Preuve** : `curl https://www.nulll.club/` → « no alternative certificate subject name matches target host name » ; DNS `www` → `216.198.79.1` (Vercel).
- **Impact** : toute personne ou tout lien utilisant `www` tombe sur une alerte de sécurité.
- **Correctif** : Vercel → projet → Domains → ajouter `www.nulll.club` avec redirection 308 vers `nulll.club`.
- **Priorité** : haute (effort minime). **Effort** : S. **Statut** : bloqué (accès Vercel + accord). **Mise à jour** : 15/09/2026.

#### SEO-015 · Search Console et fiche Google
- **Constat** : balise de vérification Search Console présente (`app/layout.tsx`) ; données non consultées ; commentaire du code mentionnant une fiche Google.
- **Actions** : soumettre le sitemap ; relever requêtes et pages ; vérifier la cohérence de la fiche Google (adresse, horaires, site) avec le site.
- **Statut** : bloqué (accès). **Mise à jour** : 15/09/2026.

### UX : parcours, accessibilité, vie privée

#### UX-001 · Longueur minimale du mot de passe
- **Constat** : formulaire « Six caractères au minimum » (`RegisterForm.tsx`, `PasswordForm.tsx`, `actions.ts`) ; réglage Supabase inconnu.
- **Proposition** : 8 caractères minimum, aligné sur Supabase. **Statut** : à préciser (AUTH-005). **Mise à jour** : 15/09/2026.

#### UX-002 · Double balise robots sur la page 404
- **Correctif fait (branche)** : `robots` retiré des métadonnées de `app/not-found.tsx` ; Next pose déjà `noindex` sur une 404. Preuve : `/en` → une seule balise `noindex` (L).
- **Priorité** : basse. **Statut** : implémenté à vérifier (L). **Mise à jour** : 15/09/2026.

#### UX-003 · Tests manuels de parcours et d'accessibilité
- **Non testé** : navigation clavier complète, lecteur d'écran, inscription/désinscription à une sortie, profil, QR, décharge, contact, admin, pro, sur mobile/tablette/ordinateur réels. Lighthouse A11y 100 ne remplace pas ces tests.
- **Préalable** : environnement de test avec comptes fictifs.
- **Statut** : bloqué (environnement). **Mise à jour** : 15/09/2026.

#### UX-004 · Vie privée : script Google sur les pages de compte
- **Constat** : le bouton Google charge `accounts.google.com/gsi/client` et une police Google sur `/membre/login` et `/membre/register` ; le bandeau parle de cookies « servant à la connexion ».
- **Action** : vérifier que la politique de confidentialité mentionne Google comme prestataire de connexion et les données transmises au chargement du bouton ; faire valider le besoin de consentement (point de conformité, pas un avis juridique).
- **Statut** : à préciser. **Mise à jour** : 15/09/2026.

---

## D. Feuille de route

### Étape 1 · Immédiat, sans accès supplémentaire
1. Relire la branche `audit/seo-perf-securite-auth` (diff, captures), valider les textes SEO-001 et SEO-003, puis commiter (identité git à configurer).
2. Reste sans accès : PERF-003 (tailles d'images), SEC-009 (type réel des fichiers envoyés), contrôle d'origine sur `/api/contact`.

### Étape 2 · Accès en lecture (Supabase, Vercel, Search Console)
4. **AUTH-001** : SMTP réel. **Prochaine intervention recommandée.**
5. **SEC-012** : état réel de la base (migrations, policies, grants, buckets).
6. AUTH-005 : relevé des réglages Auth ; PERF-006 / SEO-015 : données Search Console.

### Étape 3 · Avec accord explicite
7. Déploiement de la branche (préproduction avec base de test si disponible, puis production).
8. AUTH-006 (DNS DKIM/DMARC), AUTH-001 (SMTP), AUTH-004 (gabarits), AUTH-005 (réglages).
9. AUTH-008 : test bout en bout ; PERF-009 : mesures production.
10. SEO-014 : domaine `www` dans Vercel.

### Étape 4 · Décisions et chantiers plus longs
11. SEC-003 (conservation, suppression de compte) après validation des durées.
12. SEC-011 (migration de durcissement), SEC-013 (CSP en observation).
13. SEO-004 (H1), SEO-009 (merch), PERF-004 et PERF-005, UX-003, UX-004.

---

## E. Historique des décisions

| Date | Décision | Justification |
|---|---|---|
| 15/09/2026 | Travailler sur `audit/seo-perf-securite-auth`, sans pousser ni déployer | règles de l'intervention : accord requis avant production |
| 15/09/2026 | Confirmation par `/auth/confirmer` avec `token_hash` dans le fragment et validation au clic, plutôt que `{{ .ConfirmationURL }}` ou un `token_hash` en paramètre d'URL traité en GET | compatibilité multi-appareils (pas de PKCE), résistance aux scanners, jeton hors des journaux ; pattern `verifyOtp({ token_hash, type })` de la documentation Supabase |
| 15/09/2026 | Garder `/auth/callback` et l'ancien format de lien actifs | déploiement du code possible avant le changement de gabarit, retour arrière simple |
| 15/09/2026 | Pas de nouveau service e-mail côté code ; gabarits Supabase + SMTP personnalisé, option OVH ou prestataire à choisir | besoin couvert sans dépendance ; coût nul possible |
| 15/09/2026 | Limites applicatives dans les actions serveur (table `rate_limits` existante) | la limite Supabase par IP voit l'adresse du serveur |
| 15/09/2026 | Retrait d'`openingHoursSpecification` | 08:00-12:00 contredisait 8h30 ; aucune heure de fin publiée ; rien inventer |
| 15/09/2026 | `LienCompte` lit la présence du cookie au lieu d'ouvrir le client Supabase | 68 Ko compressés économisés sur chaque page publique ; aucune autorisation ne dépend du libellé |
| 15/09/2026 | Changement de solution SEO-012 : retrait des `images` de `buildPageMetadata` abandonné, images redonnées avec dimensions et alt | le HTML local a montré que l'`openGraph` de la page remplace les images des fichiers `opengraph-image` |
| 15/09/2026 | Changement de solution PERF-001 : préchargement haute priorité limité à l'accueil et à `/fr/runs`, retiré des pages de compte, de la photo des fondateurs et de `PosterPhoto` | A/B local : +1118 ms de LCP mobile sur `/membre/register` avec la règle générale ; seules les pages où la photo est l'élément LCP en profitent (mesuré) |
| 15/09/2026 | Textes éditoriaux SEO-003 et H1 SEO-004 proposés, non appliqués (sauf title événements) | ton et direction artistique à valider par le propriétaire |
| 15/09/2026 | Deuxième série de corrections « prêtes » appliquée sans attendre (SEC-001 partiel, SEC-004, SEC-005, SEC-009 partiel, SEC-010, PERF-007, PERF-008, SEO-013, UX-002) | demande du propriétaire de poursuivre en autonomie ; changements locaux, réversibles, sans effet en production |
| 15/09/2026 | Restriction des SMS aux numéros français non appliquée | décision produit (membres au numéro étranger) laissée au propriétaire |
| 15/09/2026 | Outils de mesure (Node, Lighthouse) installés hors du dépôt (`~/.cache/nulll-audit`) | éviter qu'ESLint et TypeScript analysent des fichiers étrangers au projet |

---

## F. Procédure de reprise

1. **Lire ce cahier des charges en entier** avant toute nouvelle intervention, puis l'annexe concernée.
2. **Vérifier sa correspondance avec le code et la configuration réels** : `git log`, branche, fichiers cités, réglages Supabase/Vercel. La présence d'une configuration dans le dépôt ne prouve pas qu'elle est active en production.
3. **Référencer les identifiants des fiches traitées** (ex. `SEC-004`) dans les messages de commit, les demandes de fusion et ce document.
4. **Préserver les corrections et contraintes déjà validées** (sections A.4, A.5, fiches `validé` ou `déployé`) et la direction artistique.
5. **Mettre à jour ce document après chaque changement et chaque test** : statut, environnement (L / P / Prod), date, preuve.
6. **Distinguer prévu, implémenté, testé et déployé** ; une correction validée en local n'est pas déployée.
7. **Ne marquer aucune tâche comme `validé` sans preuve** (commande, capture, mesure, requête), référencée dans la fiche.
8. **En cas de contradiction avec le code**, constater et documenter l'écart avant de choisir une correction.
9. **Ne jamais inscrire de secret, jeton ou donnée personnelle réelle** dans ce document, les preuves ou git ; masquer toute donnée réelle rencontrée par accident et arrêter l'exploration concernée.
10. **Tests actifs de sécurité** : seulement en local ou en préproduction isolée, avec des comptes fictifs identifiables ; toute action en production (déploiement, migration, DNS, service payant) demande un accord explicite préalable.

### Commandes de vérification

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
# build sans secrets (valeurs factices) :
NEXT_PUBLIC_SUPABASE_URL=https://exemple.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=factice NEXT_PUBLIC_SITE_URL=https://nulll.club pnpm build
```

### Retour arrière des changements de cette intervention

- Code : ne pas fusionner la branche, ou `git revert` des commits concernés ; après déploiement, Instant Rollback Vercel vers le déploiement précédent.
- Aucune migration SQL ni aucun changement DNS ou Supabase n'a été appliqué par cette intervention.
- Gabarits, SMTP, DNS : procédures de l'annexe §8.
