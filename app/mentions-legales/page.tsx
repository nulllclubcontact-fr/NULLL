import Link from "next/link";
import { ArrowIcon } from "../../components/ArrowIcon";
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
    <div className="da min-h-dvh bg-[#141116] text-white">
      <SiteHeader copy={copy} current="confidentialite" locale="fr" pathname="/mentions-legales" />

      <main className="mx-auto max-w-[900px] px-5 py-14 sm:px-8 sm:py-20" id="contenu" tabIndex={-1}>
        <h1><span className="st st-pink st-xl">Mentions légales</span></h1>

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

        <Bloc titre="Conception et réalisation">
          <p>
            Site conçu et réalisé par <strong>Oculot Studio</strong> · <Lien href="https://oculot.studio">oculot.studio</Lien>
          </p>
          <p>
            Oculot Studio est un studio de développement de sites web, spécialisé dans la refonte. Il propose aussi
            des automatisations par l’IA, du branding et de la communication.
          </p>
          <p>
            Contact : <Lien href="mailto:bonjour@oculot.studio">bonjour@oculot.studio</Lien>
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

        <Link className="bouton mt-14" href="/fr">
          <span>Retour à l’accueil</span>
          <ArrowIcon />
        </Link>
      </main>

      <SiteFooter copy={copy} locale="fr" />
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 border-t-2 border-white/15 pt-8">
      <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] uppercase leading-[1.1]">{titre}</h2>
      <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed">{children}</div>
    </section>
  );
}

function Lien({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#E8459E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC531]"
      href={href}
    >
      {children}
    </a>
  );
}
