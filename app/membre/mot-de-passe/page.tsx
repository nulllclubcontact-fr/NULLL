import Link from "next/link";
import { PasswordForm } from "./PasswordForm";
import { AccountShell } from "../../../components/account-shell";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export const metadata = {
  title: "Nouveau mot de passe | NULLL.CLUB",
  robots: { index: false, follow: false }
};

// La session de recuperation se lit a chaque arrivee : rien a mettre en cache.
export const dynamic = "force-dynamic";

/**
 * Sans session de recuperation valide (lien expire, deja utilise, ouvert
 * dans un autre navigateur), le formulaire ne servait a rien : l'erreur ne
 * tombait qu'apres la saisie. On le dit des l'arrivee.
 */
export default async function MemberPasswordPage() {
  let connecte = false;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    connecte = Boolean(user);
  } catch {
    connecte = false;
  }

  return (
    <AccountShell
      benefits={[]}
      eyebrow="Espace membre"
      image="/assets/photos/medaille-bouche.webp"
      imageAlt="Un membre de NULLL.CLUB mord sa médaille de finisher, la mer en arrière-plan"
      intro={connecte ? "Choisis-en un nouveau, et tu repars comme avant." : "Ce lien n’est plus valable. Demande un nouveau lien pour changer ton mot de passe."}
      ticker="Un nouveau mot de passe"
      title="Un nouveau"
      titleAccent="mot de passe."
    >
      {connecte ? (
        <PasswordForm />
      ) : (
        <div className="panel panel-grid grid gap-4 p-5 sm:p-6">
          <p className="font-bold leading-snug">Pour ta sécurité, un lien de réinitialisation ne sert qu’une fois et pour peu de temps.</p>
          <Link className="primary-link" href="/membre/login">
            Demander un nouveau lien
          </Link>
        </div>
      )}
    </AccountShell>
  );
}
