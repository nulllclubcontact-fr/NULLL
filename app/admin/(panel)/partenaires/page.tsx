import {
  activatePartner,
  createPartner,
  deactivatePartner,
  revokePartnerCode
} from "../../actions";
import { listAdminPartners, type AdminPartner } from "../../../../lib/admin/repo";
import { GenerateCodeForm } from "./GenerateCodeForm";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function AdminPartnersPage() {
  const partners = await listAdminPartners();

  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="font-mono text-sm uppercase  text-[#d96ab4]">Admin partenaires</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Codes. Hash. Silence.</h1>
        <p className="mt-5 max-w-xl text-[#351815]/72">Le code clair apparait une fois. Apres, il n'existe plus ici.</p>
      </div>

      <form action={createPartner} className="panel panel-grid grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]">
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Nom partenaire
          <input className="field" maxLength={120} name="name" required />
        </label>
        <label className="grid gap-2 font-mono text-xs uppercase ">
          Contact
          <input className="field" name="contact_email" type="email" />
        </label>
        <button className="primary-button self-end" type="submit">
          Creer
        </button>
      </form>

      {partners.length === 0 ? (
        <div className="panel p-5 md:p-8">
          <p className="font-display text-[clamp(2.8rem,7vw,5rem)] uppercase leading-none">Aucun partenaire.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {partners.map((partner) => (
            <PartnerBlock key={partner.id} partner={partner} />
          ))}
        </div>
      )}
    </section>
  );
}

function PartnerBlock({ partner }: { partner: AdminPartner }) {
  const activeCodes = partner.partner_access_codes.filter((code) => code.active);

  return (
    <article className="panel p-5">
      <div className="grid gap-4 border-b-2 border-[#351815] pb-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="font-mono text-xs uppercase  text-[#351815]/50">
            {partner.active ? "Actif" : "Desactive"} / {formatDate(partner.created_at)}
          </p>
          <h2 className="mt-2 font-display text-[clamp(2.6rem,7vw,5.8rem)] uppercase leading-none">{partner.name}</h2>
          <p className="mt-3 text-[#351815]/60">{partner.contact_email || "Pas de contact"}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80 lg:grid-cols-1">
          <form action={partner.active ? deactivatePartner : activatePartner}>
            <input name="partner_id" type="hidden" value={partner.id} />
            <button className="secondary-link w-full" type="submit">
              {partner.active ? "Desactiver" : "Reactiver"}
            </button>
          </form>
          <GenerateCodeForm partnerId={partner.id} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <p className="font-mono text-xs font-black uppercase  text-[#d96ab4]">
          {activeCodes.length} code(s) actif(s)
        </p>
        {partner.partner_access_codes.length === 0 ? (
          <p className="text-[#351815]/60">Aucun code genere.</p>
        ) : (
          partner.partner_access_codes.map((code) => (
            <div className="grid gap-3 border-b border-[#351815]/20 pb-3 last:border-b-0 md:grid-cols-[1fr_1fr_auto] md:items-center" key={code.id}>
              <p className="font-mono text-xs uppercase text-[#351815]/55">Cree le {formatDate(code.created_at)}</p>
              <p className="font-mono text-xs uppercase text-[#351815]/55">
                {code.last_used_at ? `Dernier usage ${formatDate(code.last_used_at)}` : "Jamais utilise"}
              </p>
              {code.active ? (
                <form action={revokePartnerCode}>
                  <input name="code_id" type="hidden" value={code.id} />
                  <button className="secondary-link w-full" type="submit">
                    Revoquer
                  </button>
                </form>
              ) : (
                <p className="font-mono text-xs font-black uppercase text-[#351815]/35">Revoque</p>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
}
