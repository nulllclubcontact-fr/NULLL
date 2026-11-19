"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ONGLETS = [
  { href: "/admin/dashboard", label: "Vue d’ensemble" },
  { href: "/admin/courses", label: "Sorties" },
  { href: "/admin/reseau", label: "Partenaires" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/equipe", label: "Équipe" },
  { href: "/admin/securite", label: "Sécurité" }
];

const ONGLET = "inline-flex min-h-10 items-center rounded-[2px] px-3 text-[13px] font-bold uppercase tracking-[.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC531]";

/** Onglets de l'admin : l'onglet de la page en cours est surligne en rose. */
export function OngletsAdmin() {
  const chemin = usePathname();
  return (
    <>
      {ONGLETS.map((onglet) => {
        const actif = chemin === onglet.href || chemin.startsWith(`${onglet.href}/`);
        return (
          <Link aria-current={actif ? "page" : undefined} className={`${ONGLET} ${actif ? "bg-[#E8459E] text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`} href={onglet.href} key={onglet.href}>
            {onglet.label}
          </Link>
        );
      })}
      <Link className={`${ONGLET} bg-[#FFC531] text-[#141116] hover:bg-white`} href="/admin/scanner">
        Scanner
      </Link>
    </>
  );
}
