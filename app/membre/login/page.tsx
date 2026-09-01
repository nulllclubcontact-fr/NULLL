import { LoginForm } from "./LoginForm";
import { AccountShell } from "../../../components/account-shell";

export default function MemberLoginPage() {
  return (
    <AccountShell
      eyebrow="Espace membre"
      image="/assets/photos/medaille-bouche.webp"
      imageAlt="Ambiance membre NULLL.CLUB"
      footerLink={{ label: "Pas encore de compte ?", href: "/membre/register", cta: "S’inscrire" }}
      intro="Tes points, ton palier, ton QR. Rien de magique. Juste ton compte et une raison de revenir."
      ticker="Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux"
      title="Reviens au reel."
    >
      <LoginForm />
    </AccountShell>
  );
}
