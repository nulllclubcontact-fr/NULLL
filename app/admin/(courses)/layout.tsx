import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../../../components/site-shell";
import { getSiteCopy } from "../../../lib/site-content";
import { requireAdminUser } from "../../../lib/admin/require-admin";
import { logoutMember } from "../../membre/actions";

export const dynamic = "force-dynamic";

const ONGLETS = [
  { href: "/admin/dashboard", label: "Vue d’ensemble" },
  { href: "/admin/courses", label: "Sorties" }
];

export default async function AdminCoursesLayout({ children }: { children: ReactNode }) {
  // Verifie a chaque requete, jamais deduit d'un cookie : un membre
  // ordinaire qui atteint l'URL repart vers son espace.
  const { prenom } = await requireAdminUser();

  return (
    <div className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      {/* Meme parti pris que l'espace membre : on garde la barre du site
          plutot qu'un bandeau a part, pour ne pas perdre la navigation en
          entrant dans l'administration. */}
      <SiteHeader
        compte={{ label: "Mon compte", href: "/membre" }}
        copy={getSiteCopy("fr")}
        current="identification"
        locale="fr"
        pathname="/admin"
      />

      {/* Sous-navigation rose : l'administration ne doit pas pouvoir etre
          confondue avec l'espace membre, qui porte le jaune. */}
      <div className="sticky top-20 z-40 border-b-2 border-[#351815] bg-[#d96ab4]">
        <div className="shell flex flex-wrap items-center gap-x-1 gap-y-2 py-2">
          <span className="mr-2 hidden font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#351815]/70 sm:inline">
            Admin
          </span>

          {ONGLETS.map((onglet) => (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-transparent px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition hover:border-[#351815] hover:bg-[#f6eadf] focus-visible:border-[#351815] focus-visible:bg-[#f6eadf] focus-visible:outline-none"
              href={onglet.href}
              key={onglet.href}
            >
              {onglet.label}
            </Link>
          ))}

          {/* Le scanner est l'outil du jour de course : il se distingue. */}
          <Link
            className="inline-flex min-h-11 items-center border-2 border-[#351815] bg-[#351815] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-[#f6eadf] transition hover:bg-[#ffb000] hover:text-[#351815]"
            href="/admin/scanner"
          >
            Scanner
          </Link>

          <Link
            className="inline-flex min-h-11 items-center border-2 border-transparent px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition hover:border-[#351815] hover:bg-[#f6eadf] focus-visible:border-[#351815] focus-visible:bg-[#f6eadf] focus-visible:outline-none"
            href="/membre"
          >
            {prenom ? `Espace de ${prenom}` : "Mon espace"}
          </Link>

          <form action={logoutMember} className="ml-auto">
            <button
              className="inline-flex min-h-11 items-center border-2 border-transparent px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition hover:border-[#351815] hover:bg-[#f6eadf] focus-visible:border-[#351815] focus-visible:bg-[#f6eadf] focus-visible:outline-none"
              type="submit"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {children}
      <SiteFooter copy={getSiteCopy("fr")} locale="fr" />
    </div>
  );
}
