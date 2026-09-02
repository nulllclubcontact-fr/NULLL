import { redirect } from "next/navigation";
import { ProfilForm } from "./ProfilForm";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export const metadata = { robots: { index: false, follow: false } };

export default async function MemberProfilPage() {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const { data: profil } = await supabase
    .from("profiles")
    .select("first_name,last_name,phone,birth_date,instagram_handle,emergency_contact_name,emergency_contact_phone,medical_notes")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <section className="shell grid max-w-3xl gap-8 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#351815]/55">Espace membre</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[.95]">
          Tes infos<span className="text-[#d96ab4]">.</span>
        </h1>
      </header>

      <ProfilForm
        email={user.email ?? ""}
        valeurs={{
          first_name: profil?.first_name ?? null,
          last_name: profil?.last_name ?? null,
          phone: profil?.phone ?? null,
          birth_date: profil?.birth_date ?? null,
          instagram_handle: profil?.instagram_handle ?? null,
          emergency_contact_name: profil?.emergency_contact_name ?? null,
          emergency_contact_phone: profil?.emergency_contact_phone ?? null,
          medical_notes: profil?.medical_notes ?? null
        }}
      />
    </section>
  );
}
