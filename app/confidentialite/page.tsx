import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import { getSiteCopy } from "../../lib/site-content";

export const metadata = {
  title: "Politique de confidentialité | NULLL.CLUB",
  description:
    "Ce que NULLL.CLUB collecte, pourquoi, combien de temps, et comment exercer tes droits sur tes données.",
  robots: { index: true, follow: true }
};

const MAJ = "11 septembre 2026";

/**
 * Page redigee a partir de ce que le schema stocke reellement : la table
 * profiles, les commandes, les inscriptions aux sorties et le formulaire
 * de contact. Rien n'y est decrit qui n'existe pas dans la base.
 */
export default function ConfidentialitePage() {
  const copy = getSiteCopy("fr");

  return (
    <div className="min-h-dvh bg-[#F1EDE9] text-[#773331]">
      <SiteHeader copy={copy} current="confidentialite" locale="fr" pathname="/confidentialite" />

      <main className="mx-auto max-w-[900px] px-5 py-14 sm:px-8 sm:py-20" id="contenu" tabIndex={-1}>
        <p className="font-mono text-xs font-black uppercase tracking-[.16em]">
          Mise à jour du {MAJ}
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[1.04]">
          Politique de<br />
          {/* Bande calee sur la ligne de base plutot qu'un fond plein : a
              cet interlignage, la boite de la police deborde et le fond
              mordrait la ligne du dessus. Meme traitement que l'accueil. */}
          <span
            className="px-[.12em]"
            style={{
              backgroundImage: "linear-gradient(#EBA0CD,#EBA0CD)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% .95em",
              backgroundPosition: "0 100%",
              WebkitBoxDecorationBreak: "clone",
              boxDecorationBreak: "clone"
            }}
          >
            confidentialité.
          </span>
        </h1>

        <p className="mt-8 text-lg leading-relaxed">
          On ne revend rien, on ne piste personne, et on ne collecte que ce qui sert à te faire
          courir avec nous. Cette page dit précisément quoi, pourquoi, et pendant combien de temps.
        </p>

        <Bloc titre="Qui est responsable">
          <p>
            <strong>NULLL.CLUB</strong>, association déclarée régie par la loi du 1<sup>er</sup> juillet
            1901, créée le 10 juin 2026, dont le siège est au 2 rue de la Fourane, 13090
            Aix-en-Provence.
          </p>
          <p>
            SIREN 106 502 503, SIRET 106 502 503 00019, code APE 93.12Z (activités de clubs de
            sports). L’association n’est pas assujettie à la TVA.
          </p>
          <p>
            Pour toute question sur tes données, écris à{" "}
            <Lien href={`mailto:${copy.contact.email}`}>{copy.contact.email}</Lien>.
          </p>
        </Bloc>

        <Bloc titre="Ce qu’on collecte, et pourquoi">
          <Tableau
            lignes={[
              {
                quoi: "Nom, prénom, e-mail",
                pourquoi: "Créer ton compte membre et te reconnaître aux sorties",
                base: "Exécution du service que tu demandes"
              },
              {
                quoi: "Téléphone, date de naissance, Instagram, personne à prévenir et son numéro",
                pourquoi: "Facultatifs : te joindre, et prévenir quelqu’un si tu as un pépin pendant une sortie",
                base: "Consentement, en remplissant ces champs"
              },
              {
                quoi: "Un identifiant QR unique par inscription",
                pourquoi: "Valider ta présence à une sortie sans avoir à te demander ton nom",
                base: "Exécution du service que tu demandes"
              },
              {
                quoi: "Tes inscriptions aux sorties",
                pourquoi: "Savoir qui vient, et respecter la capacité annoncée",
                base: "Exécution du service que tu demandes"
              },
              {
                quoi: "Ton acceptation de la décharge",
                pourquoi: "Preuve que tu as pris connaissance des conditions de participation",
                base: "Obligation légale et intérêt légitime"
              },
              {
                quoi: "Nom, e-mail, téléphone, adresse de livraison",
                pourquoi: "Traiter une commande de merch, uniquement si tu en passes une",
                base: "Exécution du contrat de vente"
              },
              {
                quoi: "Le message envoyé par le formulaire de contact",
                pourquoi: "Te répondre",
                base: "Intérêt légitime"
              }
            ]}
          />
          <p>
            On ne collecte <strong>aucune donnée de santé</strong>, aucune performance sportive,
            aucun temps de course, et aucune position GPS.
          </p>
        </Bloc>

        <Bloc titre="Cookies">
          <p>
            Le site ne pose que des cookies nécessaires à son fonctionnement :
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              Les <strong>cookies de session</strong> qui te gardent connecté à ton compte membre. Ils
              sont posés pour 400 jours au maximum, la limite que les navigateurs appliquent
              désormais, et supprimés dès que tu te déconnectes.
            </li>
            <li>
              <code className="font-mono text-[.9em]">nulll_session_courte</code>, posé seulement si tu
              décoches « Se souvenir de moi » : il demande de fermer ta session avec le navigateur.
            </li>
            <li>
              <code className="font-mono text-[.9em]">nulll_pro_session</code>, réservé aux
              partenaires du club, valable <strong>12 heures</strong>.
            </li>
          </ul>
          <p>
            Ces cookies sont indispensables au service que tu demandes, ils sont donc{" "}
            <strong>exemptés de consentement</strong>. Il n’y a ni mesure d’audience, ni cookie
            publicitaire, ni bouton de réseau social qui te suivrait ailleurs.
          </p>
          <p>
            Le stockage local de ton navigateur retient aussi que tu as vu le bandeau
            d’information. Cette information ne quitte jamais ton appareil.
          </p>
        </Bloc>

        <Bloc titre="Qui d’autre y a accès">
          <p>
            Personne ne reçoit tes données à des fins commerciales. Ces prestataires les hébergent
            ou les transportent pour notre compte :
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Supabase</strong>, pour la base de données et les comptes, hébergés dans
              l’Union européenne (Paris).
            </li>
            <li>
              <strong>Google</strong>, seulement si tu choisis « Continuer avec Google » : il nous
              transmet ton nom et ton adresse e-mail pour créer ton compte.
            </li>
            <li>
              <strong>Vercel Inc.</strong>, pour l’hébergement du site.
            </li>
            <li>
              <strong>Resend</strong>, pour l’envoi des e-mails et des messages du formulaire de
              contact.
            </li>
          </ul>
          <p>
            Vercel, Resend et Google sont des sociétés établies aux États-Unis. Les transferts de données
            vers ces prestataires sont encadrés par les clauses contractuelles types de la
            Commission européenne et par le cadre de protection des données UE–États-Unis.
          </p>
        </Bloc>

        <Bloc titre="Combien de temps on les garde">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong>Ton compte et ton profil</strong> : tant que le compte existe, et effacés dès
              que tu le demandes. Un compte resté 3 ans sans aucune connexion est supprimé.
            </li>
            <li>
              <strong>Tes inscriptions aux sorties</strong> : 3 ans après la sortie concernée.
            </li>
            <li>
              <strong>Ton acceptation de la décharge</strong> : 10 ans, durée alignée sur le délai
              de prescription applicable en cas de dommage corporel.
            </li>
            <li>
              <strong>Les commandes</strong> : 10 ans, obligation comptable.
            </li>
            <li>
              <strong>Les messages du formulaire de contact</strong> : 1 an après notre réponse.
            </li>
          </ul>
        </Bloc>

        <Bloc titre="Comment on les protège">
          <p>
            Ton mot de passe n’est jamais stocké en clair : Supabase n’en conserve qu’une
            empreinte, et personne au club ne peut le lire. Le site est servi en HTTPS, l’accès à
            la base est restreint aux personnes qui en ont besoin, et ton identifiant QR est un
            jeton aléatoire qui ne peut pas être deviné à partir de ton nom.
          </p>
        </Bloc>

        <Bloc titre="Si tu as moins de 18 ans">
          <p>
            En France, un mineur de moins de 15 ans ne peut pas créer de compte sans l’accord d’un
            parent ou d’un tuteur. Si tu as moins de 15 ans, demande-leur avant de t’inscrire.
          </p>
          <p>
            Un parent peut à tout moment nous demander la suppression du compte de son enfant en
            écrivant à <Lien href={`mailto:${copy.contact.email}`}>{copy.contact.email}</Lien>.
          </p>
        </Bloc>

        <Bloc titre="Aucune décision automatisée">
          <p>
            Rien sur ce site ne prend de décision à ton sujet sans intervention humaine. Il n’y a
            ni profilage, ni score, ni classement automatique des membres.
          </p>
        </Bloc>

        <Bloc titre="Tes droits">
          <p>
            Tu peux à tout moment demander l’accès à tes données, leur rectification, leur
            effacement, leur portabilité, la limitation de leur traitement, ou t’opposer à un
            traitement. Écris à{" "}
            <Lien href={`mailto:${copy.contact.email}`}>{copy.contact.email}</Lien>, on répond sous
            un mois.
          </p>
          <p>
            Si la réponse ne te convient pas, tu peux saisir la CNIL :{" "}
            <Lien href="https://www.cnil.fr/fr/plaintes">cnil.fr/fr/plaintes</Lien>.
          </p>
        </Bloc>

        <Bloc titre="Si cette page change">
          <p>
            La date de mise à jour en haut fait foi. Si un changement touche à ce qu’on collecte ou
            à qui y a accès, on te préviendra par e-mail avant qu’il prenne effet.
          </p>
        </Bloc>

        <Link
          className="mt-14 inline-flex min-h-14 items-center border-2 border-[#773331] bg-[#FFB200] px-8 font-mono text-xs font-black uppercase tracking-[.12em] text-[#773331] transition-colors hover:bg-[#773331] hover:text-[#F1EDE9] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
          href="/fr"
        >
          Retour à l’accueil
        </Link>
      </main>

      <SiteFooter copy={copy} locale="fr" />
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 border-t-2 border-[#773331] pt-8">
      <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] uppercase leading-[1.1]">{titre}</h2>
      <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed">{children}</div>
    </section>
  );
}

function Lien({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="underline decoration-2 underline-offset-4 transition-colors hover:text-[#773331]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#773331]"
      href={href}
    >
      {children}
    </a>
  );
}

function Tableau({ lignes }: { lignes: Array<{ quoi: string; pourquoi: string; base: string }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-[.95rem]">
        <thead>
          <tr className="border-b-2 border-[#773331] font-mono text-xs font-black uppercase tracking-[.12em]">
            <th className="py-3 pr-4">Donnée</th>
            <th className="py-3 pr-4">Pourquoi</th>
            <th className="py-3">Base légale</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l) => (
            <tr className="border-b border-[#773331]/30 align-top" key={l.quoi}>
              <td className="py-4 pr-4 font-bold">{l.quoi}</td>
              <td className="py-4 pr-4">{l.pourquoi}</td>
              <td className="py-4 text-[#773331]">{l.base}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
