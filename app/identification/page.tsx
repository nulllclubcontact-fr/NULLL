import Link from "next/link";
import { AccountHeader } from "../../components/account-shell";
import { ArrowIcon } from "../../components/ArrowIcon";
import { SiteFooter } from "../../components/site-shell";
import { getSiteCopy } from "../../lib/site-content";

export const metadata = {
  title: "S'identifier | NULLL.CLUB",
  description: "Connexion membre, inscription membre et acces professionnel partenaire NULLL.CLUB."
};

const accessCards = [
  {
    label: "Deja membre",
    title: "Se connecter",
    text: "Accede a ton QR, tes points, ton palier et ton historique.",
    href: "/membre/login",
    tone: "bg-[#d96ab4]"
  },
  {
    label: "Nouveau membre",
    title: "Creer un compte",
    text: "Inscription, decharge, puis acces au club membre.",
    href: "/membre/register",
    tone: "bg-[#ffb000]"
  },
  {
    label: "Partenaire",
    title: "Espace pro",
    text: "Scan QR, statistiques et points credites en caisse.",
    href: "/pro/login",
    tone: "bg-[#351815] text-[#f6eadf]"
  }
];

export default function IdentificationPage() {
  const copy = getSiteCopy("fr");

  return (
    <main className="bg-[#f6eadf] text-[#351815]">
      <AccountHeader />
      <section className="border-b-2 border-[#351815] px-4 py-8 sm:px-6 xl:px-8 xl:py-12">
        <div className="mx-auto grid w-full max-w-none gap-8">
          <div className="grid gap-6 xl:grid-cols-[0.72fr_1fr] xl:items-end">
            <div>
              <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">
                Identification / NULLL.CLUB
              </p>
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.6rem,8vw,7.4rem)] uppercase leading-[0.92]">
                Choisis ton acces.
              </h1>
            </div>
            <p className="max-w-3xl text-lg font-black uppercase leading-tight text-[#351815]/76 xl:text-2xl">
              Un seul endroit pour rejoindre le club, retrouver ton compte ou scanner cote partenaire. Meme site, meme energie.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {accessCards.map((card) => (
              <Link
                className={`group grid min-h-[310px] content-between overflow-hidden border-2 border-[#351815] p-5 transition hover:-translate-y-1 sm:p-6 ${card.tone}`}
                href={card.href}
                key={card.href}
              >
                <div>
                  <p className="font-mono text-xs font-black uppercase opacity-75">{card.label}</p>
                  <h2 className="mt-5 font-display text-[clamp(2.7rem,5vw,4.8rem)] uppercase leading-[0.92]">{card.title}</h2>
                  <p className="mt-5 max-w-md font-mono text-sm font-black uppercase leading-tight opacity-75">{card.text}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t-2 border-current pt-4 font-mono text-sm font-black uppercase">
                  Entrer
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter copy={copy} locale="fr" />
    </main>
  );
}
