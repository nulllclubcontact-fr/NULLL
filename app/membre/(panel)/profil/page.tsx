import { redirect } from "next/navigation";
import { ProfilForm } from "./ProfilForm";
import { sessionServeur } from "../../../../lib/supabase/server";

export const metadata = { title: "Mes infos | NULLL.CLUB", robots: { index: false, follow: false } };

export default async function MemberProfilPage() {
  // Une seule verification de session par requete : layout et page
  // partagent la meme (cache React) au lieu d'un aller-retour chacun.
  const session = await sessionServeur();

  if (!session?.user) {
    redirect("/membre/login");
  }

  const { supabase, user } = session;

  const { data: profil, error: erreurProfil } = await supabase
    .from("profiles")
    .select("first_name,last_name,phone,birth_date,instagram_handle,emergency_contact_name,emergency_contact_phone")
    .eq("id", user.id)
    .maybeSingle();

  // Une lecture en echec donnait un formulaire vide : l'enregistrer aurait
  // efface les informations du membre. On le dit, sans formulaire.
  if (erreurProfil) {
    return (
      <section className="shell grid max-w-3xl gap-6 py-8 lg:py-12">
        <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[1.04]">Tes infos.</h1>
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-bold" role="alert">
          Impossible de charger tes informations pour le moment. Réessaie dans un instant.
        </p>
      </section>
    );
  }

  return (
    <section className="shell grid max-w-3xl gap-8 py-8 lg:py-12">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#773331]">Espace membre</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] uppercase leading-[.95]">
          Tes infos<span className="text-[#EBA0CD]">.</span>
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
          emergency_contact_phone: profil?.emergency_contact_phone ?? null
        }}
      />
    </section>
  );
}
