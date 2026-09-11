/**
 * Echappement CSV : guillemets doubles, et champ entoure des que necessaire.
 * Un prenom saisi par un membre qui commence par = + - @ serait execute
 * comme une formule par le tableur : une apostrophe le neutralise.
 */
export function champ(valeur: string | null | undefined) {
  const brut = valeur ?? "";
  const texte = /^[=+\-@\t\r]/.test(brut) ? `'${brut}` : brut;
  return /[";\r\n]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte;
}
