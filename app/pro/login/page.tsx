import { ProLoginForm } from "./ProLoginForm";

export const metadata = { title: "Connexion partenaire | NULLL.CLUB", robots: { index: false, follow: false } };
import { AccountShell } from "../../../components/account-shell";

export default function ProLoginPage() {
  return (
    <AccountShell
      benefits={[
        { label: "Ton code", text: "Fourni par le club. Aucune application à installer." },
        { label: "Tes chiffres", text: "Les passages des membres et ce qu’ils rapportent, visibles à tout moment." },
        { label: "Le club", text: "Un contact direct avec NULLL.CLUB pour faire vivre le partenariat." }
      ]}
      eyebrow="Espace pro"
      image="/assets/photos/runs-golden.webp"
      imageAlt="Deux membres de NULLL.CLUB courent au lever du soleil sur un chemin près d’Aix-en-Provence"
      intro="Code fourni par NULLL. Pas d’inscription, pas de blabla : juste ton espace partenaire."
      steps={["Ton code", "Ton espace"]}
      ticker="Partenaires NULLL.CLUB"
      title="Espace"
      titleAccent="partenaire."
    >
      <ProLoginForm />
    </AccountShell>
  );
}
