import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { requireAdminUser } from "../../../lib/admin/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminCoursesLayout({ children }: { children: ReactNode }) {
  // Verifie a chaque requete, jamais deduit d'un cookie : un membre
  // ordinaire qui atteint l'URL repart vers son espace.
  const { prenom } = await requireAdminUser();

  return (
    <main className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      <header className="sticky top-0 z-50 border-b-2 border-[#351815] bg-[#f6eadf]">
        <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link className="flex items-center gap-4 transition hover:text-[#d96ab4]" href="/admin/dashboard">
            <Image alt="NULLL.CLUB" className="h-auto w-32" height={313} priority src="/assets/nulll-new/logo-burgundy.png" width={2449} />
            <span className="font-mono text-xs font-black uppercase">Courses</span>
          </Link>

          <nav className="flex w-full flex-nowrap gap-2 overflow-x-auto pb-1 font-mono text-xs uppercase lg:w-auto lg:pb-0">
            <Link className="nav-link" href="/admin/dashboard">
              Vue d’ensemble
            </Link>
            <Link className="nav-link" href="/admin/courses">
              Sorties
            </Link>
            {/* Le scanner passe en premier plan sur mobile : c'est l'outil
                du jour de course, et il se tient a bout de bras. */}
            <Link className="nav-link border-[#351815] bg-[#ffb000]" href="/admin/scanner">
              Scanner
            </Link>
            <Link className="nav-link" href="/membre">
              {prenom ? `Espace de ${prenom}` : "Mon espace"}
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
