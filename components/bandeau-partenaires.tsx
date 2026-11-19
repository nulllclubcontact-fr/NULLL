import Image from "next/image";
import { partenairesVisibles } from "../lib/partenaires";

/**
 * Les partenaires du club : une ligne de logos fixes, passes en blanc pour
 * tenir sur le fond sombre de l'accueil. Chaque logo est le lien vers le
 * site du partenaire et porte son nom en texte alternatif.
 */
export function BandeauPartenaires() {
  if (partenairesVisibles.length === 0) return null;

  return (
    <section aria-labelledby="home-partners-title" className="hx-partners">
      <h2 className="hx-partners-title" id="home-partners-title">Ils soutiennent le club</h2>
      <ul className="hx-partners-list">
        {partenairesVisibles.map((partenaire) => (
          <li key={partenaire.nom}>
            <a className="hx-partners-link" href={partenaire.url} rel="sponsored noopener noreferrer" target="_blank">
              <Image
                alt={partenaire.nom}
                className="hx-partners-logo"
                height={Math.round(48 * (partenaire.echelle ?? 1))}
                src={partenaire.logo}
                style={{ "--echelle": partenaire.echelle ?? 1 } as React.CSSProperties}
                unoptimized={partenaire.logo.endsWith(".svg")}
                width={Math.round(48 * (partenaire.echelle ?? 1) * partenaire.ratio)}
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
