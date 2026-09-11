import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "../../../../../lib/admin/require-admin";
import { getAdminPartner, listAdminPartnerSales, summarizePartnerSales } from "../../../../../lib/admin/repo";
import { formatEuro, formatHeure, formatJourCourt } from "../../../../../components/races/format";
import { BarresClassement, ColonnesParJour, Etiquette, Intitule, Tuiles, fenetreJours } from "../../../../../components/admin/graphiques";
import { NouveauCodeForm, SuppressionPartenaire } from "../../../../../components/admin/formulaires-partenaire";
import { basculerPartenaire } from "../../../reseau-actions";

export const metadata = { robots: { index: false, follow: false } };

const CLE_MOIS = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" });
const JOUR_SEMAINE = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" });
const DEPUIS = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });

const SEMAINE = [
  ["Mon", "Lundi"],
  ["Tue", "Mardi"],
  ["Wed", "Mercredi"],
  ["Thu", "Jeudi"],
  ["Fri", "Vendredi"],
  ["Sat", "Samedi"],
  ["Sun", "Dimanche"]
] as const;

// Le mois precedent se deduit de la cle parisienne, jamais de l'horloge du
// serveur : a minuit le 1er, Paris et UTC ne sont pas dans le meme mois.
function moisCourantEtPrecedent() {
  const courant = CLE_MOIS.format(new Date());
  const [annee, mois] = courant.split("-").map(Number);
  const precedent = mois === 1 ? `${annee - 1}-12` : `${annee}-${String(mois - 1).padStart(2, "0")}`;
  return { courant, precedent };
}

function pourcentage(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

function nomMembre(profil: { first_name: string | null; last_name: string | null } | null) {
  const prenom = profil?.first_name?.trim() || "Membre";
  const initiale = profil?.last_name?.trim()?.[0];
  return initiale ? `${prenom} ${initiale.toUpperCase()}.` : prenom;
}

export default async function AdminPartenairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminUser();

  const partenaire = await getAdminPartner(id);
  if (!partenaire) {
    notFound();
  }

  const ventes = await listAdminPartnerSales(id);
  const resume = summarizePartnerSales(ventes);

  const { courant, precedent } = moisCourantEtPrecedent();
  let chiffreMois = 0;
  let chiffreMoisPrecedent = 0;
  const parJourSemaine = new Map<string, number>();
  const parClient = new Map<string, { nom: string; achats: number; total: number }>();
  const fenetre = fenetreJours(30);

  for (const vente of ventes) {
    const montant = Number(vente.amount_eur);
    const date = new Date(vente.created_at);
    const mois = CLE_MOIS.format(date);
    if (mois === courant) chiffreMois += montant;
    if (mois === precedent) chiffreMoisPrecedent += montant;

    const jour = JOUR_SEMAINE.format(date);
    parJourSemaine.set(jour, (parJourSemaine.get(jour) ?? 0) + 1);

    const client = parClient.get(vente.member_id) ?? { nom: nomMembre(vente.profiles), achats: 0, total: 0 };
    client.achats += 1;
    client.total += montant;
    parClient.set(vente.member_id, client);

    fenetre.ajouter(vente.created_at, montant);
  }

  const chiffre30 = fenetre.jours.reduce((s, j) => s + j.total, 0);
  const variation =
    chiffreMoisPrecedent > 0
      ? `${chiffreMois >= chiffreMoisPrecedent ? "+" : "−"}${Math.abs(pourcentage(chiffreMois - chiffreMoisPrecedent, chiffreMoisPrecedent))} % vs mois dernier`
      : chiffreMois > 0
        ? "rien le mois dernier"
        : "rien ce mois-ci";

  const meilleursClients = [...parClient.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 5);

  const codesActifs = partenaire.partner_access_codes.filter((c) => c.active).length;
  const derniereConnexion = partenaire.partner_access_codes
    .map((c) => c.last_used_at)
    .filter((d): d is string => d !== null)
    .sort()
    .at(-1);

  return (
    <section className="shell grid gap-12 py-8 lg:py-12">
      <header>
        <Link className="font-mono text-xs font-black uppercase tracking-[.14em] hover:underline hover:decoration-[#EBA0CD] hover:decoration-2" href="/admin/reseau">
          ← Tous les partenaires
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
            {partenaire.name}
            <span className="text-[#EBA0CD]">.</span>
          </h1>
          {partenaire.active ? <Etiquette teinte="bordeaux">Actif</Etiquette> : <Etiquette pointillee teinte="creme">Désactivé</Etiquette>}
        </div>
        <p className="mt-4 font-mono text-xs font-black uppercase tracking-[.12em]">
          Partenaire depuis le {DEPUIS.format(new Date(partenaire.created_at))}
          {" · "}
          {partenaire.contact_email ? (
            <a className="underline decoration-[#EBA0CD] decoration-2 underline-offset-4" href={`mailto:${partenaire.contact_email}`}>
              {partenaire.contact_email}
            </a>
          ) : (
            "pas de contact"
          )}
        </p>
      </header>

      <Tuiles
        tuiles={[
          { label: "CA généré", valeur: formatEuro(resume.revenue), detail: "depuis le début", teinte: "bordeaux" },
          { label: "Ce mois-ci", valeur: formatEuro(chiffreMois), detail: variation, teinte: "rose" },
          {
            label: "QR scannés",
            valeur: resume.count,
            detail: resume.lastSaleAt ? `dernier le ${formatJourCourt(resume.lastSaleAt)}` : "aucune vente",
            teinte: "jaune"
          },
          {
            label: "Membres clients",
            valeur: resume.clients,
            detail: `${pourcentage(resume.returningClients, resume.clients)} % sont revenus`,
            teinte: "creme",
            jauge: pourcentage(resume.returningClients, resume.clients)
          },
          { label: "Panier moyen", valeur: formatEuro(resume.averageBasket), detail: "par vente scannée", teinte: "creme" },
          { label: "Points distribués", valeur: resume.points, detail: "aux membres", teinte: "creme" }
        ]}
      />

      <div className="grid gap-12 xl:grid-cols-[1.3fr_1fr]">
        <div>
          <Intitule>CA · 30 derniers jours</Intitule>
          <ColonnesParJour description={`${formatEuro(chiffre30)} sur les 30 derniers jours`} formater={formatEuro} jours={fenetre.jours} />
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
            {chiffre30 === 0 ? "Aucune vente sur la période" : `${formatEuro(chiffre30)} · aujourd’hui en jaune · survole une colonne`}
          </p>
        </div>

        <div>
          <Intitule>Jours où les membres viennent</Intitule>
          <BarresClassement
            lignes={
              ventes.length === 0
                ? []
                : SEMAINE.map(([cle, nom]) => {
                    const n = parJourSemaine.get(cle) ?? 0;
                    return { cle, titre: nom, valeur: n, texte: `${n} vente${n > 1 ? "s" : ""}` };
                  })
            }
            vide="Pas encore de vente pour dégager une tendance."
          />
        </div>
      </div>

      <div className="grid gap-12 xl:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-12">
          <div>
            <Intitule>Meilleurs clients</Intitule>
            <BarresClassement
              lignes={meilleursClients.map(([membre, c]) => ({
                cle: membre,
                titre: c.nom,
                valeur: c.total,
                texte: `${formatEuro(c.total)} · ${c.achats} achat${c.achats > 1 ? "s" : ""}`
              }))}
              vide="Aucun membre n’a encore acheté ici."
            />
          </div>

          <div>
            <Intitule>Accès à l’espace pro</Intitule>
            <div className="mt-5 grid gap-3 border-2 border-[#773331] p-5">
              <p className="flex items-center justify-between gap-4 font-mono text-xs font-black uppercase tracking-[.1em]">
                Codes actifs <span>{codesActifs}</span>
              </p>
              <p className="flex items-center justify-between gap-4 font-mono text-xs font-black uppercase tracking-[.1em]">
                Dernière connexion
                <span className={derniereConnexion ? "" : "bg-[#FFB200] px-2 py-1"}>{derniereConnexion ? formatJourCourt(derniereConnexion) : "jamais"}</span>
              </p>
              <div className="mt-2 border-t-2 border-[#773331] pt-4">
                <NouveauCodeForm aDejaUnCode={codesActifs > 0} partnerId={partenaire.id} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-start gap-3">
              <form action={basculerPartenaire}>
                <input name="partner_id" type="hidden" value={partenaire.id} />
                <input name="active" type="hidden" value={partenaire.active ? "false" : "true"} />
                <button className="nav-link" type="submit">
                  {partenaire.active ? "Désactiver" : "Réactiver"}
                </button>
              </form>
              <SuppressionPartenaire nom={partenaire.name} partnerId={partenaire.id} ventes={resume.count} />
            </div>
          </div>
        </div>

        <div>
          <Intitule>Dernières ventes</Intitule>
          {ventes.length === 0 ? (
            <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">
              Rien de scanné pour l’instant. Les ventes arrivent ici dès que le partenaire scanne un QR membre depuis son espace pro.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="font-mono text-xs font-black uppercase tracking-[.14em]">
                    <th className="border-b-2 border-[#773331] pb-2 pr-4">Quand</th>
                    <th className="border-b-2 border-[#773331] pb-2 pr-4">Membre</th>
                    <th className="border-b-2 border-[#773331] pb-2 pr-4">Libellé</th>
                    <th className="border-b-2 border-[#773331] pb-2 pr-4 text-right">Montant</th>
                    <th className="border-b-2 border-[#773331] pb-2 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.slice(0, 20).map((v) => (
                    <tr className="border-b border-[#773331]/30 transition hover:bg-[#EBA0CD]/35" key={v.id}>
                      <td className="py-3 pr-4 font-mono text-xs font-bold">
                        {formatJourCourt(v.created_at)} · {formatHeure(v.created_at)}
                      </td>
                      <td className="py-3 pr-4 font-bold">{nomMembre(v.profiles)}</td>
                      <td className="py-3 pr-4">{v.label}</td>
                      <td className="py-3 pr-4 text-right font-mono text-xs font-black">{formatEuro(Number(v.amount_eur))}</td>
                      <td className="py-3 text-right font-mono text-xs font-black">+{v.points_awarded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ventes.length > 20 ? (
                <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">20 dernières sur {ventes.length}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
