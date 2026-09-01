import { RegisterForm } from "./RegisterForm";
import { AccountShell } from "../../../components/account-shell";

export default function MemberRegisterPage() {
  return (
    <AccountShell
      eyebrow="Inscription membre"
      image="/assets/photos/apres-course-sol.webp"
      imageAlt="Un membre de NULLL.CLUB assis au sol après une sortie, médaille de finisher et clés posées à côté de ses chaussures"
      imagePosition="50% 66%"
      footerLink={{ label: "Déjà un compte ?", href: "/membre/login", cta: "Se connecter" }}
      intro="Un compte, un QR, des points. Trois minutes pour t’inscrire, et tu es des nôtres."
      steps={["Tes infos", "La décharge", "Ton QR"]}
      ticker="Rejoins le club — Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux"
      title="Entre dans le"
      titleAccent="club."
    >
      <RegisterForm />
    </AccountShell>
  );
}
