/** Statuts d'une course, tels que la contrainte SQL les autorise. */
export type RaceStatus = "draft" | "published" | "closed" | "completed" | "cancelled";

/** Statuts d'une inscription. */
export type RegistrationStatus = "registered" | "cancelled" | "checked_in" | "no_show";

/** Issues possibles d'un scan, tracees dans checkins. */
export type ScanResult =
  | "success"
  | "already_checked_in"
  | "invalid_qr"
  | "wrong_race"
  | "cancelled_registration";

export type Race = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  address: string | null;
  city: string | null;
  start_datetime: string;
  end_datetime: string | null;
  distance_km: number | null;
  max_participants: number | null;
  registration_open: boolean;
  registration_deadline: string | null;
  status: RaceStatus;
  cover_image_url: string | null;
};

export type Registration = {
  id: string;
  race_id: string;
  user_id: string;
  qr_code_token: string;
  status: RegistrationStatus;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

/** Une inscription accompagnee de sa course : ce que l'espace compte affiche. */
export type RegistrationWithRace = Registration & { races: Race | null };

/**
 * Reponse des fonctions SQL register_for_race et cancel_registration.
 * Elles ne levent pas d'exception : elles decrivent le refus, pour que
 * l'interface puisse dire pourquoi plutot que « une erreur est survenue ».
 */
export type RegisterOutcome = {
  ok: boolean;
  reason:
    | "registered"
    | "reactivated"
    | "already_registered"
    | "race_full"
    | "race_unavailable"
    | "registration_closed"
    | "deadline_passed"
    | "race_started"
    | "not_authenticated";
  token?: string;
};

export type CheckinOutcome = {
  ok: boolean;
  result: ScanResult | "forbidden";
  first_name?: string | null;
  last_name?: string | null;
  checked_in_at?: string | null;
};

/** Une seule source pour les libelles : l'interface ne les reinvente pas. */
export const MESSAGES_INSCRIPTION: Record<RegisterOutcome["reason"], string> = {
  registered: "Tu es inscrit. Ton QR t’attend dans ton compte.",
  reactivated: "Inscription réactivée. Ton QR est de nouveau valable.",
  already_registered: "Tu es déjà inscrit à cette sortie.",
  race_full: "Cette sortie est complète.",
  race_unavailable: "Cette sortie n’est plus disponible.",
  registration_closed: "Les inscriptions sont fermées pour cette sortie.",
  deadline_passed: "La date limite d’inscription est passée.",
  race_started: "Cette sortie a déjà eu lieu.",
  not_authenticated: "Connecte-toi pour t’inscrire."
};

export const MESSAGES_SCAN: Record<CheckinOutcome["result"], string> = {
  success: "Présence validée",
  already_checked_in: "Déjà scanné",
  invalid_qr: "QR inconnu",
  wrong_race: "QR d’une autre sortie",
  cancelled_registration: "Inscription annulée",
  forbidden: "Accès refusé"
};
