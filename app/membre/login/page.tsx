import { LoginForm } from "./LoginForm";
import { AccountShell } from "../../../components/account-shell";

// /auth/callback renvoie ici quand le lien recu par mail ne vaut plus rien.
const MESSAGES_ERREUR: Record<string, string> = {
  lien: "Ce lien a expiré ou a déjà servi. Redemande-en un plus bas.",
  config: "Connexion indisponible pour le moment. Réessaie dans un instant."
};

// L'inscription renvoie ici quand Supabase demande une confirmation par
// e-mail : le compte existe, mais la session ne s'ouvrira qu'apres le clic.
const MESSAGES_INFO: Record<string, string> = {
  confirme: "Compte créé. Ouvre le mail qu’on vient de t’envoyer pour confirmer ton adresse, puis connecte-toi ici."
};

export default async function MemberLoginPage({
  searchParams
}: {
  searchParams: Promise<{ erreur?: string; message?: string }>;
}) {
  const { erreur, message } = await searchParams;
  const alerte = erreur ? MESSAGES_ERREUR[erreur] : undefined;
  const info = message ? MESSAGES_INFO[message] : undefined;

  return (
    <AccountShell
      eyebrow="Espace membre"
      image="/assets/photos/medaille-bouche.webp"
      imageAlt="Un membre de NULLL.CLUB mord sa médaille de finisher, la mer en arrière-plan"
      footerLink={{ label: "Pas encore de compte ?", href: "/membre/register", cta: "S’inscrire" }}
      intro="Tes points, ton palier, ton QR. Rien de magique. Juste ton compte et une raison de revenir."
      ticker="Samedi 8h30 — Aix-en-Provence — Gratuit — Tous les niveaux"
      title="Reviens dans le"
      titleAccent="club."
    >
      {alerte ? (
        <p
          className="mb-4 border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]"
          role="alert"
        >
          {alerte}
        </p>
      ) : null}

      {/* Une bonne nouvelle ne doit pas porter l'habit d'une erreur. */}
      {info ? (
        <p className="mb-4 border-2 border-[#f6eadf] bg-[#f6eadf]/10 px-4 py-3 text-sm font-bold leading-snug text-[#f6eadf]" role="status">
          {info}
        </p>
      ) : null}

      <LoginForm />
    </AccountShell>
  );
}
