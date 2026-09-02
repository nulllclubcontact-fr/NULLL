import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader, SiteFooter } from "../../../components/site-shell";
import { getSiteCopy } from "../../../lib/site-content";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { logoutMember } from "../actions";

// Espace protege : les donnees dependent de la session et de Supabase.
// Sans cette directive Next tente un prerendu au build, et une
// indisponibilite de Supabase fait echouer le deploiement entier.
export const dynamic = "force-dynamic";

const ONGLETS = [
  { href: "/membre", label: "Accueil" },
  { href: "/membre/sorties", label: "Mes sorties" },
  { href: "/membre/profil", label: "Mon profil" }
];

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

  const { data: profil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: string | null }>();

  return (
    <div className="min-h-dvh bg-[#f6eadf] text-[#351815]">
      {/* L'espace membre avait son propre bandeau, qui remplacait la barre
          du site : on perdait la navigation en entrant dans son compte.
          On garde desormais la vraie barre, avec « Mon compte » a la place
          de « S'identifier ». */}
      <SiteHeader
        compte={{ label: "Mon compte", href: "/membre" }}
        copy={getSiteCopy("fr")}
        current="identification"
        locale="fr"
        pathname="/membre"
      />

      {/* Sous-navigation de l'espace, en jaune : on voit d'un coup d'oeil
          qu'on a change de territoire. */}
      <div className="sticky top-20 z-40 border-b-2 border-[#351815] bg-[#ffb000]">
        <div className="shell flex flex-wrap items-center gap-x-1 gap-y-2 py-2">
          {ONGLETS.map((onglet) => (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-transparent px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition hover:border-[#351815] hover:bg-[#f6eadf] focus-visible:border-[#351815] focus-visible:bg-[#f6eadf] focus-visible:outline-none"
              href={onglet.href}
              key={onglet.href}
            >
              {onglet.label}
            </Link>
          ))}

          {profil?.role === "admin" ? (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-[#351815] bg-[#351815] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-[#f6eadf] transition hover:bg-[#d96ab4] hover:text-[#351815]"
              href="/admin/dashboard"
            >
              Administration
            </Link>
          ) : null}

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
