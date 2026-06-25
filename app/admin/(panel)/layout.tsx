import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "../actions";
import { getAdminSession } from "../../../lib/admin/guard";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b-2 border-white bg-black">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="font-display text-4xl uppercase leading-none" href="/admin/partenaires">
            NULLL.ADMIN
          </Link>
          <nav className="flex flex-wrap gap-2 font-mono text-xs uppercase">
            <Link className="nav-link" href="/admin/partenaires">
              Partenaires
            </Link>
            <Link className="nav-link" href="/admin/fidelite">
              Fidelite
            </Link>
            <Link className="nav-link" href="/admin/kpi">
              KPI
            </Link>
            <form action={logoutAdmin}>
              <button className="nav-link" type="submit">
                Sortir
              </button>
            </form>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
