import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "../actions";
import { getAdminSession } from "../../../lib/admin/guard";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  let session = null;

  try {
    session = await getAdminSession();
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f6eadf] text-[#351815]">
      <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-4 transition hover:text-[#d96ab4]" href="/fr">
            <Image alt="NULLL.CLUB" className="h-auto w-36" height={157} priority src="/assets/nulll-new/logo-burgundy.png" width={1225} />
            <span className="hidden font-mono text-xs font-black uppercase sm:inline">Admin</span>
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
