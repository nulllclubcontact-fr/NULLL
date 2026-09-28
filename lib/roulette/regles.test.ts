import assert from "node:assert/strict";
import { test } from "node:test";
import { appliquerPlafond, CASES, caseCible, CHANCES, codeValide, formerCode, lotPourTirage, normaliserCode } from "./regles.ts";

test("le tirage respecte les chances annoncees", () => {
  const compte = { redbull: 0, beezen: 0, rien: 0 };
  for (let tirage = 0; tirage < 100; tirage++) compte[lotPourTirage(tirage)]++;
  assert.equal(compte.redbull, CHANCES.redbull);
  assert.equal(compte.beezen, CHANCES.beezen);
  assert.equal(compte.rien, 100 - CHANCES.redbull - CHANCES.beezen);
});

test("un tirage hors bornes ne fait rien gagner", () => {
  assert.equal(lotPourTirage(-1), "rien");
  assert.equal(lotPourTirage(100), "rien");
  assert.equal(lotPourTirage(2.5), "rien");
});

test("la roue montre les vraies probabilites", () => {
  assert.equal(CASES.length, 10);
  assert.equal(CASES.filter((c) => c === "redbull").length * 10, CHANCES.redbull);
  assert.equal(CASES.filter((c) => c === "beezen").length * 10, CHANCES.beezen);
});

test("le plafond hebdomadaire transforme un gain en rien", () => {
  assert.equal(appliquerPlafond("redbull", 0), "redbull");
  assert.equal(appliquerPlafond("redbull", 5), "rien");
  assert.equal(appliquerPlafond("rien", 0), "rien");
});

test("le code est lisible et reconnu", () => {
  const code = formerCode("beezen", new Uint8Array([0, 1, 2, 3, 255]));
  assert.match(code, /^NULLL-BZ-/);
  assert.ok(codeValide(code));
  assert.ok(!/[01ILO]/.test(code.slice(9)));
  assert.equal(normaliserCode("  nulll-bz-23456 "), "NULLL-BZ-23456");
  assert.ok(!codeValide("NULLL-XX-23456"));
});

test("la roue s'arrete sur une case du bon lot", () => {
  for (const lot of ["redbull", "beezen", "rien"] as const) {
    for (const hasard of [0, 0.5, 0.9999]) assert.equal(CASES[caseCible(lot, hasard)], lot);
  }
});
