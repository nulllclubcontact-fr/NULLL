import Image from "next/image";

export type PhotoMagazine = { src: string; alt: string; largeur: number; hauteur: number };
export type SectionMagazine = { titre: string; paragraphes: string[]; citation?: string };

/**
 * Corps d'article facon magazine, partage par les actus et les guides :
 * intertitres en etiquettes de couleur, premier paragraphe plus grand,
 * mots mis en avant (**...**), liens ([texte](url)), grandes citations, et
 * une photo apres chaque section (verticale : a cote du texte).
 */
export function CorpsMagazine({ sections, photos }: { sections: SectionMagazine[]; photos: PhotoMagazine[] }) {
  return (
    <>
          {sections.map((section, index) => {
            const photo = photos[index];
            const verticale = photo ? photo.hauteur > photo.largeur : false;
            const texte = (
              <section className={verticale ? "" : "mx-auto max-w-[680px]"}>
                <h2 className={`st ${COULEURS[index % COULEURS.length]} ${index === 0 ? "" : "mt-4"}`}>{section.titre}</h2>
                <div className="mt-6 space-y-6 text-[1.13rem] leading-[1.8] text-white/88">
                  {section.paragraphes.map((paragraphe, numero) =>
                    index === 0 && numero === 0 ? (
                      // Le premier paragraphe ouvre l'article : simplement plus grand.
                      <p className="text-[clamp(1.3rem,2vw,1.55rem)] leading-[1.6] text-white" key={paragraphe}>
                        <Texte texte={paragraphe} />
                      </p>
                    ) : (
                      <p key={paragraphe}>
                        <Texte texte={paragraphe} />
                      </p>
                    )
                  )}
                </div>
                {section.citation ? (
                  <blockquote className={verticale ? "mt-10" : "mx-auto my-14 max-w-[680px] text-center"}>
                    <p className="-rotate-1 [text-wrap:balance]">
                      <span className="st st-long !bg-[#FFC531] !text-[clamp(22px,2.6vw,34px)] !leading-[1.35] !text-[#141116]">{section.citation}</span>
                    </p>
                  </blockquote>
                ) : null}
              </section>
            );
            const figure = photo ? (
              <figure className={verticale ? "mx-auto w-full max-w-[420px]" : "mx-auto my-16 max-w-[1100px]"}>
                <div className={`overflow-hidden rounded-[2px] ${index % 2 === 0 ? "rotate-[.8deg]" : "-rotate-[.8deg]"}`}>
                  <Image alt={photo.alt} className="h-auto w-full" height={photo.hauteur} sizes={verticale ? "(min-width: 1024px) 420px, 90vw" : "(min-width: 1100px) 1100px, 100vw"} src={photo.src} width={photo.largeur} />
                </div>
                <figcaption className="mt-4 text-center font-hand text-[1.5rem] leading-snug text-white/70">{photo.alt}</figcaption>
              </figure>
            ) : null;

            // Photo verticale : le texte se met a cote, la photo alterne de cote.
            if (verticale) {
              return (
                <div className={`mx-auto my-16 grid max-w-[1100px] items-center gap-12 lg:gap-16 ${index % 2 === 0 ? "lg:grid-cols-[minmax(0,1fr)_420px]" : "lg:grid-cols-[420px_minmax(0,1fr)]"}`} key={section.titre}>
                  <div className={index % 2 === 0 ? "" : "lg:order-2"}>{texte}</div>
                  <div className={index % 2 === 0 ? "" : "lg:order-1"}>{figure}</div>
                </div>
              );
            }
            return (
              <div key={section.titre}>
                {texte}
                {figure ?? <div className="h-14" />}
              </div>
            );
          })}
    </>
  );
}

const COULEURS = ["st-yellow", "st-blue", "st-lime", "st-cream"];

/** Paragraphe : **texte** devient un surlignage facon etiquette. */
export function Texte({ texte }: { texte: string }) {
  const morceaux = texte.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g);
  return (
    <>
      {morceaux.map((morceau, index) =>
        morceau.startsWith("**") && morceau.endsWith("**") ? (
          <mark className="surligne" key={index}>
            {morceau.slice(2, -2)}
          </mark>
        ) : morceau.startsWith("[") && /^\[[^\]]+\]\([^)\s]+\)$/.test(morceau) ? (
          <Lien key={index} morceau={morceau} />
        ) : (
          <span key={index}>{morceau}</span>
        )
      )}
    </>
  );
}

/** [texte](url) : lien externe en rose NULLL, interne sans nouvel onglet. */
function Lien({ morceau }: { morceau: string }) {
  const [, label, href] = morceau.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) ?? [];
  const externe = href.startsWith("http");
  return (
    <a
      className="font-bold text-[#E8459E] underline decoration-2 underline-offset-4 transition-colors hover:text-white"
      href={href}
      {...(externe ? { rel: "noopener noreferrer", target: "_blank" } : {})}
    >
      {label}
    </a>
  );
}
