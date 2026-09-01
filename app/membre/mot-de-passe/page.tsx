import { PasswordForm } from "./PasswordForm";
import { AccountShell } from "../../../components/account-shell";

export const metadata = {
  title: "Nouveau mot de passe | NULLL.CLUB",
  robots: { index: false, follow: false }
};

export default function MemberPasswordPage() {
  return (
    <AccountShell
      eyebrow="Espace membre"
      image="/assets/photos/medaille-bouche.webp"
      imageAlt="Un membre de NULLL.CLUB mord sa médaille de finisher, la mer en arrière-plan"
      intro="Choisis-en un nouveau, et tu repars comme avant."
      ticker="Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux"
      title="Un nouveau"
      titleAccent="mot de passe."
    >
      <PasswordForm />
    </AccountShell>
  );
}
