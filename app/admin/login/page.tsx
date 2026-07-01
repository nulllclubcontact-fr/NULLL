import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "../../../components/account-shell";
import { getAdminSession } from "../../../lib/admin/guard";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  let session = null;

  try {
    session = await getAdminSession();
  } catch {
    session = null;
  }

  if (session) {
    redirect("/admin/partenaires");
  }

  return (
    <AccountShell
      eyebrow="Admin"
      image="/assets/nulll-new/run-finish.png"
      imageAlt="NULLL.CLUB admin access"
      intro="Un code serveur. Des partenaires. Rien de plus."
      title="Backdoor propre."
    >
      <div className="grid gap-4">
        <AdminLoginForm />
        <Link className="secondary-link" href="/">
          Retour site
        </Link>
      </div>
    </AccountShell>
  );
}
