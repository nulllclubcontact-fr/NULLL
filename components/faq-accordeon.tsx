/**
 * FAQ en accordeon, fermee au chargement. Les <details> partagent le meme
 * name : le navigateur referme tout seul la question ouverte quand on en
 * ouvre une autre. Natif, donc clavier et lecteurs d'ecran inclus.
 */
export function FaqAccordeon({ entrees, nom, accent = "text-[#FFC531]" }: { entrees: Array<{ q: string; a: string }>; nom: string; accent?: string }) {
  return (
    <div className="grid gap-3">
      {entrees.map((entree, index) => (
        <details className="group rounded-[2px] border border-white/10 bg-[#1E1A21] open:border-[#E8459E]" key={entree.q} name={nom}>
          <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-7">
            <span aria-hidden="true" className={`shrink-0 font-mono text-xs font-bold tracking-[.14em] ${accent}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-display text-[clamp(1.3rem,2.1vw,1.9rem)] uppercase leading-[1.1]">{entree.q}</span>
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-[2px] bg-white/10 transition-colors group-open:bg-[#E8459E]">
              <svg className="size-4 transition-transform duration-200 group-open:rotate-45" fill="none" viewBox="0 0 16 16">
                <path d="M8 1v14M1 8h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            </span>
          </summary>
          <p className="max-w-[62ch] px-5 pb-6 text-[1.05rem] leading-relaxed text-white/85 sm:px-7 sm:pb-8 sm:pl-[4.25rem]">{entree.a}</p>
        </details>
      ))}
    </div>
  );
}
