import Image from "next/image";
import { partenairesVisibles } from "../lib/partenaires";

// Assez de logos par passage pour depasser la largeur d'un grand ecran :
// sinon la seconde copie arrive trop tard et on voit un trou dans la boucle.
const REPETITIONS = 6;

/**
 * Bandeau defilant des partenaires. La partie qui bouge est decorative
 * (aria-hidden) ; la vraie liste, avec les liens, est lue par les
 * lecteurs d'ecran et reste accessible au clavier.
 */
export function BandeauPartenaires() {
  if (partenairesVisibles.length === 0) return null;
  const passage = Array.from({ length: REPETITIONS }, () => partenairesVisibles).flat();

  return (
    <section aria-labelledby="home-partners-title" className="home-partners">
      <div className="home-partners-top home-label">
        <h2 className="home-partners-title" id="home-partners-title">Ils soutiennent le club</h2>
        <ul className="home-partners-list">
          {partenairesVisibles.map((partenaire) => (
            <li key={partenaire.nom}>
              <a href={partenaire.url} rel="sponsored noopener noreferrer" target="_blank">
                {partenaire.nom}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="marquee home-partners-marquee">
        <div aria-hidden="true" className="marquee-track">
          {[0, 1].map((copie) => (
            <div className="marquee-run" key={copie}>
              {passage.map((partenaire, index) => (
                <span className="marquee-item home-partners-item" key={`${copie}-${index}`}>
                  <Image
                    alt=""
                    className="home-partners-logo"
                    height={Math.round(48 * (partenaire.echelle ?? 1))}
                    src={partenaire.logo}
                    style={{ "--echelle": partenaire.echelle ?? 1 } as React.CSSProperties}
                    unoptimized={partenaire.logo.endsWith(".svg")}
                    width={Math.round(48 * (partenaire.echelle ?? 1) * partenaire.ratio)}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
