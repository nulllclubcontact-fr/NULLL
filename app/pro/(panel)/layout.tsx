import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProSession } from "../../../lib/pro/guard";

export default async function ProPanelLayout({ children }: { children: ReactNode }) {
  const session = await getProSession();

  if (!session) {
    redirect("/pro/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b-2 border-white bg-black">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="font-display text-4xl uppercase leading-none" href="/pro">
            NULLL.PRO
          </Link>
          <nav className="flex flex-wrap gap-2 font-mono text-xs uppercase">
            <Link className="nav-link" href="/pro">
              Pro
            </Link>
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
