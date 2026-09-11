/**
 * La decharge, version par version. Une version publiee ne se modifie
 * plus : un changement de fond cree une nouvelle version, et l'ancienne
 * reste consultable (/membre/decharge?version=...). Chaque membre garde
 * dans son profil la version qu'il a acceptee (consent_waiver_version).
 */
export type SectionDecharge = { title: string; text: string };

const RISQUES: SectionDecharge = {
  title: "1. Reconnaissance des risques.",
  text: "Je reconnais que la pratique de la course à pied et la participation aux runs, sorties, événements et activités organisés par NULLL.CLUB comportent des risques inhérents (chutes, blessures, malaises, accidents, aléas liés à la voie publique, à la circulation et aux conditions météorologiques). Je déclare y participer librement et en pleine connaissance de ces risques."
};

const SANTE: SectionDecharge = {
  title: "2. État de santé.",
  text: "Je déclare être en condition physique me permettant de pratiquer la course à pied, ne pas avoir connaissance de contre-indication médicale, et participer sous ma propre responsabilité. Il m'appartient de m'assurer de mon aptitude et, en cas de doute, de consulter un médecin."
};

const RECOURS: SectionDecharge = {
  title: "3. Renonciation à recours.",
  text: "Je participe sous mon entière responsabilité et renonce à tout recours contre NULLL.CLUB, ses organisateurs, ses bénévoles et ses membres en cas de dommages, blessures ou séquelles consécutifs à ma participation, notamment ceux résultant de mon propre état de santé ou d'une préparation insuffisante, sauf faute avérée de l'organisateur."
};

const EFFETS: SectionDecharge = {
  title: "4. Effets personnels.",
  text: "NULLL.CLUB décline toute responsabilité en cas de vol, perte ou dégradation des effets personnels et du matériel."
};

const MINEURS: SectionDecharge = {
  title: "5. Mineurs.",
  text: "La participation d'une personne mineure requiert l'autorisation préalable d'un représentant légal."
};

export const DECHARGES: Record<string, { depuis: string; sections: SectionDecharge[] }> = {
  "v1-2026-06": {
    depuis: "juin 2026",
    sections: [
      RISQUES,
      SANTE,
      RECOURS,
      EFFETS,
      MINEURS,
      {
        title: "6. Données personnelles.",
        text: "J'accepte que mes nom, prénom et e-mail soient utilisés pour la gestion de mon compte membre et du programme de fidélité, conformément au RGPD. Je dispose d'un droit d'accès, de rectification et de suppression."
      }
    ]
  },
  // Seul l'article 6 change : le programme de fidelite est en pause.
  "v2-2026-09": {
    depuis: "septembre 2026",
    sections: [
      RISQUES,
      SANTE,
      RECOURS,
      EFFETS,
      MINEURS,
      {
        title: "6. Données personnelles.",
        text: "J'accepte que mes nom, prénom et e-mail soient utilisés pour la gestion de mon compte membre et de mes inscriptions aux sorties, conformément au RGPD. Je dispose d'un droit d'accès, de rectification et de suppression."
      }
    ]
  }
};

/** Version proposee aux nouveaux membres. */
export const VERSION_DECHARGE = "v2-2026-09";
