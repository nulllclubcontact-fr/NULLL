import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

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
    <main className="min-h-screen bg-[#f6eadf] text-[#351815]">
      <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-4 transition hover:text-[#d96ab4]" href="/fr">
            <Image alt="NULLL.CLUB" className="h-auto w-36" height={157} priority src="/assets/nulll-new/logo-burgundy.png" width={1225} />
            <span className="hidden font-mono text-xs font-black uppercase sm:inline">Membre</span>
          </Link>
          <nav className="flex flex-wrap gap-2 font-mono text-xs uppercase">
            <Link className="nav-link" href="/membre">
              Dashboard
            </Link>
            <Link className="nav-link" href="/membre/qr">
              QR
            </Link>
            <Link className="nav-link" href="/membre/historique">
              Historique
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
