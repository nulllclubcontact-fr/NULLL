import "server-only";

/**
 * Gabarit commun a tous les e-mails du club.
 *
 * Trois contraintes propres a l'e-mail expliquent la forme du code, qui
 * jurerait ailleurs :
 *
 * 1. Mise en page en tableaux. Outlook rend le HTML avec le moteur de Word,
 *    qui ignore flexbox et grid. Un tableau reste la seule structure sur
 *    laquelle tous les clients s'accordent.
 * 2. Styles en ligne. Gmail retire une partie des feuilles de style, y
 *    compris celles placees dans le head.
 * 3. Polices systeme. Anton et Caveat ne se chargent pas dans un e-mail :
 *    la plupart des clients bloquent les polices distantes. On garde donc
 *    la graisse et les capitales, qui portent deja l'identite, avec une
 *    pile de polices disponibles partout.
 */

const CREME = "#F1EDE9";
const BRUN = "#773331";
const SOMBRE = "#3A1A18";
const JAUNE = "#FFB200";
const ROSE = "#EBA0CD";

const TITRE = "Arial Black, Arial Bold, Gadget, sans-serif";
const TEXTE = "Arial, Helvetica, sans-serif";

export function echapper(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Bouton = { libelle: string; href: string };

export function rendreEmail({
  preheader,
  titre,
  intro,
  corps,
  bouton,
  pied
}: {
  /** Ligne grise affichee par le client a cote de l'objet. */
  preheader: string;
  titre: string;
  intro?: string;
  /** Blocs de texte deja echappes par l'appelant si besoin. */
  corps?: string;
  bouton?: Bouton;
  pied?: string;
}) {
  const blocBouton = bouton
    ? `<tr><td style="padding:8px 32px 32px">
         <table border="0" cellpadding="0" cellspacing="0" role="presentation"><tr>
           <td style="background:${JAUNE};border:2px solid ${BRUN}">
             <a href="${bouton.href}" style="display:inline-block;padding:16px 32px;font-family:${TITRE};font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:${BRUN};text-decoration:none">${echapper(bouton.libelle)}</a>
           </td>
         </tr></table>
       </td></tr>`
    : "";

  const blocIntro = intro
    ? `<tr><td style="padding:0 32px 20px;font-family:${TEXTE};font-size:16px;line-height:1.6;color:${BRUN}">${intro}</td></tr>`
    : "";

  const blocCorps = corps ? `<tr><td style="padding:0 32px 24px">${corps}</td></tr>` : "";

  const blocPied = pied
    ? `<tr><td style="padding:0 32px 28px;font-family:${TEXTE};font-size:13px;line-height:1.6;color:${BRUN};opacity:.75">${pied}</td></tr>`
    : "";

  return `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>NULLL.CLUB</title>
</head>
<body style="margin:0;padding:0;background:${SOMBRE}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${echapper(preheader)}</div>
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="background:${SOMBRE}">
<tr><td align="center" style="padding:32px 16px">

  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:600px;background:${CREME};border:2px solid ${BRUN}">

    <tr><td style="background:${BRUN};padding:20px 32px">
      <span style="font-family:${TITRE};font-size:20px;letter-spacing:1px;color:${CREME}">NULLL.CLUB</span>
      <span style="font-family:${TEXTE};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${ROSE};padding-left:12px">Aix-en-Provence</span>
    </td></tr>

    <tr><td style="padding:32px 32px 16px">
      <h1 style="margin:0;font-family:${TITRE};font-size:30px;line-height:1.15;text-transform:uppercase;color:${BRUN}">${echapper(titre)}</h1>
    </td></tr>

    ${blocIntro}
    ${blocCorps}
    ${blocBouton}
    ${blocPied}

    <tr><td style="background:${BRUN};padding:18px 32px;font-family:${TEXTE};font-size:12px;line-height:1.7;color:${CREME}">
      Tous les samedis, 8h30, parking du chemin de la Cible, près du lycée Émile Zola.<br>
      <a href="https://nulll.club" style="color:${JAUNE};text-decoration:none">nulll.club</a>
    </td></tr>

  </table>

</td></tr></table>
</body></html>`;
}

/** Bloc de citation pour reproduire un message recu. */
export function blocCitation(texte: string) {
  return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="background:${CREME};border-left:4px solid ${ROSE}">
    <tr><td style="padding:14px 18px;font-family:${TEXTE};font-size:15px;line-height:1.65;color:${BRUN};white-space:pre-wrap">${echapper(texte)}</td></tr>
  </table>`;
}
