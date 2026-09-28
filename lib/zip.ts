/**
 * Archive zip minimale, sans compression (« stored ») : les photos sont
 * deja compressees, les recompresser ne gagnerait rien. Sert a « tout
 * telecharger » dans le navigateur, sans bibliotheque ajoutee.
 */

const TABLE_CRC = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(donnees: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < donnees.length; i++) crc = TABLE_CRC[(crc ^ donnees[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export type FichierZip = { nom: string; donnees: Uint8Array };

export function creerZip(fichiers: FichierZip[]): Uint8Array {
  const encodeur = new TextEncoder();
  const locaux: Uint8Array[] = [];
  const centraux: Uint8Array[] = [];
  let decalage = 0;

  for (const fichier of fichiers) {
    const nom = encodeur.encode(fichier.nom);
    const crc = crc32(fichier.donnees);
    const taille = fichier.donnees.length;

    const local = new Uint8Array(30 + nom.length);
    const vl = new DataView(local.buffer);
    vl.setUint32(0, 0x04034b50, true);
    vl.setUint16(4, 20, true);
    vl.setUint16(6, 0x0800, true); // noms en UTF-8
    vl.setUint16(8, 0, true); // stored
    vl.setUint32(14, crc, true);
    vl.setUint32(18, taille, true);
    vl.setUint32(22, taille, true);
    vl.setUint16(26, nom.length, true);
    local.set(nom, 30);

    const central = new Uint8Array(46 + nom.length);
    const vc = new DataView(central.buffer);
    vc.setUint32(0, 0x02014b50, true);
    vc.setUint16(4, 20, true);
    vc.setUint16(6, 20, true);
    vc.setUint16(8, 0x0800, true);
    vc.setUint16(10, 0, true);
    vc.setUint32(16, crc, true);
    vc.setUint32(20, taille, true);
    vc.setUint32(24, taille, true);
    vc.setUint16(28, nom.length, true);
    vc.setUint32(42, decalage, true);
    central.set(nom, 46);

    locaux.push(local, fichier.donnees);
    centraux.push(central);
    decalage += local.length + taille;
  }

  const tailleCentrale = centraux.reduce((s, c) => s + c.length, 0);
  const fin = new Uint8Array(22);
  const vf = new DataView(fin.buffer);
  vf.setUint32(0, 0x06054b50, true);
  vf.setUint16(8, fichiers.length, true);
  vf.setUint16(10, fichiers.length, true);
  vf.setUint32(12, tailleCentrale, true);
  vf.setUint32(16, decalage, true);

  const morceaux = [...locaux, ...centraux, fin];
  const sortie = new Uint8Array(morceaux.reduce((s, m) => s + m.length, 0));
  let position = 0;
  for (const morceau of morceaux) {
    sortie.set(morceau, position);
    position += morceau.length;
  }
  return sortie;
}
