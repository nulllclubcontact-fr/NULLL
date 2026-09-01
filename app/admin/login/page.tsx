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
      benefits={[
        { label: "Partenaires", text: "Créer, activer et révoquer les accès des commerçants." },
        { label: "Fidélité", text: "Les paliers, les points et les passages, au même endroit." },
        { label: "Chiffres", text: "Ce que le club génère, sans tableur." }
      ]}
      eyebrow="Admin"
      image="/assets/photos/runners-aix.webp"
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
