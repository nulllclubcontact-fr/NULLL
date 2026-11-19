import Image from "next/image";
import { partenairesVisibles } from "../lib/partenaires";

/**
 * Les partenaires du club, mis en avant dans la DA des stories : chaque
 * partenaire est une grande etiquette de couleur penchee, logo en aplat,
 * avec un petit sticker « Voir le site » sur le coin. La carte entiere
 * mene au site du partenaire.
 */
export function BandeauPartenaires() {
  if (partenairesVisibles.length === 0) return null;

  return (
    <section aria-labelledby="home-partners-title" className="hx-partners">
      <h2 className="hx-stack" id="home-partners-title">
        <span className="st st-blue">Merci à</span>
        <span className="st st-lime st-xl">nos partenaires</span>
      </h2>
      <ul className="hx-partners-list">
        {partenairesVisibles.map((partenaire, index) => (
          <li className={index % 2 === 0 ? "hx-partners-pink" : "hx-partners-yellow"} key={partenaire.nom}>
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
              <span className="st st-cream hx-partners-go">Voir le site →</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
