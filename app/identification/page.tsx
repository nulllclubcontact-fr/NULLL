import Image from "next/image";
import Link from "next/link";
import { AccountHeader } from "../../components/account-shell";
import { ArrowIcon } from "../../components/ArrowIcon";
import { QrAnime } from "../../components/qr-anime";
import { Reveal } from "../../components/reveal";
import { SiteFooter } from "../../components/site-shell";
import { getSiteCopy } from "../../lib/site-content";

export const metadata = {
  title: "S'identifier | NULLL.CLUB",
  description: "Connexion membre, inscription membre et accès professionnel partenaire NULLL.CLUB.",
  // Page passerelle vers les espaces prives : aucun interet dans les resultats.
  robots: { index: false, follow: false }
};

/**
 * Ce que l'inscription apporte aujourd'hui, et rien de plus. Il n'y a pas
 * encore de commercants partenaires ni de credit de points : la page ne
 * vend donc aucune reduction. Elle parle de la decharge, du fait d'etre
 * compte, et de la carte de membre — trois choses qui existent.
 */
const etapes = [
  {
    titre: "Tu signes une fois",
    texte: "La décharge est réglée pour de bon. Plus rien à remplir le samedi matin."
  },
  {
    titre: "Tu comptes vraiment",
    texte: "Le nombre de membres, c’est ce qu’on présente à la mairie pour faire avancer le club."
  },
  {
    titre: "Ta carte t’attend",
    texte: "Ton QR de membre est prêt, et servira dès que les premiers partenaires arriveront."
  }
];

const TITRE = "ça se compte.";

export default function IdentificationPage() {
  const copy = getSiteCopy("fr");

  return (
    <main className="bg-[#f6eadf] text-[#351815]">
      <AccountHeader />

      {/* ---------------- OUVERTURE ----------------
          Le QR est ce que le compte donne : il est a l'ecran, et il se
          construit module par module au chargement. */}
      <section className="relative overflow-hidden border-b-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]" aria-labelledby="identification-titre">
        {/* La photo precedente etait un flou de mouvement : sous le voile
            necessaire a la lisibilite du texte, on ne distinguait plus rien.
            La flamme de la marque tient mieux ce role — elle reste lisible
            a n'importe quelle opacite. */}
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-auto w-[min(46rem,80vw)] max-w-none opacity-[.07] sm:-right-24 sm:opacity-[.09]"
          height={1545}
          priority
          src="/assets/nulll-new/flamme-cream.png"
          width={1169}
        />
        <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-12 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 xl:px-12">
          <div>
            <p className="hero-rise font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]" style={{ animationDelay: "60ms" }}>
              Espace membre
            </p>

            {/* Les lettres arrivent en cascade. aria-label porte la phrase
                entiere : lettre par lettre, un lecteur d'ecran epellerait. */}
            <h1
              aria-label={`Un club, ${TITRE}`}
              className="mt-6 font-display text-[clamp(2.6rem,6.4vw,5rem)] uppercase leading-[1.12] tracking-[-.035em]"
              id="identification-titre"
            >
              <span aria-hidden="true">
                <span className="hero-rise block" style={{ animationDelay: "140ms" }}>
                  Un club,
                </span>
                <span className="block text-[#d96ab4]">
                  {TITRE.split("").map((lettre, index) => (
                    <span className="letter-rise" key={`${lettre}-${index}`} style={{ animationDelay: `${340 + index * 45}ms` }}>
                      {/* Une espace dans un inline-block se reduit a zero :
                          « JUSQU’EN CAISSE » se collait en un seul mot. */}
                      {lettre === " " ? "\u00A0" : lettre}
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p className="hero-rise mt-7 max-w-xl text-lg leading-relaxed text-[#f6eadf]/82" style={{ animationDelay: "420ms" }}>
              T’inscrire prend deux minutes. Tu signes la décharge une seule fois, tu deviens officiellement membre, et
              tu comptes dans les chiffres qui permettent au club d’avancer. C’est gratuit, et ça n’engage à rien
              d’autre qu’à venir courir.
            </p>

            <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "520ms" }}>
              <Link
                className="inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#351815] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
                href="/membre/register"
              >
                <span>Créer mon compte</span>
                <ArrowIcon />
              </Link>
              <Link
                className="inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#f6eadf]/60 px-6 font-mono text-xs font-black uppercase tracking-[.1em] transition-colors [word-spacing:.12em] hover:border-[#f6eadf] hover:bg-[#f6eadf] hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href="/membre/login"
              >
                <span>J’ai déjà un compte</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="hero-rise mx-auto w-full max-w-sm lg:mr-0" style={{ animationDelay: "300ms" }}>
            <QrAnime />
            <p className="hero-text-shadow mt-5 text-center font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#f6eadf]/75 [word-spacing:.18em] lg:text-right">
              Ta carte de membre
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- COMMENT CA MARCHE ---------------- */}
      <section className="border-b-2 border-[#351815] bg-[#ffb000] text-[#351815]" aria-labelledby="identification-etapes">
        <h2 className="sr-only" id="identification-etapes">
          Comment ça marche
        </h2>
        <ol className="mx-auto grid w-full max-w-[1600px] sm:grid-cols-3">
          {etapes.map((etape, index) => (
            <Reveal
              as="li"
              className="etape-bloc border-b-2 border-[#351815] px-5 py-8 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0 sm:px-8 sm:py-12 xl:px-12"
              delay={index * 110}
              key={etape.titre}
            >
              <span className="etape-numero block font-display text-[clamp(2.6rem,5vw,4rem)] leading-none tracking-[-.03em] text-[#351815]/25">
                0{index + 1}
              </span>
              <h3 className="mt-5 font-display text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[1.12] tracking-[-.02em]">
                {etape.titre}
              </h3>
              <p className="mt-3 max-w-[38ch] text-base leading-relaxed text-[#351815]/80">{etape.texte}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------------- RECRUTER DES COMMERCANTS ----------------
          Il n'y a pas encore de partenaires : cette section ne les affiche
          pas, elle les cherche. Elle decrit ce que l'espace pro fait
          reellement — scan, palier, tableau de bord — sans inventer de
          conditions commerciales, qui restent a la main du club. */}
      <section className="border-t-2 border-[#351815] bg-[#351815] text-[#f6eadf]" aria-labelledby="identification-partenaires">
        <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:px-12">
          <div>
            <p className="font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#d96ab4] [word-spacing:.22em]">
              Commerçants d’Aix
            </p>
            <h2
              className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[1.12] tracking-[-.03em]"
              id="identification-partenaires"
            >
              Devenez <span className="text-[#ffb000]">partenaire.</span>
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-[#f6eadf]/82">
              Un groupe qui court tous les samedis matin à Aix, et qui cherche où aller ensuite. Café, boulangerie,
              restaurant, magasin de sport : le club peut envoyer ses membres chez vous.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#351815] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
                href="/fr/contact"
              >
                <span>Devenir partenaire</span>
                <ArrowIcon />
              </Link>
              {/* Les partenaires deja inscrits viennent ici pour se
                  connecter : le lien merite un bouton, pas une ligne
                  de texte perdue en bas de page. */}
              <Link
                className="inline-flex min-h-16 items-center justify-between gap-10 border-2 border-[#f6eadf]/60 px-6 font-mono text-xs font-black uppercase tracking-[.1em] transition-colors [word-spacing:.12em] hover:border-[#f6eadf] hover:bg-[#f6eadf] hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                href="/pro/login"
              >
                <span>Espace pro</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <dl className="h-fit border-t-2 border-[#f6eadf]/25">
            {[
              {
                titre: "Vous fixez la réduction",
                texte: "C’est vous qui décidez du geste commercial, et vous pouvez le changer quand vous voulez."
              },
              {
                titre: "Un scan, rien à installer",
                texte: "Le membre montre son QR, vous le scannez depuis un téléphone. Vous voyez son palier, vous appliquez."
              },
              {
                titre: "Vous mesurez ce que ça rapporte",
                texte: "Votre tableau de bord suit le chiffre d’affaires, les clients uniques et les passages, jour par jour."
              }
            ].map((point) => (
              <div className="border-b-2 border-[#f6eadf]/25 py-6" key={point.titre}>
                <dt className="font-display text-[clamp(1.3rem,1.9vw,1.6rem)] uppercase leading-[1.12] tracking-[-.02em] text-[#ffb000]">
                  {point.titre}
                </dt>
                <dd className="mt-3 max-w-[52ch] text-base leading-relaxed text-[#f6eadf]/78">{point.texte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SiteFooter copy={copy} locale="fr" />
    </main>
  );
}
