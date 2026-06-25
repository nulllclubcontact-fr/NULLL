import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export default async function MemberPanelLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b-2 border-white bg-black">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="font-display text-4xl uppercase leading-none" href="/membre">
            NULLL.MEMBRE
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
