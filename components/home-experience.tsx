import Image from "next/image";
import Link from "next/link";
import { DEPART } from "../lib/rendez-vous";
import type { RunEvent } from "../lib/site-content";
import { ArrowIcon } from "./ArrowIcon";
import { HomeJourney } from "./home-journey";
import "./home-experience.css";

type HomeExperienceProps = {
  runs: RunEvent[];
  runsHref: string;
  communityHref: string;
  merchHref: string;
  aboutHref: string;
  localClubHref: string;
  localRunningHref: string;
};

export function HomeExperience({ runs, runsHref, communityHref, merchHref, aboutHref, localClubHref, localRunningHref }: HomeExperienceProps) {
  const nextRun = runs[0];

  return (
    <HomeJourney>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-media">
          <Image alt="Un groupe court ensemble en ville" className="home-hero-image" fill priority sizes="(max-width: 760px) 100vw, 45vw" src="/assets/photos/hero-city.jpg" />
        </div>
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="home-label">Social sport club · Aix-en-Provence</p>
          <h1 id="home-title">NULLL<span>.CLUB</span></h1>
          <p className="home-hero-support">On court à Aix. On se rencontre. On recommence samedi.</p>
          <div className="home-hero-invitation">
            <Link className="home-hero-link" href={runsHref}><span>Choisir ma sortie</span><ArrowIcon /></Link>
            <span className="home-label home-hero-reassurance">Gratuit · Tous niveaux</span>
          </div>
        </div>
      </section>

      <section className="home-hero-facts" aria-label="Informations pratiques">
        <dl>
          <div><dt className="home-label">Quand</dt><dd>Samedi <span>8h30</span></dd></div>
          <div><dt className="home-label">Où</dt><dd>Chemin <span>de la Cible</span></dd></div>
          <div><dt className="home-label">Distance</dt><dd>5 à 6 <span>km</span></dd></div>
          <div><dt className="home-label">Combien</dt><dd>0 <span>€</span></dd></div>
        </dl>
        <p className="home-manifesto-strip">
          <span className="home-strip-star" aria-hidden="true">＊</span>
          <span className="home-slogan">Le sport n’est qu’un prétexte pour la rencontre.</span>
          <span className="home-strip-star" aria-hidden="true">＊</span>
        </p>
      </section>

      <section className="home-dates home-section" id="home-dates-section" aria-labelledby="home-next-runs">
        <div className="home-section-top home-label"><span>01 · On se retrouve</span><span className="home-hand">Le samedi, c’est ici.</span></div>
        <div className="home-dates-layout">
          <div className="home-dates-intro" data-home-reveal>
            <h2 id="home-next-runs">Les prochaines<br /><span>dates.</span></h2>
            <p>Rendez-vous au même endroit,<br />chaque samedi matin.</p>
            <figure className="home-dates-photo">
              <Image src="/assets/photos/runs-blur.webp" alt="Un coureur en mouvement sur un chemin" fill sizes="(max-width: 760px) 85vw, 30vw" />
              <figcaption className="home-label">De quoi courir. De quoi discuter.</figcaption>
            </figure>
          </div>
          <ol className="home-run-list">
            {runs.length === 0 ? (
              <li className="home-run-row home-run-first" data-home-reveal>
                <p className="home-run-location">Nouvelles dates très bientôt.</p>
                <Link className="home-run-link home-label" href={runsHref}><span>Voir les sorties</span><ArrowIcon /></Link>
              </li>
            ) : null}
            {runs.map((run, index) => {
              const [weekday, day, ...month] = run.date.split(" ");
              return <li className={`home-run-row ${index === 0 ? "home-run-first" : ""}`} key={run.id} data-home-reveal>
                <div className="home-run-kicker home-label"><span>{index === 0 ? "Prochaine sortie" : `Sortie ${index + 1}`}</span><span>0{index + 1}</span></div>
                <div className="home-run-date"><strong>{day?.padStart(2, "0")}</strong><p><span className="home-label">{weekday}</span><span>{month.join(" ")}</span></p></div>
                <p className="home-label home-run-details">{run.time} · {run.distance} · {run.pace}</p>
                <p className="home-run-location">{run.location}</p>
                <Link className="home-run-link home-label" href={runsHref}><span>{index === 0 ? "Choisir cette sortie" : "Voir la sortie"}</span><ArrowIcon /></Link>
              </li>;
            })}
          </ol>
        </div>
      </section>

      <section className="home-together" aria-label="Courir ensemble, à allure conversation">
        <Image src="/assets/photos/principle-meet.webp" alt="Deux coureurs de NULLL.CLUB courent côte à côte sur un chemin bordé d’arbres" fill sizes="100vw" />
        <div className="home-together-shade" />
        <div className="home-together-copy" data-home-reveal><span className="home-label">5 à 6 km · Allure conversation</span><p>On vient pour courir.<br /><span>On revient<br />pour les gens.</span></p></div>
        <span className="home-together-note home-label">Personne ne sera laissé derrière.</span>
      </section>

      <section className="home-club home-section" aria-labelledby="home-le-club">
        <div className="home-section-top home-label"><span>02 · Bienvenue au club</span><span className="home-hand">Aucune avance. Aucune pression.</span></div>
        <div className="home-club-heading" data-home-reveal><h2 id="home-le-club">Un run club<br /><span>à Aix-en-Provence.</span></h2></div>
        <div className="home-club-layout">
          <div className="home-club-visual" data-home-reveal>
            <figure className="home-crew-photo"><Image src="/assets/photos/runs-crew.webp" alt="Un groupe de coureurs réunis en plein air" fill sizes="(max-width: 760px) 90vw, 45vw" /></figure>
            <div className="home-first-time"><span className="home-label">Samedi · 8h30</span><p>Pour ta première<br />sortie.</p><span className="home-label">Tu peux venir seul.</span></div>
          </div>
          <div className="home-club-copy" data-home-reveal>
              <p>
                NULLL.CLUB est un run club associatif à Aix-en-Provence. On se retrouve
                <strong> le samedi à 8h30</strong> pour courir ensemble, à une allure qui permet de discuter. Les
                prochaines dates et leurs informations pratiques sont sur la page Sorties.
              </p>
              <p>
                C’est <strong>gratuit</strong>. Tu peux venir une fois pour voir, puis revenir pour les gens.
              </p>
          </div>
        </div>
        <dl className="home-facts" data-home-reveal>
          {[
            { t: "Quand", d: "Tous les samedis, 8h30" },
            { t: "Où", d: DEPART.adresse },
            { t: "Distance", d: "5 à 6 km, allure conversation" },
            { t: "Combien", d: "Gratuit, sur inscription" }
          ].map((fact, i) => <div key={fact.t}><dt className="home-label"><span>0{i + 1}</span>{fact.t}</dt><dd>{fact.d}</dd></div>)}
        </dl>
          <p className="home-local-links">
            Plus de détails sur{" "}
            <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#EBA0CD] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBA0CD]" href={localClubHref}>
              le run club à Aix-en-Provence
            </Link>{" "}
            et sur{" "}
            <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#EBA0CD] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBA0CD]" href={localRunningHref}>
              où courir à Aix-en-Provence
            </Link>.
          </p>
      </section>

      <section className="home-explore home-section" aria-labelledby="home-explore-title">
        <div className="home-section-top home-label"><span>03 · Au-delà des kilomètres</span><span>NULLL.CLUB</span></div>
        {/* Titre et liens se repondent en deux colonnes. Empiles, le titre
            prenait toute la largeur et les liens tombaient dessous. */}
        <div className="home-explore-body">
          <h2 id="home-explore-title" data-home-reveal>Le reste<br />du <span>club.</span></h2>
          <div className="home-explore-links" data-home-reveal>
            <ExploreLink href={communityHref} index="01" label="Le club" text="D’où vient NULLL.CLUB, et pourquoi trois L." />
            <ExploreLink href={merchHref} index="02" label="Merch" text="Les pièces du club, quand elles sont dispo." />
            <ExploreLink href={aboutHref} index="03" label="Contact" text="Une question avant de venir samedi." />
          </div>
        </div>
        <p className="home-signoff" data-home-reveal>Soyons nous.<br /><span>Soyons NULLL.</span></p>
        <Link className="home-final-cta" href={runsHref}><span>Voir les sorties</span><ArrowIcon /></Link>
        {nextRun && <p className="home-label home-final-meta">{nextRun.date} · {nextRun.time} · {nextRun.location} · {nextRun.distance} · {nextRun.pace}</p>}
        <p className="home-label home-final-meta">Ouvert à tous · Gratuit · Inscription en ligne</p>
      </section>
    </HomeJourney>
  );
}

function ExploreLink({ href, index, label, text }: { href: string; index: string; label: string; text: string }) {
  return <Link className="home-explore-link" href={href}><span className="home-label">{index}</span><h3>{label}</h3><p>{text}</p><ArrowIcon /></Link>;
}
