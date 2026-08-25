import { RegisterForm } from "./RegisterForm";
import { AccountShell } from "../../../components/account-shell";

export default function MemberRegisterPage() {
  return (
    <AccountShell
      eyebrow="Inscription membre"
      image="/assets/photos/editorial-glasses.webp"
      imageAlt="Lifestyle NULLL.CLUB"
      intro="Un compte. Un QR bientot. Des points qui ne dorment pas."
      title="Entre dans le club."
    >
      <RegisterForm />
    </AccountShell>
  );
}
