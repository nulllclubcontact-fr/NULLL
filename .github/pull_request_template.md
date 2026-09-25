## Quoi

<!-- Une phrase : ce que change cette PR, du point de vue de l'admin ou du membre. -->

## Pourquoi

<!-- Le ticket du backlog (docs/admin/03-backlog.md) ou le bug remonté, avec son niveau : critique, problématique, bénin. -->

## Recette

<!-- Comment on a vérifié. Coche ce qui a été fait. -->

- [ ] Vérifié en local par le développeur
- [ ] Vérifié sur la preview Vercel par une deuxième personne
- [ ] Étapes de `docs/admin/04-recette.md` concernées rejouées
- [ ] Migration SQL jouée sur le projet de staging avant la prod (si migration)

## Revue

<!-- Points d'attention pour le relecteur : sécurité, données personnelles, RLS, direction artistique (CODEX_RULES.md). -->

- [ ] Aucune donnée personnelle ni secret dans les logs, les URL ou le code
- [ ] Toute nouvelle écriture admin passe par `isAdminUser` / `requireAdminUser` et laisse une trace dans le journal
- [ ] Toute nouvelle table a sa RLS et ses `revoke` (voir migrations 0006, 0012, 0013)
- [ ] La direction artistique n'est pas touchée sans demande explicite
