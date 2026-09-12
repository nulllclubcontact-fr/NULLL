import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader, SiteFooter } from "../../../components/site-shell";
import { getSiteCopy } from "../../../lib/site-content";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { logoutMember } from "../actions";
import { InvitationProfil } from "../../../components/membre/invitation-profil";

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
    .select("role,consent_waiver,first_name,invitation_profil_vue")
    .eq("id", user.id)
    .maybeSingle<{ role: string | null; consent_waiver: boolean | null; first_name: string | null; invitation_profil_vue: boolean | null }>();

  // Un compte ouvert par Google ou Apple n'a pas signe la decharge : il la
  // signe avant d'acceder a quoi que ce soit, QR compris.
  if (!profil?.consent_waiver) {
    redirect("/membre/bienvenue");
  }

  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]">
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
      <div className="sticky top-20 z-40 border-b-2 border-[#773331] bg-[#FFB200]">
        <div className="shell flex flex-wrap items-center gap-x-1 gap-y-2 py-2">
          {ONGLETS.map((onglet) => (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-transparent px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition hover:border-[#773331] hover:bg-[#F1EDE9] focus-visible:border-[#773331] focus-visible:bg-[#F1EDE9] focus-visible:outline-none"
              href={onglet.href}
              key={onglet.href}
            >
              {onglet.label}
            </Link>
          ))}

          {profil?.role === "admin" ? (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-[#773331] bg-[#773331] px-3 font-mono text-xs font-black uppercase tracking-[.1em] text-[#F1EDE9] transition hover:bg-[#EBA0CD] hover:text-[#773331]"
              href="/admin/dashboard"
            >
              Administration
            </Link>
          ) : null}

          <form action={logoutMember} className="ml-auto">
            <button
              className="inline-flex min-h-11 items-center border-2 border-transparent px-3 font-mono text-xs font-black uppercase tracking-[.1em] transition hover:border-[#773331] hover:bg-[#F1EDE9] focus-visible:border-[#773331] focus-visible:bg-[#F1EDE9] focus-visible:outline-none"
              type="submit"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <main id="contenu">
        {/* Premiere connexion : une seule fois, facultative (decision du 12/09/2026). */}
        {profil?.invitation_profil_vue === false ? <InvitationProfil prenom={profil.first_name} /> : null}
        {children}
      </main>
      <SiteFooter copy={getSiteCopy("fr")} locale="fr" />
    </div>
  );
}
