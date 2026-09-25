# Administration NULLL.CLUB — méthode de travail

Ce dossier applique à l'espace admin du site la façon de travailler d'une agence produit (conception → développement en sprints → maintenance supervisée). Chaque document a un rôle, et l'ordre de lecture est celui de la liste.

| Document | Rôle | Quand le lire |
| --- | --- | --- |
| [01-audit.md](01-audit.md) | Audit technique et sécurité de l'admin, constats triés par criticité | Avant de toucher au code |
| [02-specifications.md](02-specifications.md) | Profils, parcours, règles fonctionnelles de l'admin | Avant d'écrire une user story |
| [03-backlog.md](03-backlog.md) | User stories, sprints, roadmap | Chaque lundi, au sprint planning |
| [04-recette.md](04-recette.md) | Checklist de recette de l'admin | Avant chaque mise en production |
| [05-exploitation.md](05-exploitation.md) | Staging, production, supervision, sauvegardes, alertes | Quand ça casse, ou avant que ça casse |

## Le cycle

**Un sprint = une semaine.** Le lundi : sprint planning (45 min), on prend dans le backlog ce qui tient dans la semaine. Le vendredi : sprint review (45 min), on montre sur la preview Vercel, on note les retours, on ferme.

**Trois niveaux de recette, dans l'ordre.**

1. Le développeur, en local, avec `pnpm lint && pnpm typecheck && pnpm test` verts.
2. Une deuxième personne, sur la preview Vercel de la PR, avec la checklist de recette.
3. Tobias ou Tom, sur la preview, avant de fusionner.

**Rien ne fusionne sans PR.** Le gabarit `.github/pull_request_template.md` impose la recette et les points de revue. Le workflow `.github/workflows/qualite.yml` bloque la fusion si lint, types ou tests échouent.

**Chaque bug remonté reçoit un niveau** avant d'être traité :

| Niveau | Définition | Délai visé |
| --- | --- | --- |
| Critique | L'admin ou le scanner est inutilisable, ou des données fuient | Correctif le jour même, hors sprint |
| Problématique | Une fonction est dégradée mais un contournement existe | Dans le sprint en cours |
| Bénin | Cosmétique, texte, confort | Backlog, priorisé au prochain planning |

## Les règles du code

`CODEX_RULES.md` à la racine reste la loi : direction artistique intouchable, modifications ciblées, pas de dépendance ajoutée sans raison. Tout ce qui est écrit ici respecte ces règles ; le sprint 1 n'ajoute aucune dépendance.

## État au 25 septembre 2026

Sprints 1 à 3 livrés d'un bloc, en attente de recette et de mise en production (voir [03-backlog.md](03-backlog.md)). Les migrations 0013, 0014 et 0015 ont été jouées sur le projet Supabase `nulll-supabase` le 25 septembre 2026 ; recette en cours sur le poste de Tobias avec le compte `recette-claude@test.nulll.club`, à retirer depuis la page Équipe une fois terminée. Sans la 0013, la page Journal affiche son message d'indisponibilité et les actions continuent sans trace ; sans la 0014, le bouton « Pointer » ne fait rien et la double vérification n'est exigée que par le code, pas par la base.
