import Link from "next/link";
import { AccountHeader } from "../../../components/account-shell";
import { DECHARGES, VERSION_DECHARGE } from "../../../lib/decharge";

export const metadata = {
  title: "Décharge de participation | NULLL.CLUB",
  robots: { index: false, follow: false }
};

const RETOURS: Record<string, { href: string; label: string }> = {
  bienvenue: { href: "/membre/bienvenue", label: "Retour à mon inscription" },
  compte: { href: "/membre", label: "Retour à mon compte" },
  inscription: { href: "/membre/register", label: "Retour à mon inscription" }
};

/**
 * La decharge s'ouvre dans un nouvel onglet depuis les formulaires : la
 * saisie en cours n'est pas perdue. ?depuis= choisit le bon retour,
 * ?version= affiche une version anterieure, telle qu'elle a ete acceptee.
 */
export default async function MemberWaiverPage({
  searchParams
}: {
  searchParams: Promise<{ depuis?: string; version?: string }>;
}) {
  const { depuis, version } = await searchParams;
  const cle = version && DECHARGES[version] ? version : VERSION_DECHARGE;
  const decharge = DECHARGES[cle];
  const retour = RETOURS[depuis ?? ""] ?? RETOURS.inscription;
  const anciennes = Object.keys(DECHARGES).filter((v) => v !== VERSION_DECHARGE);

  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]">
      <AccountHeader />
      <main className="shell grid gap-8 py-10" id="contenu" tabIndex={-1}>
        <div>
          <p className="inline-flex border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase">Décharge / membre</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6.4rem)] uppercase leading-[1.04]">Décharge de responsabilité.</h1>
          <p className="mt-5 max-w-xl text-lg font-bold leading-snug">
            Lis les conditions de participation avant de les accepter. Une question ?{" "}
            <Link className="underline decoration-2 underline-offset-4" href="/fr/contact">
              Contacte le club
            </Link>
            .
          </p>
        </div>

        <article className="panel panel-grid max-w-4xl p-5 md:p-8">
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] uppercase leading-[1.1]">Décharge de responsabilité, NULLL.CLUB</h2>
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
            Version {cle} · en vigueur depuis {decharge.depuis}
            {cle !== VERSION_DECHARGE ? " · version antérieure" : ""}
          </p>
          <p className="mt-6 text-lg font-bold leading-snug">
            En cochant la case d’acceptation et en validant mon inscription, je reconnais et j’accepte ce qui suit :
          </p>
          <div className="mt-8 grid gap-6">
            {decharge.sections.map((section) => (
              <section className="border-t-2 border-[#773331] pt-5" key={section.title}>
                <h3 className="font-mono text-sm font-black uppercase">{section.title}</h3>
                <p className="mt-3 max-w-[70ch] leading-relaxed">{section.text}</p>
              </section>
            ))}
          </div>
          <p className="mt-8 border-t-2 border-[#773331] pt-5 font-mono text-sm font-black uppercase">
            Je certifie avoir lu et compris la présente décharge et l’accepter sans réserve.
          </p>
        </article>

        {anciennes.length > 0 ? (
          <p className="text-sm">
            Versions précédentes :{" "}
            {anciennes.map((v, i) => (
              <span key={v}>
                {i > 0 ? " · " : ""}
                <Link className="underline decoration-2 underline-offset-4" href={`/membre/decharge?version=${v}`}>
                  {v}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        <Link className="primary-link w-fit" href={retour.href}>
          {retour.label}
        </Link>
      </main>
    </div>
  );
}
