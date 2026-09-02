import { isAdminUser } from "../../../../../../lib/admin/require-admin";

type Ligne = {
  status: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
  profiles: { first_name: string | null; last_name: string | null; email: string | null; phone: string | null } | null;
};

/** Echappement CSV : guillemets doubles, et champ entoure des que necessaire. */
function champ(valeur: string | null | undefined) {
  const texte = valeur ?? "";
  return /[";\n]/.test(texte) ? `"${texte.replace(/"/g, '""')}"` : texte;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await isAdminUser();

  if (!admin) {
    return new Response("Accès refusé", { status: 403 });
  }

  const { data: course } = await admin.supabase
    .from("races")
    .select("title,slug,start_datetime")
    .eq("id", id)
    .maybeSingle<{ title: string; slug: string; start_datetime: string }>();

  if (!course) {
    return new Response("Sortie introuvable", { status: 404 });
  }

  const { data } = await admin.supabase
    .from("race_registrations")
    .select("status,checked_in,checked_in_at,created_at,profiles(first_name,last_name,email,phone)")
    .eq("race_id", id)
    .order("created_at", { ascending: true })
    .returns<Ligne[]>();

  // Point-virgule : Excel en francais ouvre les fichiers a la virgule dans
  // une seule colonne.
  const lignes = [["Prenom", "Nom", "Email", "Telephone", "Statut", "Present", "Scanne a", "Inscrit le"].join(";")];

  for (const l of data ?? []) {
    lignes.push(
      [
        champ(l.profiles?.first_name),
        champ(l.profiles?.last_name),
        champ(l.profiles?.email),
        champ(l.profiles?.phone),
        champ(l.status),
        l.checked_in ? "oui" : "non",
        champ(l.checked_in_at),
        champ(l.created_at)
      ].join(";")
    );
  }

  // BOM UTF-8 : sans lui Excel affiche « Prenom » avec des accents casses.
  const corps = "﻿" + lignes.join("\r\n");

  return new Response(corps, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${course.slug}-inscrits.csv"`,
      "Cache-Control": "no-store"
    }
  });
}
