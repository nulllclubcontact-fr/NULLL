import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProSession } from "../../../lib/pro/guard";

export default async function ProPanelLayout({ children }: { children: ReactNode }) {
  const session = await getProSession();

  if (!session) {
    redirect("/pro/login");
  }

  return (
    <main className="min-h-screen bg-[#f6eadf] text-[#351815]">
      <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-4 transition hover:text-[#d96ab4]" href="/fr">
            <Image alt="NULLL.CLUB" className="h-auto w-36" height={157} priority src="/assets/nulll-new/logo-burgundy.png" width={1225} />
            <span className="hidden font-mono text-xs font-black uppercase sm:inline">Pro</span>
          </Link>
          <nav className="flex flex-wrap gap-2 font-mono text-xs uppercase">
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
