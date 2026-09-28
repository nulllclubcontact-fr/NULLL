import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { crc32, creerZip } from "../zip.ts";
import { cheminDeLaSortie, cheminPhoto, inscriptionDonneAcces, nomTelechargement } from "./regles.ts";

const COURSE = "3f1c2a9e-1111-4222-8333-444455556666";

test("seuls les inscrits presents ou attendus voient les photos", () => {
  assert.ok(inscriptionDonneAcces("registered"));
  assert.ok(inscriptionDonneAcces("checked_in"));
  assert.ok(!inscriptionDonneAcces("cancelled"));
  assert.ok(!inscriptionDonneAcces("no_show"));
  assert.ok(!inscriptionDonneAcces(null));
});

test("un chemin reste dans le dossier de sa sortie", () => {
  const chemin = cheminPhoto(COURSE, "abc", "jpg");
  assert.ok(cheminDeLaSortie(chemin, COURSE));
  assert.ok(!cheminDeLaSortie(`${COURSE}/../autre/x.jpg`, COURSE));
  assert.ok(!cheminDeLaSortie("autre-course/x.jpg", COURSE));
  assert.ok(!cheminDeLaSortie(`${COURSE}/sous/x.jpg`, COURSE));
});

test("les fichiers telecharges ont un nom lisible", () => {
  assert.equal(nomTelechargement("2026-10-03T06:30:00Z", 6, `${COURSE}/x.JPG`), "nulll-club-2026-10-03-07.jpg");
});

test("crc32 connu", () => {
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
});

test("le zip s'ouvre avec unzip et rend les memes octets", () => {
  const dossier = mkdtempSync(join(tmpdir(), "nulll-zip-"));
  const a = new TextEncoder().encode("photo A");
  const b = new Uint8Array([0, 1, 2, 255, 254]);
  writeFileSync(join(dossier, "t.zip"), creerZip([{ nom: "a.jpg", donnees: a }, { nom: "nulll-club-02.jpg", donnees: b }]));
  execFileSync("unzip", ["-q", "t.zip", "-d", "out"], { cwd: dossier });
  assert.deepEqual(new Uint8Array(readFileSync(join(dossier, "out", "a.jpg"))), a);
  assert.deepEqual(new Uint8Array(readFileSync(join(dossier, "out", "nulll-club-02.jpg"))), b);
});
