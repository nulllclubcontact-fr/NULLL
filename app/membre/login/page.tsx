import { LoginForm } from "./LoginForm";
import { AccountShell } from "../../../components/account-shell";

const MESSAGES_ERREUR: Record<string, string> = {
  lien: "Ce lien a expiré ou a déjà servi. Redemande-en un plus bas.",
  config: "Connexion indisponible pour le moment. Réessaie dans un instant."
};

export default async function MemberLoginPage({
  searchParams
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  // /auth/callback renvoie ici quand le lien recu par mail ne vaut plus
  // rien. Sans ce message, le visiteur retombait sur le formulaire sans
  // savoir pourquoi son lien n'avait pas marche.
  const message = erreur ? MESSAGES_ERREUR[erreur] : undefined;

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
      {message ? (
        <p
          className="mb-4 border-2 border-[#351815] bg-[#ffb000] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]"
          role="alert"
        >
          {message}
        </p>
      ) : null}
      <LoginForm />
    </AccountShell>
  );
}
