import { LoginForm } from "./LoginForm";
import { AccountShell } from "../../../components/account-shell";

export default function MemberLoginPage() {
  return (
    <AccountShell
      eyebrow="Espace membre"
      image="/assets/nulll-new/smile-sun.png"
      imageAlt="Ambiance membre NULLL.CLUB"
      intro="Tes points, ton palier, ton QR. Rien de magique. Juste ton compte et une raison de revenir."
      title="Reviens au reel."
    >
      <LoginForm />
    </AccountShell>
  );
}
