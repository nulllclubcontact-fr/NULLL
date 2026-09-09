import Image from "next/image";
import Link from "next/link";
import type { RunEvent } from "../lib/site-content";
import { PARCOURS_SAMEDI } from "../lib/parcours";
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
      {/* ---------------- LE HERO ----------------
           L'intro tenait en quatre panneaux epingles, pilotes par le
           defilement : 3500 px a franchir avant le premier contenu, et
           une sensation de rame sur telephone. Une affiche suffit —
           une photo, une phrase, trois chiffres, une action. */}
      <section className="home-hero" aria-labelledby="home-title">
        {/* Le groupe qui court dans une rue d'Aix : le club, la ville et
            le collectif dans la meme image. */}
        <Image alt="" className="home-hero-photo" fill priority sizes="100vw" src="/assets/photos/hero-nulll-aix-v2.webp" />
        <div className="home-hero-contenu">
          <p className="home-label home-hero-chapeau">Run club · Aix-en-Provence</p>
          <h1 id="home-title">Samedi<br /><span>on sort.</span></h1>
          <dl className="home-hero-chiffres">
            <div><dt className="home-label">Le samedi</dt><dd>8<span>h</span>30</dd></div>
            <div><dt className="home-label">Allure conversation</dt><dd>5–6<span>km</span></dd></div>
            <div><dt className="home-label">Sans inscription</dt><dd>0<span>€</span></dd></div>
          </dl>
          <a className="home-hero-action" href="#home-dates-section">Prochaines sorties <ArrowIcon /></a>
        </div>
      </section>

      <section className="home-dates home-section" id="home-dates-section" aria-labelledby="home-next-runs">
        <div className="home-section-top home-label"><span>01 — On se retrouve</span><span className="home-hand">Le samedi, c’est ici.</span></div>
        <div className="home-dates-layout">
          <div className="home-dates-intro" data-home-reveal>
            <h2 id="home-next-runs">Les prochaines<br /><span>dates.</span></h2>
            <p>Rendez-vous au même endroit,<br />chaque samedi matin.</p>
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
        <div className="home-together-copy" data-home-reveal><span className="home-label">5 à 6 km · Allure conversation</span><p>On vient pour courir.<br /><span>On revient<br />pour les gens.</span></p></div>
        <span className="home-together-note home-label">Personne ne sera laissé derrière.</span>
      </section>

      <section className="home-club home-section" aria-labelledby="home-le-club">
        <div className="home-section-top home-label"><span>02 — Bienvenue au club</span><span className="home-hand">Aucune avance. Aucune pression.</span></div>
        <div className="home-club-heading" data-home-reveal><h2 id="home-le-club">Un run club<br /><span>à Aix-en-Provence.</span></h2></div>
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
            <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#C32986] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBA0CD]" href={localClubHref}>
              le run club à Aix-en-Provence
            </Link>{" "}
            et sur{" "}
            <Link className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#C32986] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EBA0CD]" href={localRunningHref}>
              où courir à Aix-en-Provence
            </Link>.
          </p>
      </section>

      <section className="home-explore home-section" aria-labelledby="home-explore">
        <div className="home-section-top home-label"><span>03 — Au-delà des kilomètres</span><span>NULLL.CLUB</span></div>
        {/* Titre et liens se repondent en deux colonnes. Empiles, le titre
            prenait toute la largeur et les liens tombaient dessous. */}
        <div className="home-explore-body">
          <h2 id="home-explore" data-home-reveal>Le reste<br />du <span>club.</span></h2>
          <div className="home-explore-links" data-home-reveal>
            <ExploreLink href={communityHref} index="01" label="Le club" text="D’où vient NULLL.CLUB, et pourquoi trois L." />
            <ExploreLink href={merchHref} index="02" label="Merch" text="Les pièces du club, quand elles sont dispo." />
            <ExploreLink href={aboutHref} index="03" label="Contact" text="Une question avant de venir samedi." />
          </div>
        </div>
        <Link className="home-final-cta" href={runsHref}><span>Je viens samedi</span><ArrowIcon /></Link>
        {nextRun && <p className="home-label home-final-meta">{nextRun.date} · {nextRun.time} · {nextRun.location} · {nextRun.distance} · {nextRun.pace}</p>}
        <p className="home-label home-final-meta">Ouvert à tous · Gratuit · Sans inscription</p>
      </section>
    </HomeJourney>
  );
}

function ExploreLink({ href, index, label, text }: { href: string; index: string; label: string; text: string }) {
  return <Link className="home-explore-link" href={href}><span className="home-label">{index}</span><h3>{label}</h3><p>{text}</p><ArrowIcon /></Link>;
}
