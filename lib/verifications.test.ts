// Tests des regles pures du site : node --test (types retires par Node).
import assert from "node:assert/strict";
import { test } from "node:test";
import { champ } from "./csv.ts";
import { heureDeParis } from "./heure-paris.ts";
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
