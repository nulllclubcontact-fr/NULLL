import assert from "node:assert/strict";
import { test } from "node:test";
import { CASE_ARRET, CASES, rotationFinale } from "./regles.ts";

test("la roue est surtout gagnante, avec une seule case rien", () => {
  assert.equal(CASES.length, 10);
  assert.equal(CASES.filter((c) => c === "rien").length, 1);
  assert.equal(CASES[CASE_ARRET], "rien");
});

/** Case sous le curseur (en haut) pour une rotation donnee. */
function caseSousLeCurseur(rotation: number) {
  const angle = 360 / CASES.length;
  const position = (((360 - rotation) % 360) + 360) % 360;
  return Math.floor(position / angle);
}

test("la roue s'arrete toujours sur rien, quelle que soit la position de depart", () => {
  for (const depart of [0, 37, 359, 1234, -90]) {
    for (const decalage of [-0.4, 0, 0.4]) {
      const fin = rotationFinale(depart, 6, decalage);
      assert.equal(CASES[caseSousLeCurseur(fin)], "rien");
      assert.ok(fin - depart >= 360 * 5, "au moins cinq tours");
    }
  }
});
