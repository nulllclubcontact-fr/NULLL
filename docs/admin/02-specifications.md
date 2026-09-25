# Spécifications — espace admin

Ce que l'admin fait, pour qui, et selon quelles règles. Les user stories du backlog en découlent ; quand une règle change, c'est ici qu'on l'écrit d'abord.

## Profils

| Profil | Qui | Ce qu'il fait | Où |
| --- | --- | --- | --- |
| **Admin** | Tom, Tobias, et les personnes de confiance nommées en base (`profiles.role = 'admin'`) | Crée et publie les sorties, scanne les présences le jour J, gère les partenaires et leurs codes, exporte les inscrits, lit les chiffres | `/admin/*` |
| **Partenaire (pro)** | Un commerce partenaire, identifié par un code `PRO-…` | Scanne le QR d'un membre à l'encaissement pour créditer des points, lit ses propres ventes | `/pro/*` |
| **Membre** | Toute personne inscrite | S'inscrit à une sortie, présente son QR, gère son profil et son accord photo | `/membre/*` |

Un admin est aussi un membre : il garde son espace, sa barre de navigation, ses inscriptions. L'administration est un onglet en plus, en rose, jamais un autre site.

## Parcours principaux

### Créer et publier une sortie

1. L'admin ouvre `/admin/courses`, déplie « Créer une sortie ».
2. Il saisit au minimum un titre et un départ (heure de Paris, quelle que soit l'heure du serveur).
3. Il peut ajouter description, lieu, adresse, distance, places, photo (JPG, PNG, WebP, AVIF, 10 Mo max, envoyée directement vers le stockage).
4. Il choisit brouillon (par défaut) ou publiée. Un statut inconnu retombe sur brouillon, jamais sur publiée.
5. À la création, la sortie reçoit un slug `titre-AAAA-MM-JJ`. Deux sorties de même titre le même jour sont refusées avec un message clair.
6. Publiée, elle apparaît immédiatement sur l'accueil et sur `/fr/runs` (revalidation). Passée son heure de départ, elle quitte la liste publique et bascule dans « Sorties passées » de l'admin.
7. L'action est inscrite au journal.

### Faire vivre une sortie

- Depuis la liste, des raccourcis avancent le statut : publier, fermer, terminer. **Jamais en arrière** : rouvrir une sortie terminée se fait sur la fiche, en connaissance de cause.
- La fiche permet tout : modifier, changer la photo, exporter, scanner, supprimer.
- **Supprimer** une sortie sans inscrit l'efface (et sa photo). Avec des inscrits, elle est **annulée**, pas effacée : les inscriptions et les scans restent, comme la politique de confidentialité le promet.
- Chaque changement de statut, modification, photo, annulation ou suppression est inscrit au journal.

### Le jour de la sortie : scanner

1. L'admin ouvre `/admin/scanner`, choisit la sortie (publiée ou fermée ; jamais un brouillon ni une annulée).
2. La caméra s'ouvre (HTTPS obligatoire). Il présente les QR des membres.
3. Chaque scan est décidé par la fonction SQL `checkin_by_token` : inscription verrouillée, sortie comparée, résultat tracé dans `checkins` même en cas de refus.
4. L'écran affiche le résultat en couleur (présent, déjà scanné, mauvaise sortie, QR invalide, inscription annulée), le prénom, et les compteurs scannés / inscrits, relus après chaque scan (plusieurs admins peuvent scanner en même temps).
5. Un même QR n'est renvoyé qu'une fois par trois secondes.

### Exporter les inscrits

- Depuis la fiche, « Export CSV » télécharge prénom, nom, e-mail, téléphone, accord photo, statut, présence, heure de scan, date d'inscription.
- Point-virgule, BOM UTF-8, formules neutralisées : le fichier s'ouvre proprement dans Excel en français sans exécuter quoi que ce soit.
- **Chaque export est inscrit au journal** avec le nombre de lignes : c'est un accès à des données personnelles.

### Gérer les partenaires

- Créer un partenaire (nom, e-mail facultatif) génère son premier code, affiché **une seule fois**. Seule l'empreinte est stockée.
- Générer un nouveau code révoque l'ancien.
- Désactiver un partenaire l'empêche de se connecter sans toucher à ses ventes. Supprimer n'est possible que sans vente rattachée ; sinon l'interface explique pourquoi et propose la désactivation.
- La fiche partenaire montre CA, panier moyen, ventes par jour, classement des membres.
- Chaque création, modification, code, activation, désactivation, suppression est inscrite au journal.

### Lire le journal

- `/admin/journal` liste les 200 dernières actions : quand, qui, quoi, détail, avec un lien vers la sortie ou le partenaire concerné quand il existe encore.
- Les exports sont en jaune, les suppressions, annulations et désactivations en bordeaux, les créations et codes en rose.
- Le journal est en **ajout seul** : ni modification ni effacement possible, même avec la clé de service. Il se purge tout seul après douze mois.

## Règles transverses

| Règle | Où elle vit |
| --- | --- |
| Le rôle admin est relu en base à chaque requête, jamais déduit d'un cookie | `lib/admin/require-admin.ts` |
| Sans session Supabase, `/admin/*` redirige vers la connexion avant tout rendu | `middleware.ts` |
| Les données admin sont protégées par RLS via `is_admin()` ; le code Next n'est pas la seule barrière | migrations 0004, 0006 |
| Tout identifiant reçu d'un formulaire est validé comme UUID avant d'atteindre la base | `lib/admin/regles.ts` |
| Toute action d'administration qui écrit ou exporte laisse une ligne dans le journal | `lib/admin/journal.ts`, migration 0013 |
| Le journal ne bloque jamais l'action qu'il décrit ; sa panne est signalée dans les logs | `lib/admin/journal.ts` |
| Les erreurs serveur remontent dans les logs Vercel en JSON ; `/api/sante` dit si la base répond | `instrumentation.ts`, `app/api/sante/route.ts` |
| Les pages admin sont `noindex` et jamais mises en cache | `app/admin/layout.tsx`, `force-dynamic` |
| L'esthétique de l'admin suit celle du site : bordures 2 px bordeaux, mono en capitales, rose pour l'admin, jaune pour le membre, aucun arrondi ni ombre douce | `CODEX_RULES.md` |

## Données personnelles

L'admin voit et exporte : prénom, nom, e-mail, téléphone, accord photo, présence. Il ne voit pas les notes médicales (migration 0007) ni les mots de passe. Base légale : exécution du contrat d'adhésion et intérêt légitime (organisation des sorties, sécurité des participants). Durée : le journal des actions est gardé douze mois ; les inscriptions et scans suivent la politique de confidentialité du site.

Points restant à traiter au backlog : second facteur pour les admins (A-07), durée des sessions admin (A-08), attribution du rôle admin depuis l'interface avec trace (A-09).
