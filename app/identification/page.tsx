import Link from "next/link";
import { BrandHeader } from "../../components/BrandHeader";

export const metadata = {
  title: "S'identifier | NULLL.CLUB",
  description: "Connexion membre, inscription membre et acces professionnel partenaire NULLL.CLUB."
};

export default function IdentificationPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BrandHeader current="home" />
      <section className="shell grid gap-8 py-8 lg:py-12">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Identification</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Entre. Ou cree.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/72">Ton compte membre, ton QR, tes points. Le reel, avec login.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Link className="panel panel-grid group min-h-64 p-5 transition hover:bg-shock hover:text-black md:p-8" href="/membre/login">
            <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-shock group-hover:text-black">Deja membre</p>
            <h2 className="mt-5 font-display text-[clamp(3rem,8vw,6rem)] uppercase leading-none">Se connecter.</h2>
            <p className="mt-5 max-w-md font-mono text-sm uppercase opacity-70">Dashboard, QR, points, historique.</p>
          </Link>

          <Link className="panel group min-h-64 p-5 transition hover:bg-white hover:text-black md:p-8" href="/membre/register">
            <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-shock">Nouveau membre</p>
            <h2 className="mt-5 font-display text-[clamp(3rem,8vw,6rem)] uppercase leading-none">Creer un compte.</h2>
            <p className="mt-5 max-w-md font-mono text-sm uppercase opacity-70">Inscription membre et decharge obligatoire.</p>
          </Link>
        </div>

        <div className="border-t-2 border-white pt-8">
          <div className="panel grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-white/50">Espace professionnel</p>
              <p className="mt-3 max-w-2xl text-white/72">
                Compte professionnel reserve aux partenaires NULLL.CLUB. Accessible uniquement avec un code fourni par le club.
              </p>
            </div>
            <Link className="primary-link" href="/pro/login">
              Acceder a mon espace pro
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
