/**
 * Numeros de telephone : saisie libre cote membre, format E.164 cote
 * Supabase. Sans indicatif, un numero a 10 chiffres est francais.
 */
export function normaliserTelephone(saisie: string): string | null {
  let numero = saisie.replace(/[\s.\-()]/g, "");

  if (numero.startsWith("00")) {
    numero = `+${numero.slice(2)}`;
  }

  if (/^0[1-9]\d{8}$/.test(numero)) {
    numero = `+33${numero.slice(1)}`;
  }

  return /^\+[1-9]\d{7,14}$/.test(numero) ? numero : null;
}

/** « +33 •• •• 56 78 » : assez pour se reconnaitre, pas pour lire le numero par-dessus l'epaule. */
export function masquerTelephone(e164: string) {
  return `${e164.slice(0, 3)} •• •• ${e164.slice(-4, -2)} ${e164.slice(-2)}`;
}
