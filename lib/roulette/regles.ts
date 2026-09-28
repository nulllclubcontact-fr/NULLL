/**
 * Roulette de l'accueil : une blague. La roue est presque entierement
 * Red Bull et Bee Zen, la case « rien » ne fait qu'un dixieme... et c'est
 * toujours elle qui sort. Puis la chute : tout est offert samedi.
 * Aucun tirage, aucun lot a suivre : rien n'est enregistre.
 */

export type Case = "redbull" | "beezen" | "rien";

/** Les cases de la roue, dans l'ordre : neuf gagnantes, une seule « rien ». */
export const CASES: Case[] = ["redbull", "beezen", "redbull", "beezen", "redbull", "beezen", "redbull", "beezen", "redbull", "rien"];

/** La case sur laquelle la roue s'arrete, toujours. */
export const CASE_ARRET = CASES.indexOf("rien");

/**
 * Rotation finale (en degres) pour que la case d'arret s'immobilise sous le
 * curseur, en haut, apres `tours` tours complets depuis `actuelle`.
 * `decalage` (entre -0.4 et 0.4) evite de tomber pile au centre de la case,
 * pour que ca ait l'air d'un vrai tirage.
 */
export function rotationFinale(actuelle: number, tours: number, decalage = 0): number {
  const angle = 360 / CASES.length;
  const borne = Math.max(-0.4, Math.min(0.4, decalage));
  const arret = 360 - (CASE_ARRET * angle + angle / 2 + borne * angle);
  return actuelle - (((actuelle % 360) + 360) % 360) + 360 * tours + arret;
}
