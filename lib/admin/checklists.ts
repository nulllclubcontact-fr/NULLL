/**
 * Ce que NULLL fait face aux pratiques d'une agence de developpement, et
 * face au RGPD. Chaque point a trois etats : en place, partiel, absent.
 * Certains se mesurent (RLS, double verification de toute l'equipe, HSTS),
 * les autres sont constates a la main et dates dans docs/admin/01-audit.md.
 */
export type EtatPoint = "en-place" | "partiel" | "absent";
export type Point = { titre: string; etat: EtatPoint; note: string };

export type MesuresChecklist = {
  rlsComplete: boolean | null;
  definerPropres: boolean | null;
  tousAdminsProteges: boolean | null;
  hsts: boolean | null;
  cspEnBlocage: boolean | null;
  sentry: boolean;
  disponibilite: boolean;
  sonar: boolean;
  sauvegardeRecente: boolean;
};

function mesure(v: boolean | null, si: [EtatPoint, string], sinon: [EtatPoint, string], inconnu: [EtatPoint, string] = ["partiel", "non mesuré à cet instant"]) {
  if (v === null) return inconnu;
  return v ? si : sinon;
}

export function checklistSecurite(m: MesuresChecklist): Point[] {
  const [rls, noteRls] = mesure(m.rlsComplete, ["en-place", "chaque table publique a la RLS, l’admin passe par is_admin()"], ["absent", "au moins une table sans RLS"]);
  const [definer, noteDefiner] = mesure(m.definerPropres, ["en-place", "toutes les fonctions privilégiées fixent leur search_path"], ["partiel", "une fonction privilégiée sans search_path"]);
  const [mfa, noteMfa] = mesure(m.tousAdminsProteges, ["en-place", "chaque admin a la double vérification, exigée par le code et par la base"], ["partiel", "disponible et imposée une fois activée, mais tous les admins ne l’ont pas encore"]);
  const [hsts, noteHsts] = mesure(m.hsts, ["en-place", "HTTPS imposé par Vercel"], ["partiel", "absent ici : normal en local, à vérifier sur nulll.club"]);
  const [csp, noteCsp] = mesure(m.cspEnBlocage, ["en-place", "politique de contenu en blocage"], ["partiel", "politique complète en observation, frame-ancestors en blocage ; passage en blocage après deux semaines propres"]);

  return [
    { titre: "Droits vérifiés en base à chaque requête", etat: "en-place", note: "rôle relu en base, jamais déduit d’un cookie ; RLS en second barrage" },
    { titre: "Isolation des données (RLS)", etat: rls, note: noteRls },
    { titre: "Fonctions privilégiées cadrées", etat: definer, note: noteDefiner },
    { titre: "Double vérification des admins", etat: mfa, note: noteMfa },
    { titre: "Sessions admin limitées", etat: "en-place", note: "douze heures après la connexion, puis reconnexion" },
    { titre: "Limitation des essais de connexion", etat: "en-place", note: "dix essais par quart d’heure et par identifiant, trente par adresse, plus les limites Supabase" },
    { titre: "Journal des actions d’administration", etat: "en-place", note: "ajout seul, douze mois, exports de données personnelles tracés" },
    { titre: "Journal des connexions", etat: "en-place", note: "connexions, échecs, blocages, codes, mots de passe ; six mois" },
    { titre: "En-têtes de sécurité", etat: "en-place", note: "nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy" },
    { titre: "HTTPS imposé (HSTS)", etat: hsts, note: noteHsts },
    { titre: "Politique de contenu (CSP)", etat: csp, note: noteCsp },
    { titre: "Secrets hors du code", etat: "en-place", note: "variables d’environnement Vercel ; aucune clé dans le dépôt, clé de service jamais côté navigateur" },
    { titre: "Codes partenaires hachés", etat: "en-place", note: "affichés une fois, stockés en bcrypt, révocables" },
    { titre: "Formules neutralisées dans les exports", etat: "en-place", note: "un tableur n’exécute rien à l’ouverture d’un export" },
    { titre: "Remontée des erreurs", etat: m.sentry ? "en-place" : "partiel", note: m.sentry ? "Sentry serveur et navigateur" : "logs Vercel structurés ; Sentry câblé, variables à poser" },
    { titre: "Disponibilité surveillée de l’extérieur", etat: m.disponibilite ? "en-place" : "absent", note: m.disponibilite ? "sonde toutes les cinq minutes" : "sonde /api/sante prête, moniteur UptimeRobot à créer" },
    { titre: "Intégration continue", etat: "en-place", note: "lint, types et tests sur chaque envoi de code" },
    { titre: "Analyse statique du code", etat: m.sonar ? "en-place" : "absent", note: m.sonar ? "SonarCloud à chaque envoi" : "job prêt dans la CI, projet SonarCloud à créer" },
    { titre: "Dépendances tenues à jour", etat: "partiel", note: "versions épinglées et surcharges de sécurité dans package.json ; pas encore de Dependabot" },
    { titre: "Sauvegardes", etat: m.sauvegardeRecente ? "en-place" : "partiel", note: m.sauvegardeRecente ? "sauvegarde téléchargée il y a moins de sept jours" : "export manuel disponible ; plan Supabase gratuit sans sauvegarde automatique" },
    { titre: "Environnement de staging séparé", etat: "absent", note: "les previews Vercel partagent la base de production (A-10 au backlog)" },
    { titre: "Tests de bout en bout", etat: "absent", note: "scanner et formulaires recettés à la main (docs/admin/04-recette.md)" }
  ];
}

export function checklistRgpd(): Point[] {
  return [
    { titre: "Politique de confidentialité et mentions légales", etat: "en-place", note: "pages /confidentialite et /mentions-legales" },
    { titre: "Consentement à l’image", etat: "en-place", note: "accord explicite par membre, visible sur chaque liste d’inscrits et dans l’export" },
    { titre: "Décharge de responsabilité versionnée", etat: "en-place", note: "acceptée à l’inscription, version enregistrée" },
    { titre: "Suppression du compte par le membre", etat: "en-place", note: "depuis le profil, avec conservation de l’historique des sorties annulées, pas effacées" },
    { titre: "Minimisation", etat: "en-place", note: "notes médicales hors de portée de l’admin ; IP tronquées dans les journaux ; visites sans cookie" },
    { titre: "Durées de conservation écrites", etat: "en-place", note: "journal admin douze mois, journal des connexions six mois, visites treize mois" },
    { titre: "Traçabilité des accès aux données personnelles", etat: "en-place", note: "chaque export d’inscrits et chaque sauvegarde est tracé avec son auteur" },
    { titre: "Accès restreint aux données personnelles", etat: "en-place", note: "admins nommés, révocables depuis l’interface, double vérification" },
    { titre: "Sous-traitants listés", etat: "partiel", note: "Supabase (UE, Paris), Vercel (CDN mondial, fonctions à Paris), Resend ; à écrire dans la politique de confidentialité" },
    { titre: "Registre des traitements", etat: "absent", note: "à rédiger : membres, inscriptions, présences, fidélité, visites, journaux" },
    { titre: "Droit d’accès et de portabilité", etat: "partiel", note: "le membre voit ses données dans son espace ; pas encore d’export en un clic" },
    { titre: "Transferts hors UE encadrés", etat: "partiel", note: "Vercel et Resend opèrent sous clauses contractuelles types ; à mentionner dans la politique" }
  ];
}
