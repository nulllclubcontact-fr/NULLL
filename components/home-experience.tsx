import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { DEPART } from "../lib/rendez-vous";
import { formaterDateActu, type Actu } from "../lib/actus";
import type { RunEvent } from "../lib/site-content";
import { ArrowIcon } from "./ArrowIcon";
import { BandeauPartenaires } from "./bandeau-partenaires";
import { FlecheMain } from "./fleche-main";
import { HomeJourney } from "./home-journey";
import { RouletteAccueil } from "./roulette-accueil";
import { RubanVitesse } from "./ruban-vitesse";
import "./home-experience.css";

type HomeExperienceProps = {
  runs: RunEvent[];
  runsHref: string;
  communityHref: string;
  merchHref: string;
  aboutHref: string;
  localClubHref: string;
  localRunningHref: string;
  newsHref: string;
  actus: Array<Actu & { epinglee?: boolean }>;
};

/**
 * Accueil, version « stories ». La DA suit le compte Instagram du club :
 * de grandes photos des sorties, des titres poses dessus en etiquettes de
 * couleur, de travers et qui se chevauchent, et des fleches tracees a la
 * main qui pointent l'action.
 */
export function HomeExperience({ runs, runsHref, communityHref, merchHref, aboutHref, localClubHref, localRunningHref, newsHref, actus }: HomeExperienceProps) {
  const nextRun = runs[0];

  return (
    <HomeJourney>
      <section className="hx-hero" aria-labelledby="home-title">
        <HeroPhoto />
        <div className="hx-hero-shade" aria-hidden="true" />
        <div className="hx-hero-copy">
          <h1 id="home-title" className="hx-hero-title">
            <span className="st st-yellow hx-hero-kicker">Le run club gratuit d’Aix-en-Provence</span>
            <span className="st st-pink">On court ensemble</span>
          </h1>
          <p className="hx-hero-support">On se rencontre, on discute, et on recommence samedi.</p>
          <div className="hx-hero-cta">
            <Link className="hx-pill" href={runsHref}><span>Choisir ma sortie</span><ArrowIcon /></Link>
            <span className="hx-note">Gratuit · tous niveaux · tu peux venir seul</span>
          </div>
        </div>
      </section>

      <section className="hx-bands" aria-label="Informations pratiques">
        <dl className="hx-band hx-band-pink">
          <div><dt>Quand</dt><dd>Samedi 9h30</dd></div>
          <div><dt>Départ</dt><dd>10h</dd></div>
          <div><dt>Où</dt><dd>{DEPART.nom}</dd></div>
          <div><dt>Distance</dt><dd>5 à 6 km</dd></div>
          <div><dt>Combien</dt><dd>0 €</dd></div>
        </dl>
      </section>

      <BandeauPartenaires />

      <section className="hx-dates" id="home-dates-section" aria-labelledby="home-next-runs">
        <figure className="hx-dates-photo">
          <Image src="/assets/actus/quatrieme-run/03.webp" alt="Le groupe file sur un chemin bordé d’une barrière en bois, sous les arbres" fill sizes="(max-width: 760px) 100vw, 55vw" />
        </figure>
        <div className="hx-dates-copy">
          <h2 id="home-next-runs" className="hx-stack hx-stack-left">
            <span className="st st-yellow">Le samedi</span>
            <span className="st st-magenta st-xl">on se retrouve</span>
          </h2>
          <p className="hx-dates-sub">Un samedi sur deux, au même endroit.<br />Rendez-vous à <strong>9h30</strong>, départ à <strong>10h</strong>.</p>
          <ol className="hx-runs">
            {runs.length === 0 ? (
              <li className="hx-run">
                <p className="hx-run-empty">Nouvelles dates très bientôt.</p>
                <Link className="hx-run-link" href={runsHref}><span>Voir les sorties</span><ArrowIcon /></Link>
              </li>
            ) : null}
            {runs.map((run, index) => {
              const [weekday, day, ...month] = run.date.split(" ");
              return (
                <li className="hx-run" key={run.id}>
                  <p className="hx-run-date">
                    <strong>{day?.padStart(2, "0")}</strong>
                    <span><span>{weekday}</span><span>{month.join(" ")}</span></span>
                  </p>
                  <p className="hx-run-kicker">{index === 0 ? "Prochaine sortie" : `Sortie ${index + 1}`}</p>
                  <p className="hx-run-details">{run.time} · {run.distance} · {run.pace}</p>
                  <p className="hx-run-location">{run.location}</p>
                  <Link className="hx-run-link" href={`/membre/login?sortie=${run.id}`}><span>Choisir cette sortie</span><ArrowIcon /></Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Le ruban passe a cheval sur la jonction des deux photos. */}
      <RubanVitesse className="hx-ruban" texte="Le sport n’est qu’un prétexte ✱ Soyons nous, soyons NULLL ✱ " />

      <section className="hx-together" aria-label="Courir ensemble, à allure conversation">
        <Image src="/assets/actus/bienvenue/01.webp" alt="Tout le groupe de Nulll Club réuni après une sortie, assis et debout dans le parc" fill sizes="100vw" />
        <div className="hx-together-shade" aria-hidden="true" />
        <div className="hx-together-copy">
          <p className="st st-cream">On vient pour courir.</p>
          <p className="hx-stack hx-together-big">
            <span className="st st-yellow st-xl">On revient</span>
            <span className="st st-pink st-xl">pour les gens.</span>
          </p>
          <p className="st st-lime hx-together-note">Personne ne sera laissé derrière</p>
          <p className="st st-blue hx-together-pace">5 à 6 km · allure conversation</p>
        </div>
      </section>

      {actus.length > 0 ? (
        <section className="hx-news" aria-labelledby="home-news-title">
          <div className="hx-news-head">
            <h2 id="home-news-title" className="hx-stack">
              <span className="st st-blue">Ce qui bouge</span>
              <span className="st st-yellow st-xl">au club !!!</span>
            </h2>
            <Link className="hx-pill hx-pill-small" href={newsHref}><span>Toutes les actus</span><ArrowIcon /></Link>
          </div>
          <ol className="hx-news-list">
            {actus.map((actu, index) => (
              <li key={actu.slug}>
                <Link className="hx-news-card" href={`${newsHref}/${actu.slug}`}>
                  <span className="hx-news-photo">
                    <Image alt={actu.image.alt} fill sizes="(max-width: 760px) 92vw, 33vw" src={actu.image.src} />
                  </span>
                  <span className={`st ${["st-pink", "st-yellow", "st-blue"][index % 3]} hx-news-date`}>
                    <time dateTime={actu.date}>{formaterDateActu(actu.date)}</time>
                  </span>
                  <h3 className="st st-cream hx-news-title">{actu.titre}</h3>
                  <p className="hx-news-text">{actu.resume}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="hx-club" aria-labelledby="home-le-club">
        <div className="hx-club-photos">
          <figure className="hx-club-photo hx-club-photo-a">
            <Image src="/assets/actus/quatrieme-run/10.webp" alt="Une coureuse en gilet d’hydratation, au soleil, après la sortie" fill sizes="(max-width: 760px) 70vw, 30vw" />
          </figure>
          <figure className="hx-club-photo hx-club-photo-b">
            <Image src="/assets/actus/parc-de-la-torse/trio-sourires.webp" alt="Trois membres de Nulll Club tout sourire après une sortie" fill sizes="(max-width: 760px) 80vw, 34vw" />
          </figure>
          <p className="st st-yellow hx-club-first">Première fois ? <br />Tu peux venir seul.</p>
        </div>
        <div className="hx-club-copy">
          <h2 id="home-le-club" className="hx-stack hx-stack-left">
            <span className="st st-pink st-lg">Social sport club</span>
            <span className="st st-blue">à Aix-en-Provence</span>
          </h2>
          <p>
            Nulll Club est un social sport club associatif à Aix-en-Provence. On se retrouve
            <strong> le samedi à 9h30</strong>, départ à 10h, pour courir ensemble, à une allure qui permet de discuter.
            Les prochaines dates et leurs infos pratiques sont sur la page Sorties.
          </p>
          <p>C’est <strong>gratuit</strong>. Tu peux venir une fois pour voir, puis revenir pour les gens.</p>
          <dl className="hx-facts">
            {[
              { t: "Quand", d: "Un samedi sur deux, rendez-vous 9h30, départ 10h", c: "st-yellow" },
              { t: "Où", d: DEPART.adresse, c: "st-cream" },
              { t: "Distance", d: "5 à 6 km, allure conversation", c: "st-lime" },
              { t: "Combien", d: "Gratuit, sur inscription", c: "st-pink" }
            ].map((fact) => <div className={`st ${fact.c}`} key={fact.t}><dt>{fact.t}</dt><dd>{fact.d}</dd></div>)}
          </dl>
          <p className="hx-local-links">
            Plus de détails sur <Link href={localClubHref}>le run club à Aix-en-Provence</Link> et sur{" "}
            <Link href={localRunningHref}>où courir à Aix-en-Provence</Link>.
          </p>
        </div>
      </section>

      <section className="hx-explore" aria-labelledby="home-explore-title">
        <h2 id="home-explore-title" className="hx-stack hx-explore-title">
          <span className="st st-lime">Le reste</span>
          <span className="st st-magenta st-xl">du club</span>
        </h2>
        <div className="hx-explore-grid">
          <ExploreTile href={communityHref} image="/assets/actus/bienvenue/13.webp" alt="Une bande de membres du club discute, canette à la main" label="Le club" text="D’où vient Nulll Club, et pourquoi trois L." couleur="st-pink" />
          <ExploreTile href={merchHref} image="/assets/actus/quatrieme-run/05.webp" alt="Un coureur en maillot rose, tout sourire après la sortie" label="Merch" text="Les pièces du club, quand elles sont dispo." couleur="st-yellow" />
          <ExploreTile href={aboutHref} image="/assets/actus/quatrieme-run/07.webp" alt="Une coureuse en sweat jaune raconte sa sortie au groupe" label="Contact" text="Une question avant de venir samedi ?" couleur="st-blue" />
        </div>
      </section>

      <section className="hx-final" aria-label="Rejoindre la prochaine sortie">
        <p className="st st-yellow hx-final-kicker">Attends, c’est quand ???</p>
        <div className="hx-final-row">
          <FlecheMain className="hx-final-arrow" variante="vague" />
          <Link className="hx-final-cta" href={runsHref}><span>Voir les sorties</span><ArrowIcon /></Link>
        </div>
        {nextRun ? <p className="hx-final-meta">{nextRun.date} · {nextRun.time} · {nextRun.location} · {nextRun.distance} · {nextRun.pace}</p> : null}
        <p className="hx-final-meta">Ouvert à tous · Gratuit · Inscription en ligne</p>
      </section>

      <RouletteAccueil runsHref={runsHref} />
    </HomeJourney>
  );
}

/** Photo d'ouverture : paysage sur ordinateur, portrait sur telephone. */
function HeroPhoto() {
  const commun = { alt: "Le peloton de Nulll Club court le long d’une barrière en bois, au parc de la Torse à Aix-en-Provence", priority: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: large }
  } = getImageProps({ ...commun, width: 1600, height: 900, src: "/assets/actus/parc-de-la-torse/peloton.webp" });
  const {
    props: { srcSet: portrait, ...rest }
  } = getImageProps({ ...commun, width: 900, height: 1600, src: "/assets/actus/parc-de-la-torse/passerelle.webp" });
  return (
    <picture className="hx-hero-media">
      <source media="(min-width: 761px)" srcSet={large} />
      <source media="(max-width: 760px)" srcSet={portrait} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt fourni par rest */}
      <img {...rest} className="hx-hero-image" />
    </picture>
  );
}

function ExploreTile({ href, image, alt, label, text, couleur }: { href: string; image: string; alt: string; label: string; text: string; couleur: string }) {
  return (
    <Link className="hx-tile" href={href}>
      <Image src={image} alt={alt} fill sizes="(max-width: 760px) 92vw, 33vw" />
      <span className="hx-tile-shade" aria-hidden="true" />
      <h3 className={`st ${couleur} st-xl hx-tile-label`}>{label}</h3>
      <span className="st st-cream hx-tile-text">{text}</span>
    </Link>
  );
}
