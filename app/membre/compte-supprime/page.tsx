import Link from "next/link";
import { AccountHeader } from "../../../components/account-shell";

export const metadata = {
  title: "Compte supprimé | Nulll Club",
  robots: { index: false, follow: false }
};

export default function CompteSupprimePage() {
  return (
    <div className="da min-h-dvh bg-[#141116] text-white">
      <AccountHeader />
      <main className="shell grid max-w-3xl gap-6 py-10" id="contenu" tabIndex={-1}>
        <p className="inline-flex w-fit border-2 border-white/15 bg-[#FFC531] px-3 py-2 font-mono text-xs font-black uppercase text-[#141116]">Compte / supprimé</p>
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] uppercase leading-[1.04]">
          C’est fait<span className="text-[#E8459E]">.</span>
        </h1>
        <p className="max-w-xl text-lg font-bold leading-snug">
          Ton compte et toutes tes données ont été effacés : profil, inscriptions aux sorties, présences et accords. Il ne
          reste rien chez nous.
        </p>
        <p className="max-w-xl leading-relaxed">
          Tu peux toujours revenir courir avec nous. Il faudra juste recréer un compte.
        </p>
        <Link className="primary-link w-fit" href="/fr">
          Retour à l’accueil
        </Link>
      </main>
    </div>
  );
}
