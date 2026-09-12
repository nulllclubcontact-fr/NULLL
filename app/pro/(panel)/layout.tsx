import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveProSession } from "../../../lib/pro/guard";
import { logoutPro } from "../actions";


// Espace protege : les donnees dependent de la session et de Supabase.
// Sans cette directive Next tente un prerendu au build, et une indisponibilite
// de Supabase fait echouer le deploiement entier.
export const dynamic = "force-dynamic";

export const metadata = { title: "Espace partenaire | NULLL.CLUB", robots: { index: false, follow: false } };

export default async function ProPanelLayout({ children }: { children: ReactNode }) {
  const session = await getActiveProSession();

  if (!session) {
    redirect("/pro/login");
  }

  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]">
      <header className="pro-header sticky top-0 z-50 border-b-2 border-[#773331] bg-[#F1EDE9]">
        <div className="shell flex flex-col gap-1 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
          <Link className="flex min-h-11 items-center gap-4 transition hover:text-[#EBA0CD]" href="/fr">
            <Image alt="NULLL.CLUB" className="h-auto w-36" height={313} priority src="/assets/nulll-new/logo-burgundy.png" width={2449} />
            <span className="hidden font-mono text-xs font-black uppercase sm:inline">Pro</span>
          </Link>
          <nav aria-label="Espace partenaire" className="flex w-full flex-wrap gap-2 pb-1 font-mono text-xs uppercase sm:w-auto sm:pb-0">
            <Link className="nav-link" href="/pro/scan">
              Scan
            </Link>
            <Link className="nav-link" href="/pro/stats">
              Stats
            </Link>
            <form action={logoutPro}>
              <button className="nav-link" type="submit">
                Se déconnecter
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main id="contenu">{children}</main>
    </div>
  );
}
