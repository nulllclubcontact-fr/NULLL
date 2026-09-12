import { Reveal } from "./reveal";

export type TimelineEntry = {
  date: string;
  label: string;
  text: string;
  /** « passe » : deja arrive. « aVenir » : devant nous. */
  status: "passe" | "aVenir";
};

/**
 * La ligne de vie du club.
 *
 * Sur grand ecran, la ligne passe au milieu de la page et les moments
 * alternent a gauche et a droite. Sur telephone, elle repasse sur le cote
 * gauche, une seule colonne. Les moments a venir sont marques
 * differemment : la page ne doit pas laisser croire qu'ils ont eu lieu.
 */
export function ClubTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="club-timeline relative mt-12 sm:mt-16">
      {entries.map((entry, index) => {
        const aGauche = index % 2 === 0;

        return (
          <Reveal
            as="li"
            className={`timeline-entry relative pb-12 pl-10 last:pb-0 sm:pl-16 lg:grid lg:grid-cols-2 lg:gap-x-28 lg:pl-0 ${
              entry.status === "aVenir" ? "is-future" : ""
            }`}
            delay={index * 90}
            repeat
            key={entry.label}
          >
            {/* Segment de ligne : il s'arrete au dernier repere. */}
            <span aria-hidden="true" className="timeline-line" />
            <span aria-hidden="true" className="timeline-dot" />

            <div className={aGauche ? "lg:col-start-1 lg:text-right" : "lg:col-start-2"}>
              <p className="timeline-date font-mono text-xs font-black uppercase tracking-[.16em]">{entry.date}</p>
              <h3 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.8rem)] uppercase leading-[1.12]">{entry.label}</h3>
              <p className={`mt-4 max-w-[52ch] text-lg leading-relaxed text-[#F1EDE9] ${aGauche ? "lg:ml-auto" : ""}`}>{entry.text}</p>

              {entry.status === "aVenir" ? (
                <span className="mt-5 inline-flex border-2 border-dashed border-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase tracking-[.16em] text-[#FFB200]">
                  À venir
                </span>
              ) : null}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
