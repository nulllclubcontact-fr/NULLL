import Link from "next/link";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { listAdminPartners, listAdminPartnerSales, summarizePartnerSales, type AdminPartnerSale } from "../../../../lib/admin/repo";
import { formatEuro, formatJourCourt } from "../../../../components/races/format";
import { BarresClassement, ColonnesParJour, Etiquette, Intitule, TITRE_LIGNE, Tuiles, fenetreJours } from "../../../../components/admin/graphiques";
import { CreerPartenaireForm } from "../../../../components/admin/formulaires-partenaire";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminReseauPage() {
  // Les tables partenaires n'ont aucune policy : seul le service role les
  // lit, et on n'y arrive qu'apres la verification du role admin.
  await requireAdminUser();
  const [partenaires, ventes] = await Promise.all([listAdminPartners(), listAdminPartnerSales()]);

  const ventesPar = new Map<string, AdminPartnerSale[]>();
  for (const vente of ventes) {
    const liste = ventesPar.get(vente.partner_id) ?? [];
    liste.push(vente);
    ventesPar.set(vente.partner_id, liste);
  }

  const fiches = partenaires
    .map((partenaire) => ({ partenaire, resume: summarizePartnerSales(ventesPar.get(partenaire.id) ?? []) }))
    .sort((a, b) => b.resume.revenue - a.resume.revenue || a.partenaire.name.localeCompare(b.partenaire.name));

  const total = summarizePartnerSales(ventes);
  const actifs = partenaires.filter((p) => p.active).length;

  const fenetre = fenetreJours(30);
  for (const vente of ventes) fenetre.ajouter(vente.created_at, Number(vente.amount_eur));
  const chiffre30 = fenetre.jours.reduce((s, j) => s + j.total, 0);

  return (
    <section className="shell grid gap-12 py-8 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[.18em]">Administration</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] uppercase leading-[.95]">
            Partenaires<span className="text-[#EBA0CD]">.</span>
          </h1>
          <p className="mt-4 max-w-xl font-bold">
            Chaque partenaire créé apparaît ici, et chaque vente scannée dans son espace pro remonte toute seule.
          </p>
        </div>
      </header>

      <CreerPartenaireForm />

      <Tuiles
        tuiles={[
          { label: "Partenaires actifs", valeur: actifs, detail: `${partenaires.length} au total`, teinte: "bordeaux" },
          { label: "CA généré", valeur: formatEuro(total.revenue), detail: `${formatEuro(chiffre30)} sur 30 jours`, teinte: "rose" },
          { label: "Ventes scannées", valeur: total.count, detail: `panier moyen ${formatEuro(total.averageBasket)}`, teinte: "jaune" },
          {
            label: "Membres clients",
            valeur: total.clients,
            detail: `${total.returningClients} revenus plus d’une fois`,
            teinte: "creme"
          }
        ]}
      />

      <div className="grid gap-12 xl:grid-cols-[1fr_1fr]">
        <div>
          <Intitule>CA par partenaire</Intitule>
          <BarresClassement
            lignes={fiches.map(({ partenaire, resume }) => ({
              cle: partenaire.id,
              titre: partenaire.name,
              href: `/admin/reseau/${partenaire.id}`,
              valeur: resume.revenue,
              texte: `${formatEuro(resume.revenue)} · ${resume.count} vente${resume.count > 1 ? "s" : ""}`
            }))}
            vide="Aucun partenaire pour l’instant."
          />
        </div>

        <div>
          <Intitule>CA du réseau · 30 derniers jours</Intitule>
          <ColonnesParJour
            description={`${formatEuro(chiffre30)} de ventes sur les 30 derniers jours`}
            formater={formatEuro}
            jours={fenetre.jours}
          />
          <p className="mt-3 font-mono text-xs font-black uppercase tracking-[.12em]">
            {chiffre30 === 0 ? "Aucune vente sur la période" : `${formatEuro(chiffre30)} · aujourd’hui en jaune · survole une colonne`}
          </p>
        </div>
      </div>

      <div>
        <Intitule>Tous les partenaires</Intitule>
        {fiches.length === 0 ? (
          <p className="mt-5 border-2 border-dashed border-[#773331] p-6 font-bold">
            Aucun partenaire. Crée le premier juste au-dessus.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fiches.map(({ partenaire, resume }) => {
              const derniereConnexion = partenaire.partner_access_codes
                .map((c) => c.last_used_at)
                .filter((d): d is string => d !== null)
                .sort()
                .at(-1);

              return (
                <li key={partenaire.id}>
                  <Link
                    className="group flex h-full flex-col border-2 border-[#773331] bg-[#F1EDE9] p-5 transition hover:bg-[#EBA0CD]"
                    href={`/admin/reseau/${partenaire.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={TITRE_LIGNE}>{partenaire.name}</span>
                      {partenaire.active ? <Etiquette teinte="bordeaux">Actif</Etiquette> : <Etiquette pointillee teinte="creme">Désactivé</Etiquette>}
                    </div>

                    <dl className="mt-5 grid grid-cols-3 gap-3 border-y-2 border-[#773331] py-4">
                      <div>
                        <dt className="font-mono text-xs font-black uppercase tracking-[.12em]">CA</dt>
                        <dd className="mt-1 font-mono text-sm font-black">{formatEuro(resume.revenue)}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-xs font-black uppercase tracking-[.12em]">Ventes</dt>
                        <dd className="mt-1 font-mono text-sm font-black">{resume.count}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-xs font-black uppercase tracking-[.12em]">Clients</dt>
                        <dd className="mt-1 font-mono text-sm font-black">{resume.clients}</dd>
                      </div>
                    </dl>

                    <p className="mt-4 font-mono text-xs font-black uppercase tracking-[.1em]">
                      {resume.lastSaleAt ? `Dernière vente le ${formatJourCourt(resume.lastSaleAt)}` : "Aucune vente pour l’instant"}
                    </p>
                    {derniereConnexion ? (
                      <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[.1em]">
                        Espace pro ouvert le {formatJourCourt(derniereConnexion)}
                      </p>
                    ) : (
                      <p className="mt-2 self-start bg-[#FFB200] px-2 py-1 font-mono text-xs font-black uppercase tracking-[.12em]">
                        N’a jamais ouvert son espace pro
                      </p>
                    )}

                    <span className="mt-auto pt-5 font-mono text-xs font-black uppercase tracking-[.12em] group-hover:underline">Voir la fiche →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
