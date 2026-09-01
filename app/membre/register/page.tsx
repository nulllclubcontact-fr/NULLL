import Image from "next/image";
import { AccountHeader } from "../../../components/account-shell";
import { RegisterView } from "./RegisterView";

export const metadata = {
  title: "Créer mon compte membre | NULLL.CLUB",
  description:
    "Rejoins NULLL.CLUB, le club de course d’Aix-en-Provence. Trois minutes pour créer ton compte : ton QR, tes points et les avantages partenaires.",
  robots: { index: false, follow: false }
};

export default function MemberRegisterPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-[#1c0d0b]">
      <AccountHeader />

      <section className="relative isolate flex flex-1 items-center overflow-hidden px-5 py-14 sm:px-8 sm:py-16">
        {/* La photo passe en fond de page au lieu d'occuper une colonne :
            elle donne l'ambiance sans disputer la vedette a la carte. */}
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[50%_38%] opacity-[.22]"
          fill
          priority
          sizes="100vw"
          src="/assets/photos/coucher-soleil-calanques.webp"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_70%_10%,rgba(28,13,11,.55)_0%,rgba(28,13,11,.92)_62%,#1c0d0b_100%)]" />

        <RegisterView />
      </section>

      <div
        aria-label="Rejoins le club — Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux"
        className="marquee shrink-0 border-t-2 border-[#351815] bg-[#ffb000] py-4 text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d96ab4]"
        role="region"
        tabIndex={0}
      >
        <div aria-hidden="true" className="marquee-track font-mono text-xs font-black uppercase tracking-[.16em] sm:text-sm">
          <p className="shrink-0 whitespace-nowrap px-6">Rejoins le club — Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux&nbsp;&nbsp;—&nbsp;&nbsp;</p>
          <p className="shrink-0 whitespace-nowrap px-6">Rejoins le club — Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux&nbsp;&nbsp;—&nbsp;&nbsp;</p>
        </div>
      </div>
    </main>
  );
}
