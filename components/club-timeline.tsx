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
 * Une seule colonne, une ligne verticale continue, un repere par moment.
 * Les moments a venir sont marques differemment : le club n'a pas encore
 * couru, et la page ne doit pas laisser croire le contraire.
 */
export function ClubTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="club-timeline relative mt-12 sm:mt-16">
      {entries.map((entry, index) => (
        <Reveal
          as="li"
          className={`timeline-entry relative pb-12 pl-10 last:pb-0 sm:pl-16 ${
            entry.status === "aVenir" ? "is-future" : ""
          }`}
          delay={index * 90}
          repeat
          key={entry.label}
        >
          {/* Segment de ligne : il s'arrete au dernier repere. */}
          <span aria-hidden="true" className="timeline-line" />
          <span aria-hidden="true" className="timeline-dot" />

          <p className="timeline-date font-mono text-xs font-black uppercase tracking-[.16em]">{entry.date}</p>
          <h3 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.8rem)] uppercase leading-[1.12]">{entry.label}</h3>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-[#f6eadf]/78">{entry.text}</p>

          {entry.status === "aVenir" ? (
            <span className="mt-5 inline-flex border-2 border-dashed border-[#ffb000]/60 px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#ffb000]">
              À venir
            </span>
          ) : null}
        </Reveal>
      ))}
    </ol>
  );
}
