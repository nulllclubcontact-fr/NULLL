import { ProLoginForm } from "./ProLoginForm";
import { AccountShell } from "../../../components/account-shell";

export default function ProLoginPage() {
  return (
    <AccountShell
      eyebrow="Espace pro"
      image="/assets/nulll-new/pool-legs.png"
      imageAlt="Partenaire NULLL.CLUB"
      intro="Code fourni par NULLL. Pas d'inscription. Pas de blabla. Juste scanner, appliquer, crediter."
      title="Scan. Caisse. Points."
    >
      <ProLoginForm />
    </AccountShell>
  );
}
