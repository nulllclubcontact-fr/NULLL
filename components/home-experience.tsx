import Image from "next/image";
import Link from "next/link";
import type { RunEvent } from "../lib/site-content";
import { PARCOURS_SAMEDI } from "../lib/parcours";
import { ArrowIcon } from "./ArrowIcon";
import { Countdown } from "./countdown";
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
      <section className="home-cinema" aria-label="Découvrir NULLL.CLUB au fil du parcours">
        <span className="cinema-anchor cinema-infos-anchor" id="home-intro-infos" />
        <div className="cinema-stage">
          <a className="cinema-skip home-label" href="#home-next-runs">Passer l’intro <span aria-hidden="true">↘</span></a>

          <div className="cinema-logo-scene">
            <h1 id="home-title"><Image src="/assets/nulll-new/logo-cream.png" alt="NULLL.CLUB — run club à Aix-en-Provence" width={2449} height={313} priority sizes="85vw" /></h1>
            <p className="home-label cinema-logo-location">Aix-en-Provence · Social sport club</p>
            <a href="#home-intro-infos" className="cinema-scroll home-label">Tout commence ici.<span>Scroll pour découvrir <span aria-hidden="true">↓</span></span></a>
          </div>

          <section className="cinema-stats-scene" aria-labelledby="cinema-stats-title">
            <div className="cinema-stats-heading"><p className="home-label">Pas besoin d’être un grand coureur.</p><h2 id="cinema-stats-title">On court<br /><span>ensemble.</span></h2><p>Tous les samedis.<br />On vient pour courir. On revient pour les gens.</p></div>
            <dl className="cinema-stats">
              <div><dt className="home-label">Le parcours du samedi</dt><dd>5,07<span>km</span></dd><dd className="cinema-stat-note">Allure conversation · +45 m</dd></div>
              <div><dt className="home-label">Le rendez-vous</dt><dd>8<span>h</span>30</dd><dd className="cinema-stat-note">Parking Émile Zola · Aix-en-Provence</dd></div>
              <div><dt className="home-label">Pour tout le monde</dt><dd>0<span>€</span></dd><dd className="cinema-stat-note">Gratuit · Sans inscription<br />Sans niveau minimum</dd></div>
            </dl>
          </section>

          <section className="cinema-map-scene" aria-labelledby="cinema-map-title">
            <div className="cinema-map-background" />
            <div className="cinema-map-heading"><span className="home-label">Le parcours du samedi</span><h2 id="cinema-map-title">Un tracé.<br /><span>Notre point de rencontre.</span></h2></div>
            <div className="cinema-map-canvas">
              <svg className="cinema-map-svg" viewBox={PARCOURS_SAMEDI.viewBox} role="img" aria-label="Carte du parcours de 5,07 km à Aix-en-Provence. Départ au parking Émile Zola.">
                <g className="cinema-streets" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <g className="cinema-water">{PARCOURS_SAMEDI.eau.map((path, i) => <path key={i} d={path} />)}</g>
                  <g className="cinema-minor-roads">{PARCOURS_SAMEDI.mineures.map((path, i) => <path key={i} d={path} />)}</g>
                  <g className="cinema-major-roads">{PARCOURS_SAMEDI.majeures.map((path, i) => <path key={i} d={path} />)}</g>
                </g>
                <path className="cinema-route-halo" d={PARCOURS_SAMEDI.trace} fill="none" />
                <path className="cinema-route-white" d={PARCOURS_SAMEDI.trace} fill="none" pathLength={1} strokeDasharray="1" />
                <path className="cinema-route-yellow" d={PARCOURS_SAMEDI.trace} fill="none" pathLength={1} strokeDasharray="1" />
                <g className="cinema-depart-marker" transform={`translate(${PARCOURS_SAMEDI.depart.x} ${PARCOURS_SAMEDI.depart.y})`}>
                  <circle r="13" /><circle r="4" />
                  <path d="M 0 -16 L 0 -57 L 65 -57" fill="none" />
                  <rect x="55" y="-87" width="200" height="49" rx="0" />
                  <text x="68" y="-67">DÉPART / ARRIVÉE</text><text x="68" y="-49">Parking Émile Zola</text>
                </g>
              </svg>
            </div>
            <div className="cinema-map-geography home-label"><span>Aix-en-Provence</span><span>43.50989° N / 5.46133° E</span></div>
            <div className="cinema-route-distance"><strong>5,07</strong><span className="home-label">km ensemble<br />+45 m · Allure conversation</span></div>
            {nextRun && <div className="cinema-meetup"><span className="home-label">Prochaine sortie</span><strong>{nextRun.date}</strong><p>Parking Émile Zola · Aix-en-Provence<br />{nextRun.time} · {nextRun.distance} · {nextRun.location}</p><Link href={runsHref} className="home-label">Je viens samedi <ArrowIcon /></Link></div>}
            <span className="cinema-map-credit">© les contributeurs OpenStreetMap</span>
          </section>
          <div className="cinema-progress" aria-hidden="true"><span className="home-label cinema-progress-label">NULLL.CLUB</span><div><span /></div><span className="home-label">Scroll ↓</span></div>
        </div>
      </section>
      <span data-flow-point className="home-flow-point home-flow-start" />

      <div className="home-manifesto-strip" aria-label="Gratuit, sans inscription, sans niveau minimum">
        <span>Pas de chrono.</span><span className="home-strip-star" aria-hidden="true">✳</span><span>Pas de pression.</span><span className="home-strip-star" aria-hidden="true">✳</span><span>Juste nous.</span>
      </div>

      <section className="home-dates home-section" id="home-dates-section" aria-labelledby="home-next-runs">
        <span data-flow-point className="home-flow-point home-dates-point" />
        <div className="home-section-top home-label"><span>01 — On se retrouve</span><span>Le samedi, c’est ici.</span></div>
        <div className="home-dates-layout">
          <div className="home-dates-intro" data-home-reveal>
            <h2 id="home-next-runs">Les prochaines<br /><span>dates.</span></h2>
            <p>Rendez-vous au même endroit,<br />chaque samedi matin.</p>
            {nextRun && <div className="home-countdown"><Countdown isoDate={nextRun.isoDate} /></div>}
            <figure className="home-dates-photo">
              <Image src="/assets/photos/runs-blur.webp" alt="Un coureur en mouvement sur un chemin" fill sizes="(max-width: 760px) 85vw, 30vw" />
              <figcaption className="home-label">Le seul rythme qui compte : le tien.</figcaption>
            </figure>
          </div>
          <ol className="home-run-list">
            {runs.map((run, index) => {
              const [weekday, day, ...month] = run.date.split(" ");
              return <li className={`home-run-row ${index === 0 ? "home-run-first" : ""}`} key={run.id} data-home-reveal>
                <div className="home-run-kicker home-label"><span>{index === 0 ? "Prochaine sortie" : `Sortie ${index + 1}`}</span><span>0{index + 1}</span></div>
                <div className="home-run-date"><strong>{day?.padStart(2, "0")}</strong><p><span className="home-label">{weekday}</span><span>{month.join(" ")}</span></p></div>
                <p className="home-label home-run-details">{run.time} · {run.distance} · {run.pace}</p>
                <p className="home-run-location">{run.location}</p>
                <Link className="home-run-link home-label" href={runsHref}><span>{index === 0 ? "Je viens" : "Détails"}</span><ArrowIcon /></Link>
              </li>;
            })}
          </ol>
        </div>
      </section>

      <section className="home-together" aria-label="Courir ensemble, à allure conversation">
        <Image src="/assets/photos/hero-nulll-aix-v2.webp" alt="Le groupe NULLL.CLUB court dans une rue d’Aix-en-Provence au lever du soleil" fill sizes="100vw" />
        <div className="home-together-shade" />
        <span data-flow-point className="home-flow-point home-together-point" />
        <div className="home-together-copy" data-home-reveal><span className="home-label">5 à 6 km · Allure conversation</span><p>On vient pour courir.<br /><span>On revient<br />pour les gens.</span></p></div>
        <span className="home-together-note home-label">Personne ne sera laissé derrière.</span>
      </section>

      <section className="home-club home-section" aria-labelledby="home-le-club">
        <span data-flow-point className="home-flow-point home-club-point" />
        <div className="home-section-top home-label"><span>02 — Bienvenue au club</span><span>Aucune avance. Aucune pression.</span></div>
        <div className="home-club-heading" data-home-reveal><h2 id="home-le-club">Un run club<br /><span>à Aix-en-Provence.</span></h2><div className="home-free"><strong>0€</strong><span className="home-label">Pas d’abonnement.<br />Pas d’engagement.</span></div></div>
        <div className="home-club-layout">
          <div className="home-club-visual" data-home-reveal>
            <figure className="home-crew-photo"><Image src="/assets/photos/runs-crew.webp" alt="Un groupe de coureurs réunis en plein air" fill sizes="(max-width: 760px) 90vw, 45vw" /></figure>
            <div className="home-first-time"><span className="home-label">26 septembre 2026</span><p>La première fois.<br />Pour tout le monde.</p><span className="home-label">Nous les premiers.</span></div>
          </div>
          <div className="home-club-copy" data-home-reveal>
              <p>
                NULLL.CLUB est un run club associatif basé à Aix-en-Provence. On se retrouvera
                <strong> tous les samedis à 8h30 au parking Émile Zola</strong> pour une sortie de 5 à 6 km,
                à allure conversation — celle où tu peux encore parler en courant.
              </p>
              <p>
                C’est <strong>gratuit, sans inscription et sans niveau minimum</strong>. Personne ne sera
                laissé derrière, et personne n’aura d’avance : le
                <strong> 26 septembre, ce sera la première fois pour tout le monde</strong>, nous les premiers.
              </p>
              <p>
                C’est aussi ce qui nous sépare d’un club de sport classique à Aix-en-Provence : pas
                d’abonnement, pas d’engagement, et tu peux venir une fois pour voir.
              </p>
          </div>
        </div>
        <dl className="home-facts" data-home-reveal>
          {[
            { t: "Quand", d: "Tous les samedis, 8h30" },
            { t: "Où", d: "Parking Émile Zola, Aix-en-Provence" },
            { t: "Distance", d: "5 à 6 km, allure conversation" },
            { t: "Combien", d: "Gratuit, sans inscription" }
          ].map((fact, i) => <div key={fact.t}><dt className="home-label"><span>0{i + 1}</span>{fact.t}</dt><dd>{fact.d}</dd></div>)}
        </dl>
          <p className="home-local-links">
            Plus de détails sur{" "}
            <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#b03583] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]" href={localClubHref}>
              le run club à Aix-en-Provence
            </Link>{" "}
            et sur{" "}
            <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#b03583] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]" href={localRunningHref}>
              où courir à Aix-en-Provence
            </Link>.
          </p>
      </section>

      <section className="home-explore home-section" aria-labelledby="home-explore">
        <span data-flow-point className="home-flow-point home-explore-point" />
        <div className="home-section-top home-label"><span>03 — Au-delà des kilomètres</span><span>NULLL.CLUB</span></div>
        <h2 id="home-explore" data-home-reveal>Le reste<br />du <span>club.</span></h2>
        <div className="home-explore-links" data-home-reveal>
          <ExploreLink href={communityHref} index="01" label="Le club" text="D’où vient NULLL.CLUB, et pourquoi trois L." />
          <ExploreLink href={merchHref} index="02" label="Merch" text="Les pièces du club, quand elles sont dispo." />
          <ExploreLink href={aboutHref} index="03" label="Contact" text="Une question avant de venir samedi." />
        </div>
        <Link className="home-final-cta" href={runsHref}><span>Je viens samedi</span><ArrowIcon /></Link>
        {nextRun && <p className="home-label home-final-meta">{nextRun.date} · {nextRun.time} · {nextRun.location} · {nextRun.distance} · {nextRun.pace}</p>}
        <p className="home-label home-final-meta">Ouvert à tous · Gratuit · Sans inscription</p>
        <span data-flow-point className="home-flow-point home-flow-end" />
      </section>
    </HomeJourney>
  );
}

function ExploreLink({ href, index, label, text }: { href: string; index: string; label: string; text: string }) {
  return <Link className="home-explore-link" href={href}><span className="home-label">{index}</span><h3>{label}</h3><p>{text}</p><ArrowIcon /></Link>;
}
