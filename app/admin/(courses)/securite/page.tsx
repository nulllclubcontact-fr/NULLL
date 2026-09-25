import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminUser } from "../../../../lib/admin/require-admin";
import { LIBELLES_JOURNAL, type ActionJournal } from "../../../../lib/admin/journal";
import { DUREE_SESSION_ADMIN_MS } from "../../../../lib/admin/regles";
import { deploiement, dureeCourte, enTetesDuSite, etatBase, navigateurCourt, resteSessionAdmin, type SessionAdmin } from "../../../../lib/admin/securite";
import { METRIQUES_SONAR, disponibilite, github, sentry, sonar, type EtatService } from "../../../../lib/admin/services";
import { tailleLisible } from "../../../../lib/admin/securite";
import { LIBELLES_AUTH, lireJournalAuth, type ActionAuth } from "../../../../lib/admin/journal-auth";
import { briques, type EtatBrique } from "../../../../lib/admin/services-internes";
import { checklistRgpd, checklistSecurite, type EtatPoint } from "../../../../lib/admin/checklists";
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

function Lien({ href, children, externe = false }: { href: string; children: ReactNode; externe?: boolean }) {
  const classe = "font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900";
  return externe ? (
    <a className={classe} href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <Link className={classe} href={href}>
      {children}
    </Link>
  );
}

/**
 * Carte d'un service exterieur. Sans variable d'environnement, elle dit
 * laquelle manque et renvoie a la doc ; en erreur, elle dit quoi.
 */
function ServiceCarte<T>({ titre, sousTitre, service, enfants }: { titre: string; sousTitre: string; service: EtatService<T>; enfants: (d: T) => ReactNode }) {
  return (
    <Carte sousTitre={sousTitre} titre={titre}>
      {service.etat === "a-configurer" ? (
        <div className="grid gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          <Chip ton="neutre">À configurer</Chip>
          <p>
            Variable{service.manque.length > 1 ? "s" : ""} à renseigner sur Vercel :{" "}
            {service.manque.map((m, i) => (
              <span key={m}>
                {i > 0 ? ", " : ""}
                <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-slate-200">{m}</code>
              </span>
            ))}
            . La marche à suivre est dans <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-slate-200">docs/admin/05-exploitation.md</code>.
          </p>
        </div>
      ) : service.etat === "erreur" ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          Le service ne répond pas : {service.message}
        </p>
      ) : (
        enfants(service.donnees)
      )}
    </Carte>
  );
}

const FILTRES_AUTH: Array<{ cle: string; label: string; garde: (a: string) => boolean }> = [
  { cle: "tout", label: "Tout", garde: () => true },
  { cle: "connexions", label: "Connexions", garde: (a) => a === "login_success" || a === "logout" || a === "session_expired" || a === "mfa_success" },
  { cle: "echecs", label: "Échecs et blocages", garde: (a) => a.endsWith("_failure") || a.endsWith("_blocked") },
  { cle: "comptes", label: "Comptes", garde: (a) => a.startsWith("mfa_") && a !== "mfa_success" && a !== "mfa_failure" || a.startsWith("password_") }
];

const TON_BRIQUE: Record<EtatBrique, { ton: Ton; mot: string }> = {
  ok: { ton: "ok", mot: "OK" },
  lent: { ton: "attention", mot: "Lent" },
  panne: { ton: "alerte", mot: "En panne" },
  "a-configurer": { ton: "neutre", mot: "À configurer" }
};

const TON_POINT: Record<EtatPoint, { ton: Ton; mot: string }> = {
  "en-place": { ton: "ok", mot: "En place" },
  partiel: { ton: "attention", mot: "Partiel" },
  absent: { ton: "alerte", mot: "Absent" }
};

function Grand({ label, valeur, ton }: { label: string; valeur: string | number; ton: Ton }) {
  return (
    <div className={`rounded-xl border p-3 ${TONS[ton].carte}`}>
      <p className="text-2xl font-semibold tracking-tight text-slate-900">{valeur}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

export default async function AdminSecuritePage({ searchParams }: { searchParams: Promise<{ connexions?: string }> }) {
  const { supabase, user, doubleVerification } = await requireAdminUser();
  const maintenant = instantPresent();
  const { connexions: filtreDemande } = await searchParams;
  const filtre = FILTRES_AUTH.find((f) => f.cle === filtreDemande) ?? FILTRES_AUTH[0];

  const [{ data: facteursData }, { etat, latenceMs }, { origine, entetes }, journal, erreurs, qualite, chaine, dispo, auth, services] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    etatBase(),
    enTetesDuSite(),
    journalSecurite(),
    sentry(),
    sonar(),
    github(),
    disponibilite(),
    lireJournalAuth(80),
    briques()
  ]);

  const derniereSauvegarde = journal?.find((e) => e.action === "export.sauvegarde") ?? null;
  const evenementsAuth = (auth.entrees ?? []).filter((e) => filtre.garde(e.action)).slice(0, 25);

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
  const hsts = entetes ? entetes.some((e) => e.nom === "strict-transport-security" && e.present) : null;
  const pointsSecurite = checklistSecurite({
    rlsComplete: etat ? etat.tables_sans_rls.length === 0 : null,
    definerPropres: etat ? etat.definer_sans_search_path.length === 0 : null,
    tousAdminsProteges: etat ? adminsAvecMfa === admins.length : null,
    hsts: enLocal ? null : hsts,
    cspEnBlocage: entetes ? false : null,
    sentry: erreurs.etat === "ok",
    disponibilite: dispo.etat === "ok",
    sonar: qualite.etat === "ok",
    sauvegardeRecente: derniereSauvegarde ? maintenant - Date.parse(derniereSauvegarde.created_at) < 7 * 24 * 3600 * 1000 : false
  });
  const pointsRgpd = checklistRgpd();
  const resume = (points: Array<{ etat: EtatPoint }>) => ({
    enPlace: points.filter((p) => p.etat === "en-place").length,
    partiel: points.filter((p) => p.etat === "partiel").length,
    absent: points.filter((p) => p.etat === "absent").length
  });
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
              <>
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
                <Info label="Taille de la base">{tailleLisible(etat.taille_base_octets)}</Info>
              </dl>
              {etat.tables_lourdes.length > 0 ? (
                <div>
                  <p className="mb-1 text-sm text-slate-500">Tables les plus lourdes, index compris</p>
                  <ul className="divide-y divide-slate-100 text-sm">
                    {etat.tables_lourdes.map((t) => (
                      <li className="flex items-center justify-between gap-3 py-1.5" key={t.table}>
                        <span className="font-mono text-xs text-slate-700">{t.table}</span>
                        <span className="text-slate-600">
                          {tailleLisible(t.octets)}
                          {t.lignes > 0 ? <span className="text-slate-400"> · ~{t.lignes} lignes</span> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              </>
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

        <div className="grid gap-4 lg:grid-cols-3">
          <Carte
            className="lg:col-span-2"
            pied="Conservé six mois. Un identifiant qui revient dans les échecs est un compte visé : préviens la personne et vérifie que son mot de passe est unique."
            sousTitre="Connexions, échecs, blocages, codes, mots de passe · toute la communauté."
            titre="Journal des connexions"
          >
            {auth.compteurs ? (
              <div className="grid grid-cols-3 gap-3">
                <Grand label="Connexions 24 h" ton="neutre" valeur={auth.compteurs.connexions} />
                <Grand label="Échecs 24 h" ton={auth.compteurs.echecs ? "attention" : "ok"} valeur={auth.compteurs.echecs} />
                <Grand label="Blocages 24 h" ton={auth.compteurs.blocages ? "alerte" : "ok"} valeur={auth.compteurs.blocages} />
              </div>
            ) : (
              <p className="text-sm text-slate-600">Compteurs indisponibles.</p>
            )}

            {auth.compteurs && auth.compteurs.identifiants_vises.length > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-medium">Comptes visés sur 24 h</p>
                <ul className="mt-1">
                  {auth.compteurs.identifiants_vises.map((v) => (
                    <li key={v.identifiant}>
                      {v.identifiant} · {v.essais} essai{v.essais > 1 ? "s" : ""} refusé{v.essais > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {FILTRES_AUTH.map((f) => (
                <Link
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${f.cle === filtre.cle ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-100"}`}
                  href={f.cle === "tout" ? "/admin/securite" : `/admin/securite?connexions=${f.cle}`}
                  key={f.cle}
                  scroll={false}
                >
                  {f.label}
                </Link>
              ))}
            </div>

            {auth.entrees === null ? (
              <p className="text-sm text-slate-600">Indisponible.</p>
            ) : evenementsAuth.length === 0 ? (
              <p className="text-sm text-slate-600">Rien dans cette catégorie pour l’instant.</p>
            ) : (
              <div aria-label="Journal des connexions" className="-mx-2 overflow-x-auto" tabIndex={0}>
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="px-2 pb-2 font-medium">Quand</th>
                      <th className="px-2 pb-2 font-medium">Quoi</th>
                      <th className="px-2 pb-2 font-medium">Qui</th>
                      <th className="px-2 pb-2 font-medium">D’où</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evenementsAuth.map((e) => {
                      const libelle = LIBELLES_AUTH[e.action as ActionAuth] ?? { texte: e.action, ton: "neutre" as const };
                      return (
                        <tr key={e.id}>
                          <td className="whitespace-nowrap px-2 py-2 text-slate-700">
                            {formatJourCourt(e.created_at)} {formatHeure(e.created_at)}
                          </td>
                          <td className="px-2 py-2">
                            <Chip ton={libelle.ton}>{libelle.texte}</Chip>
                          </td>
                          <td className="px-2 py-2 text-slate-700">
                            {e.prenom ?? (e.identifiant ?? "inconnu")}
                            {e.prenom && e.identifiant ? <span className="block text-slate-400">{e.identifiant}</span> : null}
                          </td>
                          <td className="px-2 py-2 text-slate-500">
                            {navigateurCourt(e.navigateur ?? "")}
                            {e.ip ? <span className="block">{e.ip}</span> : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Carte>

          <Carte sousTitre="Testés à l’ouverture de la page, avec leur temps de réponse." titre="Services">
            <ul className="divide-y divide-slate-100">
              {services.map((b) => {
                const t = TON_BRIQUE[b.etat];
                return (
                  <li className="flex items-start justify-between gap-3 py-3" key={b.nom}>
                    <span>
                      <span className="block text-sm font-medium text-slate-900">{b.nom}</span>
                      <span className="block text-sm text-slate-500">{b.role}</span>
                      <span className="block text-sm text-slate-500">{b.detail}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <Chip ton={t.ton}>{t.mot}</Chip>
                      {b.ms !== null ? <span className="text-xs text-slate-500">{b.ms} ms</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
            {etat && etat.activite.length > 0 ? (
              <div className="border-t border-slate-100 pt-4">
                <p className="mb-1 text-sm font-medium text-slate-900">Activité de l’équipe · 7 jours</p>
                <ul className="divide-y divide-slate-100 text-sm">
                  {etat.activite.map((a) => (
                    <li className="flex items-center justify-between gap-3 py-1.5" key={a.admin_id ?? "hors-interface"}>
                      <span className="text-slate-700">{a.prenom ?? (a.admin_id ? "Admin" : "Hors interface")}</span>
                      <span className="text-slate-500">
                        {a.actions} action{a.actions > 1 ? "s" : ""} · {formatJourCourt(a.derniere)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Carte>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <ServiceCarte
            enfants={(d) => (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Grand label="Erreurs sur 24 h" ton={d.erreurs24h ? "alerte" : "ok"} valeur={d.erreurs24h} />
                  <Grand label="Problèmes ouverts" ton={d.ouverts ? "attention" : "ok"} valeur={d.ouverts} />
                </div>
                {d.derniers.length > 0 ? (
                  <ul className="divide-y divide-slate-100 text-sm">
                    {d.derniers.map((p) => (
                      <li className="py-2" key={p.url}>
                        <a className="font-medium text-slate-900 hover:underline" href={p.url} rel="noreferrer" target="_blank">
                          {p.titre}
                        </a>
                        <span className="block text-slate-500">
                          {p.occurrences} fois · vu le {formatJourCourt(p.vu)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-auto text-sm text-slate-500">
                  <Lien externe href={d.url}>Ouvrir Sentry</Lien>
                </p>
              </>
            )}
            service={erreurs}
            sousTitre="Sentry · serveur et navigateur."
            titre="Erreurs en production"
          />

          <ServiceCarte
            enfants={(d) => (
              <>
                <div>
                  <Chip ton={d.porte === "OK" ? "ok" : d.porte === "ERROR" ? "alerte" : "neutre"}>
                    {d.porte === "OK" ? "Porte qualité passée" : d.porte === "ERROR" ? "Porte qualité en échec" : "Pas encore analysé"}
                  </Chip>
                </div>
                <dl className="divide-y divide-slate-100">
                  {METRIQUES_SONAR.map((m) => {
                    const v = d.mesures[m.cle];
                    const grave = (m.cle === "bugs" || m.cle === "vulnerabilities") && v > 0;
                    return (
                      <Info key={m.cle} label={m.label}>
                        <span className={grave ? "text-red-700" : ""}>{v === undefined ? "—" : `${v}${m.unite ?? ""}`}</span>
                      </Info>
                    );
                  })}
                </dl>
                <p className="mt-auto text-sm text-slate-500">
                  <Lien externe href={d.url}>Ouvrir SonarCloud</Lien>
                </p>
              </>
            )}
            service={qualite}
            sousTitre="SonarCloud · à chaque envoi de code."
            titre="Qualité du code"
          />

          <ServiceCarte
            enfants={(d) => (
              <>
                <ul className="divide-y divide-slate-100 text-sm">
                  {d.runs.map((r) => {
                    const ton: Ton = r.statut !== "completed" ? "neutre" : r.conclusion === "success" ? "ok" : r.conclusion === "failure" ? "alerte" : "attention";
                    const mot = r.statut !== "completed" ? "En cours" : r.conclusion === "success" ? "OK" : r.conclusion === "failure" ? "Échec" : (r.conclusion ?? "—");
                    return (
                      <li className="flex items-start justify-between gap-3 py-2" key={r.id}>
                        <span className="min-w-0">
                          <a className="block truncate font-medium text-slate-900 hover:underline" href={r.url} rel="noreferrer" target="_blank">
                            {r.titre}
                          </a>
                          <span className="block text-slate-500">
                            {r.branche} · {formatJourCourt(r.quand)} {formatHeure(r.quand)}
                            {r.duree_s !== null ? ` · ${dureeCourte(r.duree_s * 1000)}` : ""}
                          </span>
                        </span>
                        <Chip ton={ton}>{mot}</Chip>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-auto text-sm text-slate-500">
                  <Lien externe href={d.url}>Ouvrir les actions GitHub</Lien>
                </p>
              </>
            )}
            service={chaine}
            sousTitre="Lint, types, tests, SonarCloud."
            titre="Chaîne GitHub"
          />

          <ServiceCarte
            enfants={(d) => (
              <>
                <div>
                  <Chip ton={d.enLigne ? "ok" : "alerte"}>{d.enLigne ? "En ligne" : "Hors ligne"}</Chip>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Grand label="24 h" ton={d.dispo24h >= 99.9 ? "ok" : d.dispo24h >= 99 ? "attention" : "alerte"} valeur={`${d.dispo24h} %`} />
                  <Grand label="7 jours" ton={d.dispo7j >= 99.9 ? "ok" : d.dispo7j >= 99 ? "attention" : "alerte"} valeur={`${d.dispo7j} %`} />
                  <Grand label="Incidents" ton={d.incidents.length ? "attention" : "ok"} valeur={d.incidents.length} />
                </div>
                {d.incidents.length > 0 ? (
                  <ul className="divide-y divide-slate-100 text-sm">
                    {d.incidents.map((i) => (
                      <li className="py-2" key={i.debut}>
                        <span className="font-medium text-slate-900">
                          {formatJourCourt(i.debut)} {formatHeure(i.debut)} · {dureeCourte(i.duree_s * 1000)}
                        </span>
                        {i.raison ? <span className="block text-slate-500">{i.raison}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-auto text-sm text-slate-500">
                  {d.reponseMs !== null ? `Dernière réponse en ${d.reponseMs} ms · ` : ""}
                  <Lien externe href={d.url}>Ouvrir UptimeRobot</Lien>
                </p>
              </>
            )}
            service={dispo}
            sousTitre="UptimeRobot · contrôlée de l’extérieur toutes les 5 minutes."
            titre="Disponibilité"
          />
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

          <Carte
            pied={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{derniereSauvegarde ? `Dernière sauvegarde le ${formatJourCourt(derniereSauvegarde.created_at)} à ${formatHeure(derniereSauvegarde.created_at)}.` : "Aucune sauvegarde téléchargée pour l’instant."}</span>
                {/* Un telechargement, pas une page : Link ferait une navigation client. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700" href="/admin/sauvegarde">
                  Télécharger une sauvegarde
                </a>
              </div>
            }
            sousTitre="Toutes les tables métier en un fichier JSON. Contient des données personnelles : à garder chiffré, hors ligne."
            titre="Sauvegarde"
          >
            <p className="text-sm text-slate-600">
              Complète les sauvegardes Supabase, ne les remplace pas. Chaque téléchargement est inscrit au journal avec ton nom. Photos et visites ne sont pas dans le fichier.
            </p>
          </Carte>

          {[
            { titre: "Sécurité", sousTitre: "Ce que fait NULLL face aux pratiques d’une agence de développement.", points: pointsSecurite },
            { titre: "RGPD", sousTitre: "Protection des données personnelles des membres.", points: pointsRgpd }
          ].map((c) => {
            const r = resume(c.points);
            return (
              <Carte
                key={c.titre}
                pied={`${r.enPlace} en place · ${r.partiel} partiel${r.partiel > 1 ? "s" : ""} · ${r.absent} absent${r.absent > 1 ? "s" : ""}. Le détail et les dates sont dans docs/admin/01-audit.md.`}
                sousTitre={c.sousTitre}
                titre={`Checklist ${c.titre}`}
              >
                <ul className="divide-y divide-slate-100">
                  {c.points.map((p) => {
                    const t = TON_POINT[p.etat];
                    return (
                      <li className="flex items-start justify-between gap-3 py-2.5" key={p.titre}>
                        <span>
                          <span className="block text-sm font-medium text-slate-900">{p.titre}</span>
                          <span className="block text-sm text-slate-500">{p.note}</span>
                        </span>
                        <Chip ton={t.ton}>{t.mot}</Chip>
                      </li>
                    );
                  })}
                </ul>
              </Carte>
            );
          })}

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
