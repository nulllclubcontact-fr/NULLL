import { RegisterForm } from "./RegisterForm";
import { AccountShell } from "../../../components/account-shell";
import { fournisseursAuth } from "../../../lib/auth/reglages";
import { sortieValide, suiteSortie } from "../../../lib/races/sortie-choisie";

export default async function MemberRegisterPage({ searchParams }: { searchParams: Promise<{ sortie?: string }> }) {
  const [{ sortie }, fournisseurs] = await Promise.all([searchParams, fournisseursAuth()]);

  return (
    <AccountShell
      eyebrow="Inscription membre"
      image="/assets/photos/apres-course-sol.webp"
      imageAlt="Un membre de NULLL.CLUB assis au sol après une sortie, médaille de finisher et clés posées à côté de ses chaussures"
      imagePosition="50% 66%"
      footerLink={{ label: "Déjà un compte ?", href: `/membre/login${suiteSortie(sortie)}`, cta: "Se connecter" }}
      intro="Crée ton compte, choisis une sortie et retrouve son QR. Trois minutes, et tu es des nôtres."
      steps={["Tes infos", "La décharge", "Ta sortie"]}
      ticker="Rejoins le club · Samedi 8h30 · Aix-en-Provence · Gratuit · Tous les niveaux"
      title="Entre dans le"
      titleAccent="club."
    >
      <RegisterForm fournisseurs={fournisseurs} sortie={sortieValide(sortie) ? sortie : undefined} />
    </AccountShell>
  );
}
