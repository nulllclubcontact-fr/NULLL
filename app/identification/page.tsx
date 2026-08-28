import Link from "next/link";
import { AccountHeader } from "../../components/account-shell";
import { ArrowIcon } from "../../components/ArrowIcon";
import { SiteFooter } from "../../components/site-shell";
import { getSiteCopy } from "../../lib/site-content";

export const metadata = {
  title: "S'identifier | NULLL.CLUB",
  description: "Connexion membre, inscription membre et accès professionnel partenaire NULLL.CLUB.",
  // Page passerelle vers les espaces prives : aucun interet dans les resultats.
  robots: { index: false, follow: false }
};

/**
 * Le mecanisme reel, tel qu'il tourne aujourd'hui. Le credit automatique
 * de points n'est pas encore en place (voir la page de scan pro), donc on
 * ne le promet pas ici : on decrit le QR, le palier et la reduction.
 */
const etapes = [
  {
    titre: "Tu crées ton compte",
    texte: "Deux minutes, la décharge à signer, et c’est fait."
  },
  {
    titre: "Tu reçois ton QR",
    texte: "Il vit dans ton espace membre, toujours sur ton téléphone."
  },
  {
    titre: "Le partenaire le scanne",
    texte: "Il voit ton palier et applique ta réduction directement en caisse."
  }
];

export default function IdentificationPage() {
  const copy = getSiteCopy("fr");

  return (
    <main className="bg-[#f6eadf] text-[#351815]">
      <AccountHeader />

      {/* ---------------- LE BENEFICE D'ABORD ----------------
          L'ancienne version ouvrait sur « Choisis ton acces » : un mot
          d'administration, qui ne donne envie de rien. On dit d'abord ce
          que le compte rapporte. */}
      <section className="border-b-2 border-[#351815] bg-[#1c0d0b] text-[#f6eadf]">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-16 xl:px-12">
          <div>
            <p className="font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]">
              Espace membre
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,7vw,5.6rem)] uppercase leading-[1.12] tracking-[-.035em]">
              Le club te suit <span className="text-[#d96ab4]">jusqu’en caisse.</span>
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-[#f6eadf]/82 lg:pb-3">
            Ton compte te donne un QR. Les commerçants partenaires du club le scannent, voient ton palier, et la
            réduction s’applique en caisse. C’est gratuit, et ça ne prend que deux minutes.
          </p>
        </div>
      </section>

      {/* ---------------- COMMENT CA MARCHE ---------------- */}
      <section className="border-b-2 border-[#351815] bg-[#ffb000] text-[#351815]" aria-labelledby="identification-etapes">
        <h2 className="sr-only" id="identification-etapes">
          Comment ça marche
        </h2>
        <ol className="mx-auto grid w-full max-w-[1600px] sm:grid-cols-3">
          {etapes.map((etape, index) => (
            <li
              className="border-b-2 border-[#351815] px-5 py-8 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0 sm:px-8 sm:py-12 xl:px-12"
              key={etape.titre}
            >
              <span className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#351815]/55 [word-spacing:.18em]">
                0{index + 1}
              </span>
              <h3 className="mt-5 font-display text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[1.12] tracking-[-.02em]">
                {etape.titre}
              </h3>
              <p className="mt-3 max-w-[38ch] text-base leading-relaxed text-[#351815]/80">{etape.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- LES ACTIONS ----------------
          Les trois cartes se valaient : l'espace pro, reserve a une poignee
          de commercants, pesait autant que l'inscription. Il descend en
          simple lien, et creer un compte devient l'action dominante. */}
      <section className="bg-[#f6eadf]">
        <div className="mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20 xl:px-12">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr] lg:items-stretch">
            <Link
              className="group flex min-h-[15rem] flex-col justify-between border-2 border-[#351815] bg-[#d96ab4] p-6 transition-colors hover:bg-[#351815] hover:text-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#351815] sm:p-8"
              href="/membre/register"
            >
              <span className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] opacity-70 [word-spacing:.18em]">
                Nouveau membre
              </span>
              <span>
                <span className="block font-display text-[clamp(2.4rem,5vw,4rem)] uppercase leading-[1.12] tracking-[-.03em]">
                  Créer un compte
                </span>
                <span className="mt-5 flex items-center justify-between gap-4 border-t-2 border-current pt-5 font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em]">
                  C’est parti
                  <ArrowIcon />
                </span>
              </span>
            </Link>

            <Link
              className="group flex min-h-[15rem] flex-col justify-between border-2 border-[#351815] bg-[#f6eadf] p-6 transition-colors hover:bg-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4] sm:p-8"
              href="/membre/login"
            >
              <span className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#351815]/55 [word-spacing:.18em]">
                Déjà membre
              </span>
              <span>
                <span className="block font-display text-[clamp(2rem,3.6vw,2.8rem)] uppercase leading-[1.12] tracking-[-.03em]">
                  Se connecter
                </span>
                <span className="mt-5 flex items-center justify-between gap-4 border-t-2 border-[#351815] pt-5 font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em]">
                  Mon QR
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          </div>

          {/* L'acces partenaire ne concerne que les commercants : une ligne suffit. */}
          <p className="mt-10 border-t-2 border-[#351815] pt-6 text-base leading-relaxed text-[#351815]/72">
            Tu es un commerçant partenaire ?{" "}
            <Link
              className="font-bold underline decoration-2 underline-offset-4 transition-colors hover:text-[#d96ab4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]"
              href="/pro/login"
            >
              L’espace pro est par ici
            </Link>{" "}
            — scan des QR et statistiques.
          </p>
        </div>
      </section>

      <SiteFooter copy={copy} locale="fr" />
    </main>
  );
}
