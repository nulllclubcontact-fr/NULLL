import { ProLoginForm } from "./ProLoginForm";
import { AccountShell } from "../../../components/account-shell";

export default function ProLoginPage() {
  return (
    <AccountShell
      benefits={[
        { label: "Scanner", text: "Le QR du membre, depuis ton téléphone. Aucune application à installer." },
        { label: "Appliquer", text: "L’avantage convenu avec le club, en une fois." },
        { label: "Suivre", text: "Le nombre de passages et ce qu’ils rapportent, visibles à tout moment." }
      ]}
      eyebrow="Espace pro"
      image="/assets/photos/runs-golden.webp"
      imageAlt="Deux membres de NULLL.CLUB courent au lever du soleil sur un chemin près d’Aix-en-Provence"
      intro="Code fourni par NULLL. Pas d'inscription. Pas de blabla. Juste scanner, appliquer, crediter."
      steps={["Ton code", "Le scan", "L’avantage"]}
      ticker="Partenaire NULLL.CLUB — Scanner — Appliquer — Créditer"
      title="Scan. Caisse."
      titleAccent="Points."
    >
      <ProLoginForm />
    </AccountShell>
  );
}
