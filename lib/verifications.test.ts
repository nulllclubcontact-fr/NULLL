// Tests des regles pures du site : node --test (types retires par Node).
import assert from "node:assert/strict";
import { test } from "node:test";
import { champ } from "./csv.ts";
import { heureDeParis } from "./heure-paris.ts";
import { adresseEmailValide, lireLienEmail, sortieDepuisRetour } from "./auth/confirmation.ts";
import { destinationMembre, sortieValide, suiteSortie } from "./races/sortie-choisie.ts";

test("heure de Paris en été : 8h30 = 6h30 UTC", () => {
  assert.equal(heureDeParis("2026-09-26T08:30")?.toISOString(), "2026-09-26T06:30:00.000Z");
});

test("heure de Paris en hiver : 8h30 = 7h30 UTC", () => {
  assert.equal(heureDeParis("2026-12-05T08:30")?.toISOString(), "2026-12-05T07:30:00.000Z");
});

test("heure de Paris : format refusé", () => {
  assert.equal(heureDeParis("26/09/2026 08:30"), null);
  assert.equal(heureDeParis(""), null);
});

test("CSV : une formule de tableur est neutralisée", () => {
  assert.equal(champ("=1+1"), "'=1+1");
  assert.equal(champ("@SOMME(A1)"), "'@SOMME(A1)");
  assert.equal(champ("-3"), "'-3");
});

test("CSV : séparateurs, guillemets et retours à la ligne entourés", () => {
  assert.equal(champ("Dupont; Jean"), '"Dupont; Jean"');
  assert.equal(champ('Le "boss"'), '"Le ""boss"""');
  assert.equal(champ("ligne\rcoupée"), '"ligne\rcoupée"');
  assert.equal(champ(null), "");
  assert.equal(champ("Alice"), "Alice");
});

test("sortie choisie : seul un identifiant valable passe", () => {
  const id = "a2fb2c57-05de-4f34-8e16-7848afb79cf3";
  assert.equal(sortieValide(id), true);
  assert.equal(sortieValide("../admin"), false);
  assert.equal(sortieValide(undefined), false);
  assert.equal(suiteSortie(id), `?sortie=${id}`);
  assert.equal(suiteSortie("https://site.tld"), "");
  assert.equal(destinationMembre("x"), "/membre");
  assert.equal(destinationMembre(id), `/membre?sortie=${id}`);
});

test("lien e-mail : fragment complet lu, sortie retrouvée dans l'adresse de retour", () => {
  const id = "a2fb2c57-05de-4f34-8e16-7848afb79cf3";
  const retour = `https://nulll.club/auth/callback?next=%2Fmembre%3Fsortie%3D${id}`;
  assert.deepEqual(lireLienEmail(`#token_hash=pkce_0123456789abcdef0123&type=email&next=${retour}`), {
    tokenHash: "pkce_0123456789abcdef0123",
    type: "email",
    sortie: id
  });
  assert.equal(sortieDepuisRetour(`https://nulll.club/auth/callback?next=/membre?sortie=${id}`), id);
  assert.equal(lireLienEmail("#token_hash=0123456789abcdef0123&type=recovery")?.sortie, null);
});

test("lien e-mail : jeton court ou altéré, type inconnu ou lien vide refusés", () => {
  assert.equal(lireLienEmail("#token_hash=abc&type=email"), null);
  assert.equal(lireLienEmail("#token_hash=0123456789abcdef<script>&type=email"), null);
  assert.equal(lireLienEmail("#token_hash=0123456789abcdef0123&type=magiclink"), null);
  assert.equal(lireLienEmail("#type=email"), null);
  assert.equal(lireLienEmail(""), null);
});

test("lien e-mail : aucune destination venue du lien n'est suivie", () => {
  const lien = lireLienEmail("#token_hash=0123456789abcdef0123&type=email&next=https://site-tiers.tld/?sortie=../admin");
  assert.equal(lien?.sortie, null);
  assert.equal(destinationMembre(lien?.sortie), "/membre");
});

test("adresse e-mail : format minimal", () => {
  assert.equal(adresseEmailValide("prenom@exemple.fr"), true);
  assert.equal(adresseEmailValide("prenom@exemple"), false);
  assert.equal(adresseEmailValide("pre nom@exemple.fr"), false);
  assert.equal(adresseEmailValide(`${"a".repeat(250)}@exemple.fr`), false);
});
