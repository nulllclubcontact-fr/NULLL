import { redirect } from "next/navigation";

// L'ancien panneau a code partage a disparu : l'administration passe par un
// compte Supabase de role admin, verifie a chaque requete.
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
