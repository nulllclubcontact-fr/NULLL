import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { LIBELLES_JOURNAL, type ActionJournal } from "../../../../lib/admin/journal";
import { DUREE_SESSION_ADMIN_MS } from "../../../../lib/admin/regles";
import { deploiement, dureeCourte, enTetesDuSite, etatBase, navigateurCourt, resteSessionAdmin, type SessionAdmin } from "../../../../lib/admin/securite";
import { createSupabaseServiceClient } from "../../../../lib/supabase/service";
import { formatHeure, formatJourCourt } from "../../../../components/races/format";
import { SecuriteForm } from "./SecuriteForm";

export const metadata = { robots: { index: false, follow: false } };

/**
 * Cette page fait exception a la direction artistique du site : c'est un
 * tableau de bord qu'on lit vite, souvent sur un telephone, pour savoir
 * si tout est ferme. Lisibilite d'abord : texte en casse normale, grands
 * chiffres, couleurs qui veulent dire quelque chose (vert ferme, orange a
 * regarder, rouge a traiter), cartes blanches sur fond neutre.
 */

const DATE_LONGUE = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const JOURS_SESSION_RECENTE = 7;

type EntreeJournal = { id: number; prenom: string | null; nom: string | null; action: string; cible: string | null; details: Record<string, unknown> | null; created_at: string };
type Ton = "ok" | "attention" | "alerte" | "neutre";

const TONS: Record<Ton, { chip: string; point: string; carte: string }> = {
  ok: { chip: "bg-emerald-50 text-emerald-800 ring-emerald-200", point: "bg-emerald-500", carte: "border-emerald-200 bg-emerald-50" },
  attention: { chip: "bg-amber-50 text-amber-800 ring-amber-200", point: "bg-amber-500", carte: "border-amber-200 bg-amber-50" },
  alerte: { chip: "bg-red-50 text-red-800 ring-red-200", point: "bg-red-500", carte: "border-red-200 bg-red-50" },
  neutre: { chip: "bg-slate-100 text-slate-700 ring-slate-200", point: "bg-slate-400", carte: "border-slate-200 bg-white" }
};

async function journalSecurite() {
  try {
    const { data, error } = await createSupabaseServiceClient().rpc("lire_journal_admin", { p_limite: 200 });
    if (error) return null;
    return ((data ?? []) as EntreeJournal[]).filter((e) => e.action.startsWith("admin.") || e.action.startsWith("export.") || e.action.startsWith("partenaire.code")).slice(0, 8);
  } catch {
    return null;
  }
}

function instantPresent() {
  return Date.now();
}

function sessionRecente(s: SessionAdmin, maintenant: number) {
  return maintenant - Date.parse(s.rafraichie ?? s.depuis) < JOURS_SESSION_RECENTE * 24 * 60 * 60 * 1000;
}

function Chip({ ton, children }: { ton: Ton; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium ring-1 ring-inset ${TONS[ton].chip}`}>
      <span aria-hidden className={`size-2 rounded-full ${TONS[ton].point}`} />
      {children}
    </span>
  );
}

function Stat({ label, valeur, detail, ton, jauge }: { label: string; valeur: string | number; detail: string; ton: Ton; jauge?: number }) {
  return (
    <div className={`flex flex-col gap-2 rounded-2xl border p-5 ${TONS[ton].carte}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-4xl font-semibold tracking-tight text-slate-900">{valeur}</p>
      {jauge !== undefined ? (
        <div aria-hidden className="h-2 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-slate-200">
          <div className={`h-full rounded-full ${TONS[ton].point}`} style={{ width: `${Math.min(100, jauge)}%` }} />
        </div>
      ) : null}
      <p className="text-sm text-slate-600">{detail}</p>
    </div>
  );
}

function Carte({ titre, sousTitre, children, className = "", pied }: { titre: string; sousTitre?: string; children: ReactNode; className?: string; pied?: ReactNode }) {
  return (
    <section className={`flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{titre}</h2>
        {sousTitre ? <p className="mt-1 text-sm text-slate-500">{sousTitre}</p> : null}
      </div>
      {children}
      {pied ? <div className="mt-auto border-t border-slate-100 pt-4 text-sm text-slate-500">{pied}</div> : null}
    </section>
  );
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{children}</dd>
    </div>
  );
}

function Lien({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900" href={href}>
      {children}
    </Link>
  );
}

export default async function AdminSecuritePage() {
  const { supabase, user, doubleVerification } = await requireAdminUser();
  const maintenant = instantPresent();

  const [{ data: facteursData }, { etat, latenceMs }, { origine, entetes }, journal] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    etatBase(),
    enTetesDuSite(),
    journalSecurite()
  ]);

  const facteurs = (facteursData?.totp ?? [])
    .filter((f) => f.status === "verified")
    .map((f) => ({ id: f.id, nom: f.friendly_name ?? "Application", depuis: DATE_LONGUE.format(new Date(f.created_at)) }));

  const deploie = deploiement();
  const reste = resteSessionAdmin(user.last_sign_in_at, maintenant);
  const admins = etat?.admins ?? [];
  const adminsAvecMfa = admins.filter((a) => a.double_verification).length;
  const sessions = etat?.sessions ?? [];
  const sessionsRecentes = sessions.filter((s) => sessionRecente(s, maintenant));
  const sessionsSansCode = sessionsRecentes.filter((s) => s.aal !== "aal2" && admins.find((a) => a.id === s.user_id)?.double_verification).length;
  const entetesOk = entetes ? entetes.filter((e) => e.present).length : null;
  const enLocal = origine.startsWith("http://");
  const fournisseur = user.app_metadata?.provider === "google" ? "Google" : user.app_metadata?.provider === "apple" ? "Apple" : "e-mail et mot de passe";

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="shell grid gap-8 py-8 lg:py-12">
        <header className="max-w-2xl">
          <p className="text-sm font-medium text-slate-500">Administration</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Sécurité</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            L’état des serrures, relu à chaque affichage. Vert : fermé. Orange : à regarder. Rouge : à traiter maintenant.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            detail={facteurs.length > 0 ? "Mot de passe + code à six chiffres." : "Mot de passe seul. Active la double vérification ci-dessous."}
            label="Ton compte"
            ton={facteurs.length > 0 ? "ok" : "attention"}
            valeur={facteurs.length > 0 ? "2 clés" : "1 clé"}
          />
          <Stat
            detail={etat ? (adminsAvecMfa === admins.length ? "Toute l’équipe a la double vérification." : `${admins.length - adminsAvecMfa} admin${admins.length - adminsAvecMfa > 1 ? "s" : ""} sans double vérification.`) : "Base indisponible."}
            jauge={admins.length ? Math.round((adminsAvecMfa / admins.length) * 100) : 0}
            label="Admins protégés"
            ton={!etat ? "neutre" : adminsAvecMfa === admins.length ? "ok" : "attention"}
            valeur={etat ? `${adminsAvecMfa} / ${admins.length}` : "…"}
          />
          <Stat
            detail={etat ? (sessionsSansCode > 0 ? `${sessionsSansCode} ouverte${sessionsSansCode > 1 ? "s" : ""} sans le code : à surveiller.` : `Actives sur ${JOURS_SESSION_RECENTE} jours, ${sessions.length} au total.`) : "Base indisponible."}
            label="Sessions admin"
            ton={!etat ? "neutre" : sessionsSansCode > 0 ? "attention" : "ok"}
            valeur={etat ? sessionsRecentes.length : "…"}
          />
          <Stat
            detail={etat ? (etat.limites_actives > 0 ? `Fenêtres ouvertes, pic à ${etat.limites_max} essais.` : "Aucun limiteur en cours.") : "Base indisponible."}
            label="Tentatives freinées"
            ton={!etat ? "neutre" : etat.limites_actives > 0 ? "attention" : "ok"}
            valeur={etat ? etat.limites_actives : "…"}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Carte className="lg:col-span-2" sousTitre="Ce que ta session vaut en ce moment." titre="Ton compte">
            <dl className="divide-y divide-slate-100">
              <Info label="Double vérification">
                {facteurs.length > 0 ? <Chip ton="ok">{doubleVerification ? "Active, code passé" : "Active"}</Chip> : <Chip ton="attention">Pas encore</Chip>}
              </Info>
              <Info label="Connecté depuis">{user.last_sign_in_at ? DATE_LONGUE.format(new Date(user.last_sign_in_at)) : "inconnu"}</Info>
              <Info label="Administration fermée dans">
                {dureeCourte(reste)} <span className="font-normal text-slate-500">({Math.round(DUREE_SESSION_ADMIN_MS / 3600000)} h après la connexion)</span>
              </Info>
              <Info label="Connexion par">{fournisseur}</Info>
              <Info label="E-mail confirmé">{user.email_confirmed_at ? <Chip ton="ok">Oui</Chip> : <Chip ton="alerte">Non</Chip>}</Info>
            </dl>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-semibold">{facteurs.length > 0 ? "Ton application d’authentification" : "Activer la double vérification"}</h3>
              <div className="mt-3">
                <SecuriteForm facteurs={facteurs} />
              </div>
            </div>
          </Carte>

          <Carte
            pied={
              <>
                Erreurs serveur et rapports CSP : logs Vercel, filtre <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">niveau</code>. Sonde : <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">/api/sante</code>.
              </>
            }
            sousTitre="Ce qui tourne, et où."
            titre="Déploiement"
          >
            <dl className="divide-y divide-slate-100">
              <Info label="Environnement">{deploie.env}</Info>
              <Info label="Commit">{deploie.commit ?? "hors Vercel"}</Info>
              <Info label="Branche">{deploie.branche ?? "—"}</Info>
              <Info label="Région">{deploie.region ?? "—"}</Info>
              <Info label="Node">{deploie.node}</Info>
              <Info label="Base répond en">{latenceMs !== null ? <Chip ton={latenceMs < 1000 ? "ok" : "attention"}>{latenceMs} ms</Chip> : <Chip ton="alerte">Injoignable</Chip>}</Info>
            </dl>
          </Carte>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Carte sousTitre="Les protections côté Supabase." titre="Base de données">
            {etat ? (
              <dl className="divide-y divide-slate-100">
                <Info label="Tables avec RLS">
                  <Chip ton={etat.tables_sans_rls.length === 0 ? "ok" : "alerte"}>
                    {etat.tables_avec_rls} / {etat.tables}
                  </Chip>
                </Info>
                <Info label="Policies">{etat.policies}</Info>
                <Info label="Fonctions privilégiées">{etat.fonctions_definer}</Info>
                <Info label="Sans search_path fixé">
                  {etat.definer_sans_search_path.length === 0 ? <Chip ton="ok">Aucune</Chip> : <Chip ton="alerte">{etat.definer_sans_search_path.join(", ")}</Chip>}
                </Info>
                <Info label="Membres">
                  {etat.membres}
                  {etat.membres_bannis ? ` (${etat.membres_bannis} banni${etat.membres_bannis > 1 ? "s" : ""})` : ""}
                </Info>
                <Info label="Journal admin">
                  {etat.journal_lignes} ligne{etat.journal_lignes > 1 ? "s" : ""}
                  {etat.journal_plus_ancien ? <span className="block font-normal text-slate-500">depuis le {formatJourCourt(etat.journal_plus_ancien)}</span> : null}
                </Info>
              </dl>
            ) : (
              <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                Base injoignable avec la clé de service.
              </p>
            )}
            {etat && etat.tables_sans_rls.length > 0 ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                Sans RLS : {etat.tables_sans_rls.join(", ")}
              </p>
            ) : null}
          </Carte>

          <Carte
            pied={entetesOk !== null ? `${entetesOk} sur ${entetes?.length} présents sur ${origine.replace(/^https?:\/\//, "")}.` : undefined}
            sousTitre="Vérifiés par une requête sur le site lui-même."
            titre="En-têtes du site"
          >
            {entetes ? (
              <ul className="divide-y divide-slate-100">
                {entetes.map((e) => {
                  const localSansHttps = !e.present && e.nom === "strict-transport-security" && enLocal;
                  return (
                    <li className="flex items-center justify-between gap-4 py-2.5 text-sm" key={e.nom}>
                      <span className="text-slate-700">{e.libelle}</span>
                      {e.present ? <Chip ton="ok">Présent</Chip> : localSansHttps ? <Chip ton="neutre">Local, sans HTTPS</Chip> : <Chip ton="alerte">Absent</Chip>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">Impossible d’interroger {origine}.</p>
            )}
          </Carte>

          <Carte pied={<Lien href="/admin/equipe">Gérer l’équipe</Lien>} sousTitre="Qui ouvre l’administration, et avec combien de clés." titre="L’équipe">
            <ul className="divide-y divide-slate-100">
              {admins.map((a) => {
                const nom = [a.prenom, a.nom].filter(Boolean).join(" ") || "Admin";
                return (
                  <li className="flex items-center justify-between gap-4 py-2.5" key={a.id}>
                    <span>
                      <span className="block text-sm font-medium text-slate-900">{nom}</span>
                      <span className="block text-sm text-slate-500">
                        {a.derniere_connexion ? `Vu le ${formatJourCourt(a.derniere_connexion)}` : "Jamais connecté"}
                        {a.fournisseur && a.fournisseur !== "email" ? ` · ${a.fournisseur}` : ""}
                      </span>
                    </span>
                    {a.banni ? <Chip ton="alerte">Banni</Chip> : a.double_verification ? <Chip ton="ok">2 clés</Chip> : <Chip ton="attention">1 clé</Chip>}
                  </li>
                );
              })}
              {!etat ? <li className="py-2.5 text-sm text-slate-600">Indisponible.</li> : null}
            </ul>
          </Carte>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Carte
            pied="Une session que tu ne reconnais pas ? Change ton mot de passe : toutes tes sessions tombent."
            sousTitre={`Les ${JOURS_SESSION_RECENTE} derniers jours, tous les admins.`}
            titre="Sessions admin"
          >
            {sessionsRecentes.length === 0 ? (
              <p className="text-sm text-slate-600">{etat ? "Aucune session récente." : "Indisponible."}</p>
            ) : (
              <div aria-label="Sessions admin" className="-mx-2 overflow-x-auto" tabIndex={0}>
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="px-2 pb-2 font-medium">Qui</th>
                      <th className="px-2 pb-2 font-medium">Appareil</th>
                      <th className="px-2 pb-2 font-medium">Niveau</th>
                      <th className="px-2 pb-2 font-medium">Dernière activité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessionsRecentes.map((s) => {
                      const derniere = s.rafraichie ?? s.depuis;
                      const protege = admins.find((a) => a.id === s.user_id)?.double_verification;
                      return (
                        <tr key={s.id}>
                          <td className="px-2 py-3 font-medium text-slate-900">{s.prenom ?? "Admin"}</td>
                          <td className="px-2 py-3 text-slate-700">
                            {navigateurCourt(s.navigateur)}
                            {s.ip ? <span className="block text-slate-500">{s.ip}</span> : null}
                          </td>
                          <td className="px-2 py-3">
                            {s.aal === "aal2" ? <Chip ton="ok">Code passé</Chip> : protege ? <Chip ton="attention">Sans le code</Chip> : <Chip ton="neutre">Mot de passe</Chip>}
                          </td>
                          <td className="px-2 py-3 text-slate-700">
                            {formatJourCourt(derniere)} à {formatHeure(derniere)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Carte>

          <Carte pied={<Lien href="/admin/journal">Voir tout le journal</Lien>} sousTitre="Comptes, exports de données personnelles, codes partenaires." titre="Journal de sécurité">
            {journal === null ? (
              <p className="text-sm text-slate-600">Indisponible.</p>
            ) : journal.length === 0 ? (
              <p className="text-sm text-slate-600">Rien à signaler : aucun changement de compte ni export récent.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {journal.map((e) => {
                  const libelle = LIBELLES_JOURNAL[e.action as ActionJournal] ?? e.action;
                  const qui = [e.prenom, e.nom].filter(Boolean).join(" ") || "Hors interface";
                  const detail = typeof e.details?.email === "string" ? e.details.email : typeof e.details?.sortie === "string" ? e.details.sortie : "";
                  const sensible = e.action.startsWith("export.") || e.action.endsWith(".retrait") || e.action.endsWith(".suppression");
                  return (
                    <li className="flex items-start justify-between gap-4 py-2.5" key={e.id}>
                      <span>
                        <span className="block text-sm font-medium text-slate-900">{libelle}</span>
                        <span className="block text-sm text-slate-500">
                          {qui} · {formatJourCourt(e.created_at)} à {formatHeure(e.created_at)}
                          {detail ? ` · ${detail}` : ""}
                        </span>
                      </span>
                      <Chip ton={sensible ? "attention" : "neutre"}>{sensible ? "Sensible" : "Info"}</Chip>
                    </li>
                  );
                })}
              </ul>
            )}
          </Carte>
        </div>
      </section>
    </div>
  );
}
