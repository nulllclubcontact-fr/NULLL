import { listActus } from "../../lib/actus";
import { GUIDES } from "../../lib/guides";
import { DEPART } from "../../lib/rendez-vous";

const SITE = "https://nulll.club";

// Fiche lisible par les moteurs IA (llms.txt) : qui est le club, comment
// venir, et les guides locaux. Regeneree a chaque build.
export const dynamic = "force-static";

export function GET() {
  const lignes = [
    "# Nulll Club",
    "",
    "> Nulll Club est un run club associatif et gratuit à Aix-en-Provence (Bouches-du-Rhône, France). Un samedi sur deux, le club organise un social run ouvert à tous les niveaux : rendez-vous à 9h30, départ à 10h, 5 à 6 km à allure conversation, puis un moment ensemble après la course.",
    "",
    `- Point de départ habituel : ${DEPART.adresse} (chaque sortie peut annoncer un autre lieu).`,
    "- Inscription gratuite sur le site : un compte, une inscription à la sortie, un QR code scanné au départ.",
    "- Fondateurs : Tobias Ringot et Tom Brenier ; associée sport et parcours : Romane Fournier.",
    "- Partenaires : Red Bull, Bee Zen.",
    "- Contact : contact@nulll.club · Instagram @nulll.club",
    "",
    "## Pages principales",
    `- [Prochaines sorties](${SITE}/fr/runs) : dates, horaires, distance et point de départ.`,
    `- [Le club](${SITE}/fr/communaute) : histoire et esprit du club.`,
    `- [Devenir partenaire](${SITE}/fr/partenaires)`,
    `- [Contact](${SITE}/fr/contact)`,
    "",
    "## Guides locaux d’Aix-en-Provence",
    ...GUIDES.map((guide) => `- [${guide.titre}](${SITE}${guide.chemin}) : ${guide.description}`),
    "",
    "## Actus récentes",
    ...listActus()
      .slice(0, 8)
      .map((actu) => `- [${actu.titre}](${SITE}/fr/actu/${actu.slug}) (${actu.date})`),
    ""
  ];
  return new Response(lignes.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
