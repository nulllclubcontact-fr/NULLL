import { redirect } from "next/navigation";
import { BienvenueForm } from "./BienvenueForm";
import { AccountShell } from "../../../components/account-shell";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { destinationMembre, sortieValide } from "../../../lib/races/sortie-choisie";

export const dynamic = "force-dynamic";

/**
 * Etape unique des comptes ouverts par Google ou Apple : verifier son nom
 * et signer la decharge. L'espace membre y renvoie tant que ce n'est pas fait.
 */
export default async function BienvenuePage({ searchParams }: { searchParams: Promise<{ sortie?: string }> }) {
  const { sortie } = await searchParams;
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login?erreur=config");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const { data: profil } = await supabase
    .from("profiles")
    .select("first_name,last_name,consent_waiver")
    .eq("id", user.id)
    .maybeSingle<{ first_name: string | null; last_name: string | null; consent_waiver: boolean | null }>();

  if (profil?.consent_waiver) {
    redirect(destinationMembre(sortie));
  }

  return (
    <AccountShell
      eyebrow="Dernière étape"
      image="/assets/photos/apres-course-sol.webp"
      imageAlt="Un membre de NULLL.CLUB assis au sol après une sortie, médaille de finisher et clés posées à côté de ses chaussures"
      imagePosition="50% 66%"
      intro="Ton compte est prêt. Vérifie ton nom pour ta carte de membre, accepte la décharge, et tu es des nôtres."
      ticker="Rejoins le club · Samedi 8h30 · Aix-en-Provence · Gratuit · Tous les niveaux"
      title="Bienvenue au"
      titleAccent="club."
    >
      <BienvenueForm nom={profil?.last_name ?? ""} prenom={profil?.first_name ?? ""} sortie={sortieValide(sortie) ? sortie : undefined} />
    </AccountShell>
  );
}
