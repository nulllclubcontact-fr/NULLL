# Recette — espace admin

À rejouer sur la preview Vercel de la PR, avec un compte admin et un compte membre ordinaire, avant chaque mise en production qui touche `app/admin`, `lib/admin`, `middleware.ts` ou une migration. Coche dans la PR ce qui a été fait. Une étape qui échoue = PR bloquée, bug qualifié (critique, problématique, bénin) et ticket au backlog.

## Préalables

- [ ] La migration la plus récente de `supabase/migrations` est jouée sur la base de la preview (en attendant A-10, c'est la base de production : jouer la migration **avant** de fusionner, elle est conçue pour ne rien casser sur l'ancien code).
- [ ] `pnpm lint && pnpm typecheck && pnpm test` verts en local (le workflow « Qualité » l'a aussi vérifié sur la PR).
- [ ] Deux navigateurs : un connecté en admin, un en membre ordinaire (ou navigation privée).

## Accès

| # | Étape | Attendu |
| --- | --- | --- |
| R-01 | Sans être connecté, ouvrir `/admin/dashboard`, `/admin/journal`, `/admin/courses/<id>/export` | Redirection vers `/membre/login` à chaque fois, aucune page admin visible même une fraction de seconde |
| R-02 | Connecté en membre ordinaire, ouvrir `/admin/dashboard` | Redirection vers `/membre`, aucun message ne révèle que la page existe |
| R-03 | Connecté en membre ordinaire, ouvrir `/admin/courses/<id>/export` | Réponse « Accès refusé » (403), pas de fichier |
| R-04 | Connecté en admin, ouvrir `/admin` | Arrivée sur « Vue d'ensemble », sous-navigation rose avec Vue d'ensemble, Sorties, Partenaires, Journal, Scanner, Mon espace, Déconnexion |
| R-05 | Cliquer Déconnexion puis revenir en arrière dans le navigateur | Redirection vers la connexion, rien de mis en cache |

## Sorties

| # | Étape | Attendu |
| --- | --- | --- |
| R-10 | Créer une sortie avec titre + départ seulement, en brouillon | « Sortie créée. », elle apparaît en « À venir » avec l'étiquette Brouillon, absente de `/fr/runs` |
| R-11 | Créer une deuxième sortie de même titre le même jour | « Une sortie porte déjà ce nom ce jour-là. » |
| R-12 | Créer avec distance `abc`, puis `-3`, puis `101` | Message « Distance invalide : entre 0 et 100 km. » à chaque fois, rien de créé |
| R-13 | Créer avec places `2.5`, puis `0` | « Places max : un nombre entier positif. » |
| R-14 | Créer avec départ `08:30` | Sur la fiche et sur `/fr/runs`, l'heure affichée est 8 h 30 (heure de Paris), pas 10 h 30 |
| R-15 | Depuis la liste, Publier la sortie brouillon | Étiquette Publiée, elle apparaît sur `/fr/runs` sans recharger le serveur |
| R-16 | Depuis la liste, Fermer, puis Terminer | Étiquettes Fermée puis Terminée ; les boutons proposés ne permettent jamais de revenir en arrière |
| R-17 | Sur la fiche d'une sortie terminée, repasser le statut à Publiée via le formulaire complet | Accepté (c'est le chemin volontaire) |
| R-18 | Ajouter une photo JPG de moins de 10 Mo, puis la remplacer, puis la retirer | Aperçu à chaque étape ; après remplacement, l'ancienne URL renvoie 404 sur le stockage |
| R-19 | Tenter une photo de plus de 10 Mo, puis un PDF | Refus avec message clair, sortie inchangée |
| R-20 | Supprimer une sortie sans inscrit | Deux temps (résumé puis « Oui, supprimer »), disparition de la liste, photo supprimée du stockage |
| R-21 | Supprimer une sortie avec au moins un inscrit | Le résumé annonce l'annulation ; après confirmation, la sortie est Annulée, l'inscrit la voit annulée dans son historique |

## Scanner

| # | Étape | Attendu |
| --- | --- | --- |
| R-30 | Ouvrir `/admin/scanner` sur un téléphone en HTTPS | La caméra s'ouvre après autorisation ; le menu ne propose que les sorties publiées ou fermées |
| R-31 | Scanner le QR d'un membre inscrit à la sortie choisie | Écran jaune « présent », prénom affiché, compteur Scannés +1 |
| R-32 | Représenter le même QR aussitôt | Aucun second envoi pendant trois secondes ; ensuite « déjà scanné » |
| R-33 | Scanner le QR d'un membre inscrit à une **autre** sortie | Refus « mauvaise sortie », le scan apparaît dans les traces de la sortie |
| R-34 | Scanner un QR quelconque (billet de train, URL) | « QR invalide », rien de modifié |
| R-35 | Deux admins scannent en même temps la même sortie | Les compteurs des deux écrans se rejoignent après chaque scan |
| R-36 | Couper le réseau puis scanner | Message « Scan impossible. Réessaie. » (comportement connu, A-16 au backlog) |

## Export

| # | Étape | Attendu |
| --- | --- | --- |
| R-40 | Export CSV d'une sortie avec inscrits | Fichier `slug-inscrits.csv`, ouvre proprement dans Excel FR : colonnes séparées, accents corrects |
| R-41 | Un membre dont le prénom commence par `=` ou `@` | La cellule affiche le texte, précédé d'une apostrophe, aucune formule évaluée |
| R-42 | Ouvrir `/admin/courses/pas-un-uuid/export` en admin | 404 « Sortie introuvable », aucune erreur dans les logs Vercel |

## Partenaires

| # | Étape | Attendu |
| --- | --- | --- |
| R-50 | Créer un partenaire | Code `PRO-…` affiché une seule fois ; il n'apparaît plus après rechargement |
| R-51 | Se connecter sur `/pro/login` avec ce code, puis générer un nouveau code depuis l'admin | L'ancien code est refusé à la connexion suivante, le nouveau fonctionne |
| R-52 | Désactiver le partenaire | Il ne peut plus se connecter ; ses ventes restent visibles dans l'admin |
| R-53 | Supprimer un partenaire qui a des ventes | Refus expliqué, proposition de désactiver |
| R-54 | Supprimer un partenaire sans vente | Disparition, retour à la liste |

## Journal

| # | Étape | Attendu |
| --- | --- | --- |
| R-60 | Après R-10 à R-54, ouvrir `/admin/journal` | Une ligne par action faite : création, statut (de → vers), photo, annulation, suppression, export (avec nombre de lignes, en jaune), partenaire créé, code, désactivation, suppression ; prénom de l'admin ; lien vers la sortie ou le partenaire quand il existe encore |
| R-61 | Le scan (R-31) | N'apparaît **pas** au journal : il est tracé dans `checkins`, visible sur la fiche |
| R-62 | Dans la console Supabase, tenter `update` puis `delete` sur une ligne de `journal_admin` | Refus « journal_admin : ajout seul » dans les deux cas |
| R-63 | Mettre la base en pause (ou couper la clé de service sur la preview) et ouvrir le journal | Bandeau jaune « Impossible de lire le journal », pas de liste vide rassurante |

## Supervision

| # | Étape | Attendu |
| --- | --- | --- |
| R-70 | `curl -i https://<preview>/api/sante` | `200`, corps `{"ok":true,"base":"ok","latence_ms":…}`, en-tête `Cache-Control: no-store` |
| R-71 | Même appel avec la base en pause | `503`, `{"ok":false,"base":"erreur",…}` |
| R-72 | Provoquer une erreur serveur (par exemple base en pause puis ouvrir le tableau de bord) | Page d'erreur du site ; dans les logs Vercel, une ligne JSON `{"niveau":"erreur","source":"next",…}` avec `chemin` et `digest` |
| R-73 | Ouvrir `/api/visite` après avoir appelé `/api/sante` depuis un outil de sonde | Aucune visite comptée pour la sonde |

## Sprint 2 : comptes admin, pointage, création

| # | Étape | Attendu |
| --- | --- | --- |
| R-90 | Créer une sortie (R-10) | Arrivée directe sur sa fiche, bandeau rose « Sortie créée en brouillon » ; la fiche est bien celle de la nouvelle sortie |
| R-91 | Sur une fiche publiée, cliquer « Pointer » sur un inscrit non pointé | La ligne passe en « Présent » avec l'heure ; sur la fiche, les chiffres Présents et À pointer bougent ; dans `checkins`, une ligne `success` avec la note `manuel` |
| R-92 | « Pointer » n'apparaît pas | Sur un inscrit déjà présent, une inscription annulée, une sortie brouillon ou annulée |
| R-93 | Ouvrir `/admin/securite`, « Activer la double vérification », scanner le QR avec une application, entrer le code | « Double vérification activée », la tuile passe à « Active, passée », une ligne « Double vérification activée » au journal |
| R-94 | Se déconnecter, se reconnecter par mot de passe | Après la connexion, arrivée sur `/admin/verification` ; un mauvais code est refusé ; le bon code ouvre le tableau de bord |
| R-95 | En aal1 (avant de saisir le code), ouvrir `/admin/courses/<id>/export` ou soumettre une action | Refusé (redirection ou « Accès refusé ») ; dans Supabase, `select public.is_admin()` avec ce JWT renvoie `false` |
| R-96 | Simuler une session de plus de douze heures (dans Supabase, reculer `last_sign_in_at` de l'utilisateur de 13 h) puis ouvrir `/admin` | Redirection vers la connexion avec le message « Ta session d'administration a expiré » ; l'espace membre demandait, lui, une reconnexion aussi (signOut) |
| R-97 | `/admin/equipe`, ajouter un admin par un e-mail inconnu, puis par l'e-mail d'un membre | Refus expliqué, puis « … est admin » ; le membre voit l'onglet Administration à sa prochaine connexion ; ligne « Admin ajouté » au journal |
| R-98 | Retirer l'accès à soi-même ; retirer le dernier admin | Deux refus expliqués |
| R-99 | Retirer l'accès à un autre admin | Il repasse membre, ligne « Admin retiré » au journal, son compte et ses inscriptions restent |
| R-100 | « Téléphone perdu » sur un admin qui a la double vérification | Il peut se reconnecter par mot de passe seul, ligne « Double vérification retirée » au journal avec l'admin qui l'a fait |

## Tableau de bord Sécurité (migration 0015)

| # | Étape | Attendu |
| --- | --- | --- |
| R-101 | Ouvrir `/admin/securite` | Quatre tuiles : ton compte (1 ou 2 clés), admins protégés (x/y avec jauge), sessions admin sur 7 jours, tentatives freinées ; puis les panneaux Ton compte, Déploiement, Base de données, En-têtes du site, L'équipe, Sessions admin, Journal de sécurité |
| R-102 | Panneau Base de données | Tables avec RLS = tables (pastille bordeaux), aucune fonction privilégiée sans `search_path`, nombre de membres et de lignes de journal cohérents avec Supabase |
| R-103 | Panneau En-têtes du site sur la preview Vercel | 7/7 présents, HSTS compris ; en local, 6/7 avec HSTS marqué « en local, sans HTTPS » |
| R-104 | Panneau Sessions admin | Une ligne par session récente : prénom, navigateur et système, IP tronquée, niveau (Code passé, Sans le code, Mot de passe), dernière activité ; une session « Sans le code » d'un admin protégé passe la tuile en jaune |
| R-105 | Panneau Journal de sécurité | Seulement les lignes comptes, exports et codes partenaires ; exports, retraits et suppressions avec pastille jaune ; lien vers le journal complet |
| R-106 | Sans clé de service (la retirer en local) | Les tuiles affichent « … » et « base indisponible », le panneau Base affiche son alerte, la page ne casse pas |

## Sprint 3 : CSP, duplication, hors ligne

| # | Étape | Attendu |
| --- | --- | --- |
| R-110 | `curl -I https://<preview>/` | Un en-tête `Content-Security-Policy-Report-Only` ; la page fonctionne exactement comme avant (rien n'est bloqué) |
| R-111 | Parcourir accueil, connexion Google, espace membre, admin avec la console du navigateur ouverte | Les violations CSP éventuelles apparaissent dans la console **et** dans les logs Vercel (`"source":"csp"`) ; noter chaque origine légitime manquante dans le backlog A-12 |
| R-112 | « Dupliquer (+7 jours) » sur une fiche | Nouvelle fiche, même titre, lieu, distance, places, date +7 jours même heure, brouillon, sans photo, bandeau « Sortie créée en brouillon » ; ligne « Sortie créée · dupliquée » au journal |
| R-113 | Dupliquer deux fois la même sortie | Le second essai revient sur la fiche d'origine avec « Une sortie porte déjà ce nom une semaine plus tard » |
| R-114 | Scanner : couper le réseau (mode avion), scanner un QR valide | Bandeau jaune « 1 scan en attente de réseau », statut « Hors ligne : scan gardé » |
| R-115 | Rétablir le réseau | Le scan part seul dans les quinze secondes (ou au clic « Renvoyer maintenant ») ; résultat affiché « Renvoyé : … », compteurs à jour, bandeau disparu ; l'heure de pointage est celle du renvoi |
| R-116 | Recharger la page scanner avec des scans en attente | Le bandeau réapparaît avec le bon nombre ; rien n'est perdu |
| R-117 | Compteur de visites : un compte listé dans `VISITES_EQUIPE` parcourt le site | Aucune visite comptée pour lui |

## Responsive et accessibilité

| # | Étape | Attendu |
| --- | --- | --- |
| R-80 | Toutes les pages admin à 375 px de large | Aucun débordement horizontal ; les tableaux défilent dans leur cadre ; boutons d'au moins 44 px de haut |
| R-81 | Navigation au clavier sur la liste des sorties et le journal | Focus visible (bordure bordeaux), ordre logique, `details` s'ouvrent à Entrée |
| R-82 | Lecteur d'écran sur le scanner | Les compteurs et le résultat sont annoncés (`aria-live`) |
