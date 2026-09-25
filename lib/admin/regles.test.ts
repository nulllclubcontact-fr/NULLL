// Regles pures de l'administration : node --test (types retires par Node).
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bornerNombres,
  codeTotpValide,
  departSemaineSuivante,
  identifiantValide,
  sessionAdminExpiree,
  slugDeSortie,
  slugifier,
  statutValide,
  transitionRapidePermise
} from "./regles.ts";

test("session admin : douze heures, pas une de plus", () => {
  const connexion = "2026-09-26T06:00:00.000Z";
  const t = Date.parse(connexion);
  assert.equal(sessionAdminExpiree(connexion, t + 11 * 3600 * 1000), false);
  assert.equal(sessionAdminExpiree(connexion, t + 13 * 3600 * 1000), true);
  assert.equal(sessionAdminExpiree(null, t), true);
  assert.equal(sessionAdminExpiree("pas une date", t), true);
});

test("duplication : une semaine plus tard, même instant", () => {
  assert.equal(departSemaineSuivante("2026-10-03T06:30:00.000Z").toISOString(), "2026-10-10T06:30:00.000Z");
});

test("code TOTP : six chiffres, espaces tolérés", () => {
  assert.equal(codeTotpValide("123456"), true);
  assert.equal(codeTotpValide("123 456"), true);
  assert.equal(codeTotpValide("12345"), false);
  assert.equal(codeTotpValide("abcdef"), false);
});

test("identifiant : seul un UUID passe", () => {
  assert.equal(identifiantValide("a2fb2c57-05de-4f34-8e16-7848afb79cf3"), true);
  assert.equal(identifiantValide("A2FB2C57-05DE-4F34-8E16-7848AFB79CF3"), true);
  assert.equal(identifiantValide("../admin"), false);
  assert.equal(identifiantValide("1 or 1=1"), false);
  assert.equal(identifiantValide(""), false);
  assert.equal(identifiantValide(undefined), false);
});

test("statut : un inconnu retombe sur brouillon, jamais sur publiée", () => {
  assert.equal(statutValide("published"), "published");
  assert.equal(statutValide("cancelled"), "cancelled");
  assert.equal(statutValide("PUBLISHED"), "draft");
  assert.equal(statutValide("admin"), "draft");
  assert.equal(statutValide(""), "draft");
});

test("slug : accents, espaces et ponctuation disparaissent", () => {
  assert.equal(slugifier("Sortie du samedi : Sainte-Victoire !"), "sortie-du-samedi-sainte-victoire");
  assert.equal(slugifier("   "), "");
  assert.equal(slugifier("É".repeat(80)).length, 60);
});

test("slug de sortie : suffixé par la date, jamais vide", () => {
  const depart = new Date("2026-10-03T06:30:00.000Z");
  assert.equal(slugDeSortie("Run du samedi", depart), "run-du-samedi-2026-10-03");
  assert.equal(slugDeSortie("!!!", depart), "sortie-2026-10-03");
});

test("nombres : distance et places bornées", () => {
  assert.deepEqual(bornerNombres("5", "40"), { distance: 5, max: 40 });
  assert.deepEqual(bornerNombres("7,5", ""), { distance: 7.5, max: null });
  assert.deepEqual(bornerNombres("", ""), { distance: null, max: null });
  assert.ok("error" in bornerNombres("abc", ""));
  assert.ok("error" in bornerNombres("-3", ""));
  assert.ok("error" in bornerNombres("101", ""));
  assert.ok("error" in bornerNombres("", "0"));
  assert.ok("error" in bornerNombres("", "2.5"));
  assert.ok("error" in bornerNombres("", "10001"));
});

test("transitions rapides : on avance, on ne recule pas", () => {
  assert.equal(transitionRapidePermise("draft", "published"), true);
  assert.equal(transitionRapidePermise("published", "closed"), true);
  assert.equal(transitionRapidePermise("published", "completed"), true);
  assert.equal(transitionRapidePermise("closed", "completed"), true);
  assert.equal(transitionRapidePermise("completed", "published"), false);
  assert.equal(transitionRapidePermise("cancelled", "published"), false);
  assert.equal(transitionRapidePermise("draft", "completed"), false);
});
