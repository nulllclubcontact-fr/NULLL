import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../../../components/site-shell";
import { getSiteCopy } from "../../../lib/site-content";
import { requireAdminUser } from "../../../lib/admin/require-admin";
import { logoutMember } from "../../membre/actions";
import { OngletsAdmin } from "../../../components/admin/onglets-admin";

export const dynamic = "force-dynamic";


export default async function AdminCoursesLayout({ children }: { children: ReactNode }) {
  // Verifie a chaque requete, jamais deduit d'un cookie : un membre
  // ordinaire qui atteint l'URL repart vers son espace.
  const { prenom } = await requireAdminUser();

  return (
    <div className="da da-admin min-h-dvh bg-[#141116] text-white">
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

      {/* Sous-navigation de l'admin : sobre, l'onglet en cours en rose. */}
      <div className="panel-navigation sticky top-20 z-40 border-b border-white/10 bg-[#1E1A21]">
        <div className="shell flex flex-wrap items-center gap-x-1 gap-y-2 py-2">
          <span className="mr-3 hidden text-[13px] font-bold uppercase tracking-[.12em] text-white/50 sm:inline">Admin</span>
          <OngletsAdmin />
          <Link className="inline-flex min-h-10 items-center rounded-[2px] px-3 text-[13px] font-bold uppercase tracking-[.08em] text-white/75 transition-colors hover:bg-white/10 hover:text-white" href="/membre">
            <span className="sm:hidden">Mon espace</span>
            <span className="hidden sm:inline">{prenom ? `Espace de ${prenom}` : "Mon espace"}</span>
          </Link>
          <form action={logoutMember} className="ml-auto">
            <button className="inline-flex min-h-10 items-center rounded-[2px] px-3 text-[13px] font-bold uppercase tracking-[.08em] text-white/75 transition-colors hover:bg-white/10 hover:text-white" type="submit">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <main id="contenu">{children}</main>
      <SiteFooter copy={getSiteCopy("fr")} locale="fr" />
    </div>
  );
}
