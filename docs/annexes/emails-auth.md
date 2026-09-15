# Annexe : e-mails d'authentification et configuration Supabase

Fiches liées : AUTH-001 à AUTH-007, SEC-012 (voir `docs/CAHIER_DES_CHARGES.md`).
Dernière mise à jour : 15/09/2026.

> Rien de ce document n'est actif en production tant que la fiche correspondante
> n'est pas au statut « déployé ». Ne jamais inscrire ici un mot de passe SMTP,
> une clé ou un jeton.

## 1. État constaté (15/09/2026)

| Élément | Valeur | Source |
|---|---|---|
| Confirmation d'e-mail obligatoire | oui (`mailer_autoconfirm: false`) | `GET /auth/v1/settings` du projet, clé publique (preuve : `qa-artifacts/preuves/supabase-auth-settings.json`) |
| Fournisseurs actifs | e-mail, Google | idem |
| Téléphone (SMS) | désactivé (`phone: false`) | idem |
| Inscriptions ouvertes | oui (`disable_signup: false`) | idem |
| Gabarit de confirmation en production | gabarit Supabase par défaut | déclaration du propriétaire (non lisible par l'API) |
| SMTP personnalisé | **absent** : `mail.send` depuis `noreply@mail.app.supabase.io` (journaux Auth, 14/09 23:28 UTC) | API Supabase, 15/09/2026 |
| MX du domaine | OVH (`mx0…mx3.mail.ovh.net`) | DNS public |
| SPF | `v=spf1 include:mx.ovh.com ~all` | DNS public |
| DKIM | **actif pour la messagerie OVH** : `ovhmo-selector-1` et `ovhmo-selector-2._domainkey` (CNAME vers `dkim.mail.ovh.net`, clés RSA 2048 publiées, vérifié le 15/09/2026 via l'API OVH et `dig`) ; aucun sélecteur `resend`, `google`, `default`, `brevo1` | zone OVH (API), DNS public |
| DMARC | absent (`_dmarc.nulll.club` sans TXT) | DNS public |

**Point bloquant confirmé** : sans SMTP personnalisé, le service d'envoi intégré
de Supabase n'envoie qu'aux adresses des membres de l'équipe du projet, et au
plus 2 e-mails par heure (documentation Supabase « Custom SMTP »). Si c'est le
cas en production, les inscrits hors équipe ne reçoivent pas l'e-mail de
confirmation et ne peuvent pas activer leur compte. À vérifier en premier.

## 2. Parcours implémenté dans le code (branche `audit/seo-perf-securite-auth`)

1. `/membre/register` → action `registerMember` → `supabase.auth.signUp` avec
   `emailRedirectTo = https://nulll.club/auth/callback?next=/membre[?sortie=…]`.
2. Écran « Regarde tes mails » dans le formulaire (adresse saisie, durée du lien,
   spams, bouton « Renvoyer l'e-mail » bloqué 60 s après chaque envoi, limité à
   3 envois/heure par adresse et 10/heure par connexion, lien « Recommencer »).
3. L'e-mail contient `{{ .SiteURL }}/auth/confirmer#token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}`.
4. `/auth/confirmer` lit le fragment dans le navigateur, l'efface de la barre
   d'adresse et affiche le bouton « Confirmer mon adresse email ».
5. Le bouton appelle l'action serveur `confirmerLienEmail` → `verifyOtp({ token_hash, type })`
   → session ouverte sur l'appareil qui clique → « Adresse confirmée » → « Aller à mon espace »
   (`/membre`, sortie choisie conservée).
6. Cas traités : lien incomplet, expiré ou déjà utilisé (avec renvoi), panne
   réseau ou Supabase (le lien reste valable, bouton pour réessayer), autre
   navigateur ou appareil (fonctionne, aucun cookie d'inscription requis),
   connexion avant confirmation (message + renvoi sur la page de connexion).

Pourquoi ce choix :
- **Scanners de liens des messageries** : ouvrir la page ne consomme rien, seul
  le clic sur le bouton (requête POST) valide le jeton.
- **Jeton hors des journaux** : le fragment `#…` n'est jamais envoyé au serveur,
  ni dans l'en-tête Referer ; la page ajoute en plus `referrer: no-referrer`.
  Le site n'a aucun outil d'analytics (vérifié dans le code).
- **Pas de mécanisme maison** : le jeton est émis et vérifié par Supabase.
- **Compatibilité** : l'ancien gabarit (`{{ .ConfirmationURL }}`) continue de
  fonctionner via `/auth/callback` tant que le nouveau n'est pas collé.

Même mécanisme pour le mot de passe oublié (`type=recovery` → `/membre/mot-de-passe`).

## 3. Gabarits à coller dans Supabase

Tableau de bord → Authentication → Emails → Templates.

| Gabarit Supabase | Objet | Corps (HTML) | Version texte |
|---|---|---|---|
| Confirm signup | `Confirme ton adresse email · NULLL.CLUB` | `supabase/emails/confirmation.html` | `supabase/emails/confirmation.txt` |
| Reset password | `Ton nouveau mot de passe · NULLL.CLUB` | `supabase/emails/reinitialisation.html` | `supabase/emails/reinitialisation.txt` |

Variables utilisées (documentation « Email Templates ») : `{{ .SiteURL }}`,
`{{ .TokenHash }}`, `{{ .RedirectTo }}`. Aucune autre.

Limite de la plateforme : le gabarit Supabase ne prend qu'un corps HTML. Les
fichiers `.txt` servent de référence et de version à utiliser si un jour les
e-mails partent par un prestataire qui accepte une partie texte. Le HTML reste
lisible images bloquées (logo remplacé par le texte « NULLL.CLUB », capture
`qa-artifacts/captures/emails/confirmation-390-images-bloquees.png`).

La durée « 1 heure » écrite dans les gabarits et dans `lib/auth/confirmation.ts`
(`DUREE_LIEN_EMAIL`) doit rester égale au réglage **Email OTP Expiration**
(3600 s par défaut). Si ce réglage change, modifier les trois endroits.

Le site ne propose pas de changement d'adresse e-mail : le gabarit « Change
Email Address » n'est pas utilisé (le code accepte néanmoins `type=email_change`).

## 4. Réglages Supabase à appliquer (après accord)

Authentication → URL Configuration :
- Site URL : `https://nulll.club`
- Redirect URLs : `https://nulll.club/auth/callback`, `https://nulll.club/auth/callback?**`,
  `https://nulll.club/membre**`, et pour le développement `http://localhost:3000/**`.
  Ajouter les URL de prévisualisation Vercel seulement si des tests d'inscription
  y sont prévus (et alors avec un projet Supabase de test, pas la production).

Authentication → Sign In / Providers → Email :
- Confirm email : activé (déjà le cas).
- Secure email change : activé.
- Secure password change : activé (SEC-008).
- Email OTP Expiration : 3600 s.
- Longueur minimale du mot de passe : 8 au moins (le formulaire annonce 6 : à
  aligner dans `RegisterForm.tsx` et `PasswordForm.tsx` si le réglage change).

Authentication → Rate Limits (après SMTP) : e-mails 30/h par défaut. Suffisant
au lancement ; relever à 60/h si une sortie attire beaucoup d'inscriptions.

## 5. Envoi : SMTP personnalisé (décision à prendre)

Les gabarits Supabase + un SMTP personnalisé suffisent. Aucun service
supplémentaire n'est nécessaire côté code.

| Option | Coût | Complexité | Délivrabilité | À vérifier |
|---|---|---|---|---|
| A. Boîte OVH existante (`ssl0.ovh.net`, port 465, SSL) avec une adresse du domaine, par ex. `bonjour@nulll.club` ou `contact@nulll.club` | 0 € si l'offre e-mail OVH inclut la boîte | faible : identifiants dans Supabase + DKIM OVH | correcte si DKIM et DMARC en place | quotas d'envoi de l'offre OVH, existence de la boîte |
| B. Prestataire transactionnel (Resend, Brevo, Postmark…) sur un sous-domaine `send.nulll.club` | gratuit sous un quota (à vérifier sur la grille du prestataire le jour du choix) | moyenne : compte + 3 enregistrements DNS | meilleure, journaux d'envoi | ne touche pas aux MX OVH du domaine principal |

**Fait à prendre en compte** : le formulaire de contact (`app/api/contact/route.ts`)
envoie déjà par **Resend** (`RESEND_API_KEY`, expéditeur par défaut
`onboarding@resend.dev` tant que le domaine n'est pas vérifié chez Resend, d'après
le commentaire du code). Aucun enregistrement DKIM Resend n'a été trouvé en DNS :
le domaine n'y est donc probablement pas encore vérifié. Vérifier le domaine
`nulll.club` (ou `send.nulll.club`) chez Resend servirait les deux usages :
contact et e-mails d'authentification (Resend fournit des identifiants SMTP).

Recommandation : **B avec Resend**, déjà présent dans le projet : un seul
prestataire, un seul domaine à vérifier, journaux d'envoi. **A** (boîte OVH)
reste possible si vous préférez ne dépendre d'aucun service externe.

Expéditeur recommandé : nom `NULLL.CLUB`, adresse `bonjour@nulll.club` (ou
`contact@nulll.club`, qui reçoit déjà les réponses). Éviter `no-reply@` :
les réponses d'inscrits perdus doivent arriver quelque part.

## 6. DNS (changements à valider avant application)

Existant à préserver : MX OVH, SPF `include:mx.ovh.com`, `mail.nulll.club` →
`ssl0.ovh.net`, TXT `1|www.nulll.club` (redirection OVH).

- **DKIM (option A)** : activer DKIM dans l'espace client OVH (E-mails → domaine →
  DKIM). OVH publie lui-même les enregistrements de sélecteur. Vérifier ensuite
  avec `dig TXT <selecteur>._domainkey.nulll.club`.
- **SPF** : rien à changer pour l'option A. Option B : le prestataire fournit un
  SPF sur `send.nulll.club` ; ne pas créer un second SPF sur `nulll.club`.
- **DMARC** (dans les deux cas), en commençant en observation :
  `_dmarc.nulll.club  TXT  "v=DMARC1; p=none; rua=mailto:contact@nulll.club; adkim=r; aspf=r"`
  puis, après 2 à 4 semaines de rapports sans échec légitime :
  `p=quarantine`.
- **www** : `www.nulll.club` pointe vers Vercel mais le certificat ne couvre que
  `nulll.club` (erreur TLS constatée). Ajouter `www.nulll.club` au projet Vercel
  (Domains) pour qu'il émette le certificat et redirige vers `nulll.club`
  (fiche SEO-014).

## 7. Ordre de mise en service et tests

1. Déployer le code (compatible avec l'ancien gabarit).
2. Tester l'ancien parcours sur une boîte de test : inscription → e-mail →
   clic → retour sur `/membre`.
3. Configurer le SMTP, DKIM et DMARC.
4. Coller les deux gabarits et leurs objets.
5. Tester, avec une adresse de test dédiée (jamais une adresse de membre) :

| Étape | Preuve attendue |
|---|---|
| Rendu du gabarit | capture du mail reçu sur mobile et ordinateur (Gmail, Outlook, Apple Mail si possible) |
| Envoi accepté par le fournisseur | journal SMTP ou Authentication → Logs sans erreur |
| E-mail reçu | présence en boîte de réception (pas en spam), en-têtes `dkim=pass`, `spf=pass`, `dmarc=pass` |
| Lien fonctionnel | `/auth/confirmer` affiche le bouton ; le fragment disparaît de la barre d'adresse |
| Compte confirmé | `email_confirmed_at` renseigné dans Authentication → Users |
| Session et redirection | « Adresse confirmée » puis `/membre` connecté ; test répété depuis un autre appareil |
| Lien réutilisé | message « expiré ou déjà servi » + renvoi |
| Renvoi | nouvel e-mail reçu ; bouton bloqué 60 s ; 4e demande dans l'heure refusée |
| Mot de passe oublié | e-mail reçu → `/auth/confirmer` → « Continuer » → `/membre/mot-de-passe` |

## 8. Retour arrière

- Gabarits : recoller le gabarit par défaut (bouton « Reset to default » du
  tableau de bord). Le code accepte les deux formats de lien.
- SMTP : désactiver « Custom SMTP » (retour au service intégré limité).
- DMARC : supprimer l'enregistrement `_dmarc` ou repasser en `p=none`.
- Code : `git revert` des commits AUTH de la branche, ou redéployer le
  déploiement Vercel précédent (Instant Rollback).
