import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "../../../lib/admin/guard";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/partenaires");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="shell grid min-h-screen content-center gap-8 py-10">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Admin</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Backdoor propre.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/72">Un code serveur. Des partenaires. Rien de plus.</p>
        </div>

        <AdminLoginForm />

        <Link className="secondary-link max-w-xl" href="/">
          Retour site
        </Link>
      </section>
    </main>
  );
}
