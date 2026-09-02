import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";


// Espace protege : les donnees dependent de la session et de Supabase.
// Sans cette directive Next tente un prerendu au build, et une indisponibilite
// de Supabase fait echouer le deploiement entier.
export const dynamic = "force-dynamic";

export default async function MemberPanelLayout({ children }: { children: ReactNode }) {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  return (
    <main className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-4 transition hover:text-[#b03583]" href="/fr">
            <Image alt="NULLL.CLUB" className="h-auto w-36" height={313} priority src="/assets/nulll-new/logo-burgundy.png" width={2449} />
            <span className="hidden font-mono text-xs font-black uppercase sm:inline">Membre</span>
          </Link>
          <nav className="flex w-full flex-nowrap gap-2 overflow-x-auto pb-1 font-mono text-xs uppercase sm:w-auto sm:pb-0">
            <Link className="nav-link" href="/membre">
              Accueil
            </Link>
            <Link className="nav-link" href="/membre/sorties">
              Mes sorties
            </Link>
            <Link className="nav-link" href="/membre/profil">
              Mon profil
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
