import Image from "next/image";
import { partenairesVisibles } from "../lib/partenaires";

/**
 * Les partenaires du club, mis en avant : un titre en etiquettes comme les
 * autres sections, puis une grande carte claire par partenaire, logo dans
 * ses vraies couleurs. La carte entiere mene au site du partenaire.
 */
export function BandeauPartenaires() {
  if (partenairesVisibles.length === 0) return null;

  return (
    <section aria-labelledby="home-partners-title" className="hx-partners">
      <h2 className="hx-stack" id="home-partners-title">
        <span className="st st-blue">Merci à</span>
        <span className="st st-yellow st-xl">nos partenaires</span>
      </h2>
      <ul className="hx-partners-list">
        {partenairesVisibles.map((partenaire) => (
          <li key={partenaire.nom}>
            <a className="hx-partners-card" href={partenaire.url} rel="sponsored noopener noreferrer" target="_blank">
              <span className="hx-partners-logo-box">
                <Image
                  alt={partenaire.nom}
                  className="hx-partners-logo"
                  height={Math.round(48 * (partenaire.echelle ?? 1))}
                  src={partenaire.logo}
                  style={{ "--echelle": partenaire.echelle ?? 1 } as React.CSSProperties}
                  unoptimized={partenaire.logo.endsWith(".svg")}
                  width={Math.round(48 * (partenaire.echelle ?? 1) * partenaire.ratio)}
                />
              </span>
              <span className="hx-partners-meta">
                <span>Partenaire du club</span>
                <span className="hx-partners-go">Voir le site →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
