# CODEX_RULES.md

## Objectif

Intervenir sur le projet NULLL.CLUB de manière précise, minimale et contrôlée.

## Règles générales

1. Ne pas modifier la direction artistique existante.
2. Ne pas refaire le design, la structure visuelle ou l’identité du site sans demande explicite.
3. Prioriser les corrections techniques, fonctionnelles, SEO, UX et responsive.
4. Modifier uniquement les fichiers strictement nécessaires.
5. Ne pas créer de nouveaux fichiers sauf si cela est indispensable.
6. Ne pas renommer, déplacer ou supprimer des fichiers sans nécessité.
7. Ne pas modifier les dépendances, la configuration globale ou l’architecture du projet sans demande explicite.
8. Ne pas lancer de refactorisation large.
9. Conserver les conventions, composants, styles et patterns déjà présents dans le projet.
10. Préserver le comportement existant lorsqu’il n’est pas concerné par la demande.

## Utilisation des tokens

1. Lire uniquement les fichiers nécessaires à la tâche.
2. Commencer par rechercher les fichiers, composants, routes ou chaînes de texte concernés.
3. Ne pas analyser l’intégralité du projet sauf demande explicite.
4. Ne pas afficher de longs extraits de code inutiles.
5. Ne pas répéter le contenu déjà connu.
6. Donner des réponses courtes et opérationnelles.
7. Résumer les modifications en quelques lignes maximum.
8. Éviter les explications théoriques sauf si elles sont nécessaires.
9. Ne pas générer de documentation supplémentaire sans demande.
10. Ne pas lancer plusieurs analyses similaires.

## Avant toute modification

1. Identifier précisément la cause du problème.
2. Lister les fichiers réellement concernés.
3. Vérifier si la correction peut être faite dans un seul fichier.
4. Ne demander une confirmation que si :
   - plusieurs solutions changent significativement le résultat ;
   - une modification peut casser le design ou le comportement ;
   - une information indispensable manque ;
   - une action destructive est nécessaire.

Dans les autres cas, appliquer directement la correction la plus sûre.

## Pendant les modifications

1. Faire des changements ciblés.
2. Respecter la mise en forme et les conventions du fichier.
3. Ne pas réécrire un fichier complet pour une petite correction.
4. Ne pas ajouter de commentaires inutiles dans le code.
5. Ne pas dupliquer du code existant.
6. Réutiliser les composants et utilitaires déjà présents.
7. Préserver les animations, typographies, couleurs, espacements et effets existants.
8. Maintenir l’accessibilité, les performances et le responsive.
9. Ne pas introduire de contenu générique ou artificiel.
10. Ne pas ajouter de librairie si une solution native ou déjà installée existe.

## Direction artistique

La direction artistique actuelle est validée.

Codex doit :

- conserver l’esthétique brutaliste et avant-gardiste ;
- conserver les couleurs principales noir et blanc et rose ;
- conserver les choix typographiques existants ;
- conserver la composition, le rythme visuel et l’aspect volontairement décalé ;
- corriger uniquement les incohérences, bugs ou problèmes explicitement demandés.

Codex ne doit pas :

- rendre le site plus corporate ;
- appliquer un design SaaS générique ;
- ajouter des gradients, ombres, arrondis ou effets non présents ;
- remplacer la direction artistique par des composants standards ;
- uniformiser ce qui est volontairement irrégulier ;
- modifier le logo ou l’identité visuelle.

## SEO

Pour les tâches SEO :

1. Préserver le design.
2. Modifier en priorité :
   - les titres et métadonnées ;
   - la structure sémantique HTML ;
   - les textes stratégiques ;
   - les données structurées ;
   - le maillage interne ;
   - les attributs alt ;
   - les performances ;
   - l’indexabilité ;
   - le sitemap et le fichier robots ;
   - les balises canonical ;
   - les métadonnées Open Graph.
3. Ne pas surcharger les pages de mots-clés.
4. Écrire pour les utilisateurs avant les moteurs de recherche.
5. Cibler naturellement les recherches liées au running, aux run clubs, à Aix-en-Provence et à la communauté locale.
6. Ne pas inventer d’adresse, d’événement, de partenariat, de chiffre ou de témoignage.

## UX et responsive

1. Corriger les problèmes sans changer l’identité.
2. Prioriser :
   - la lisibilité ;
   - la navigation ;
   - la hiérarchie ;
   - l’affichage mobile ;
   - l’accessibilité ;
   - la rapidité ;
   - la clarté des appels à l’action.
3. Ne pas supprimer un choix graphique volontaire uniquement parce qu’il est inhabituel.
4. Faire la différence entre un parti pris artistique et un véritable problème d’usage.

## Vérifications

Après modification :

1. Vérifier que le projet compile.
2. Vérifier les erreurs TypeScript, ESLint ou équivalent si les scripts existent.
3. Vérifier les pages ou composants modifiés.
4. Ne pas lancer de tests ou commandes lourdes sans nécessité.
5. Ne pas modifier d’autres fichiers uniquement pour faire disparaître des avertissements sans rapport avec la demande.

## Format des réponses

Répondre avec ce format :

### Modifié

- fichier : changement effectué

### Vérifié

- commande ou vérification effectuée

### À savoir

- uniquement si une information importante reste à signaler

Réponse maximale recommandée : 8 lignes, sauf demande contraire.
