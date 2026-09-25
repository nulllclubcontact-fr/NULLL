import { redirect } from "next/navigation";
import { AccountShell } from "../../../components/account-shell";
import { niveauVerification } from "../../../lib/admin/require-admin";
import { sessionServeur } from "../../../lib/supabase/server";
import { VerificationForm } from "./VerificationForm";

export const metadata = { title: "Vérification | NULLL.CLUB", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Deuxieme porte de l'administration : le compte a un facteur TOTP
 * verifie, la session n'a que le mot de passe. Hors du groupe (courses),
 * dont le layout renverrait ici en boucle.
 */
export default async function AdminVerificationPage() {
  const session = await sessionServeur();

  if (!session?.user) {
    redirect("/membre/login");
  }

  const { data: profil } = await session.supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle<{ role: string | null }>();

  if (profil?.role !== "admin") {
    redirect("/membre");
  }

  if ((await niveauVerification(session.supabase)) !== "a-passer") {
    redirect("/admin/dashboard");
  }

  return (
    <AccountShell
      eyebrow="Administration"
      intro="Ton compte admin a la double vérification. Ouvre ton application d’authentification et entre le code à six chiffres."
      title="Deuxième"
      titleAccent="vérification."
    >
      <VerificationForm />
    </AccountShell>
  );
}
