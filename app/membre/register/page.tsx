import { RegisterForm } from "./RegisterForm";
import { AccountShell } from "../../../components/account-shell";

export default function MemberRegisterPage() {
  return (
    <AccountShell
      eyebrow="Inscription membre"
      intro="Un compte, un QR, des points. Trois minutes pour t’inscrire, et tu es des nôtres."
      title="Entre dans le club."
    >
      <RegisterForm />
    </AccountShell>
  );
}
