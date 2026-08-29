import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProSession } from "../../../lib/pro/guard";


// Espace protege : les donnees dependent de la session et de Supabase.
// Sans cette directive Next tente un prerendu au build, et une indisponibilite
// de Supabase fait echouer le deploiement entier.
export const dynamic = "force-dynamic";

export default async function ProPanelLayout({ children }: { children: ReactNode }) {
  const session = await getProSession();

  if (!session) {
    redirect("/pro/login");
  }

  return (
    <main className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-4 transition hover:text-[#d96ab4]" href="/fr">
            <Image alt="NULLL.CLUB" className="h-auto w-36" height={313} priority src="/assets/nulll-new/logo-burgundy.png" width={2449} />
            <span className="hidden font-mono text-xs font-black uppercase sm:inline">Pro</span>
          </Link>
          <nav className="flex w-full flex-nowrap gap-2 overflow-x-auto pb-1 font-mono text-xs uppercase sm:w-auto sm:pb-0">
            <Link className="nav-link" href="/pro/scan">
              Scan
            </Link>
            <Link className="nav-link" href="/pro/stats">
              Stats
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
