import { ProLoginForm } from "./ProLoginForm";

export const metadata = { title: "Connexion partenaire | Nulll Club", robots: { index: false, follow: false } };
import { AccountShell } from "../../../components/account-shell";

export default function ProLoginPage() {
  return (
    <AccountShell
      benefits={[
        { label: "Ton code", text: "Fourni par le club. Aucune application à installer." },
        { label: "Tes chiffres", text: "Les passages des membres et ce qu’ils rapportent, visibles à tout moment." },
        { label: "Le club", text: "Un contact direct avec Nulll Club pour faire vivre le partenariat." }
      ]}
      eyebrow="Espace pro"
      image="/assets/photos/runs-golden.webp"
      imageAlt="Deux membres de Nulll Club courent au lever du soleil sur un chemin près d’Aix-en-Provence"
      intro="Code fourni par NULLL. Pas d’inscription, pas de blabla : juste ton espace partenaire."
      steps={["Ton code", "Ton espace"]}
      ticker="Partenaires Nulll Club"
      title="Espace"
      titleAccent="partenaire."
    >
      <ProLoginForm />
    </AccountShell>
  );
}
