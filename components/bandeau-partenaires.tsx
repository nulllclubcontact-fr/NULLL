import Image from "next/image";
import Link from "next/link";
import { partenairesVisibles } from "../lib/partenaires";
import { ArrowIcon } from "./ArrowIcon";

/**
 * Les partenaires du club sur le fond sombre de la page : titre en
 * etiquettes, logos en blanc separes par un trait (format « collab » des
 * visuels Instagram du club), puis l'appel « Devenir partenaire ».
 */
export function BandeauPartenaires() {
  if (partenairesVisibles.length === 0) return null;

  return (
    <section aria-labelledby="home-partners-title" className="hx-partners">
      <h2 className="hx-stack" id="home-partners-title">
        <span className="st st-blue">Merci à</span>
        <span className="st st-lime st-xl">nos partenaires</span>
      </h2>
      {/* Logos cote a cote, separes par un trait : le format « collab » des
          visuels du club sur Instagram. */}
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
      <div className="hx-partners-join">
        <p>Une marque, un commerce d’Aix, une idée pour le club ?</p>
        <Link className="hx-pill" href="/fr/partenaires">
          <span>Devenir partenaire</span>
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
