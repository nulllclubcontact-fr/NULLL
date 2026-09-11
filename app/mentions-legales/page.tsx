import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import { getSiteCopy } from "../../lib/site-content";

export const metadata = {
  title: "Mentions légales | NULLL.CLUB",
  description: "Éditeur, hébergeur et contact du site NULLL.CLUB.",
  robots: { index: true, follow: true }
};

/**
 * Mentions de l'editeur et de l'hebergeur, separees de la politique de
 * confidentialite. Les donnees administratives sont celles deja publiees
 * sur /confidentialite ; le directeur de publication est le president de
 * l'association, tel que presente sur la page du club.
 */
export default function MentionsLegalesPage() {
  const copy = getSiteCopy("fr");

  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]">
      <SiteHeader copy={copy} current="confidentialite" locale="fr" pathname="/mentions-legales" />

      <main className="mx-auto max-w-[900px] px-5 py-14 sm:px-8 sm:py-20" id="contenu" tabIndex={-1}>
        <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[1.04]">Mentions légales.</h1>

        <Bloc titre="Éditeur du site">
          <p>
            <strong>NULLL.CLUB</strong>, association déclarée régie par la loi du 1<sup>er</sup> juillet 1901, créée
            le 10 juin 2026.
          </p>
          <p>Siège : 2 rue de la Fourane, 13090 Aix-en-Provence.</p>
          <p>SIREN 106 502 503 · SIRET 106 502 503 00019 · code APE 93.12Z. L’association n’est pas assujettie à la TVA.</p>
          <p>Directeur de la publication : Tobias Ringot, président de l’association.</p>
          <p>
            Contact : <Lien href={`mailto:${copy.contact.email}`}>{copy.contact.email}</Lien> ·{" "}
            <Lien href={`tel:${copy.contact.phone}`}>{copy.contact.phoneLabel}</Lien>
          </p>
        </Bloc>

        <Bloc titre="Hébergement">
          <p>
            <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis ·{" "}
            <Lien href="https://vercel.com">vercel.com</Lien>
          </p>
          <p>
            Base de données et comptes : <strong>Supabase Inc.</strong>, données hébergées dans l’Union européenne
            (Paris) · <Lien href="https://supabase.com">supabase.com</Lien>
          </p>
        </Bloc>

        <Bloc titre="Propriété intellectuelle">
          <p>
            Le nom NULLL.CLUB, le logo, les textes et les photographies de ce site appartiennent à l’association ou à
            leurs auteurs. Toute reproduction demande notre accord écrit.
          </p>
        </Bloc>

        <Bloc titre="Données personnelles">
          <p>
            Ce que le site collecte, pourquoi et pour combien de temps est détaillé dans la{" "}
            <Lien href="/confidentialite">politique de confidentialité</Lien>.
          </p>
        </Bloc>

        <Link
          className="mt-14 inline-flex min-h-14 items-center border-2 border-[#773331] bg-[#FFB200] px-8 font-mono text-xs font-black uppercase tracking-[.12em] text-[#773331] transition-colors hover:bg-[#773331] hover:text-[#F1EDE9] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
          href="/fr"
        >
          Retour à l’accueil
        </Link>
      </main>

      <SiteFooter copy={copy} locale="fr" />
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 border-t-2 border-[#773331] pt-8">
      <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] uppercase leading-[1.1]">{titre}</h2>
      <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed">{children}</div>
    </section>
  );
}

function Lien({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#EBA0CD] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
      href={href}
    >
      {children}
    </a>
  );
}
