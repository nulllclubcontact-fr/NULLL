"use client";

import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { decodeMemberQrToken } from "../../../../lib/qr/token";
import { compterSortie, scanRegistration } from "../../courses-actions";
import { MESSAGES_SCAN, type CheckinOutcome } from "../../../../lib/races/types";

type Course = { id: string; title: string; start_datetime: string };

/**
 * Scans faits sans reseau, gardes dans le navigateur jusqu'au retour de
 * la connexion. Un parking a 8 h n'a pas toujours de 4G ; une presence
 * ne doit pas se perdre pour autant. L'heure de pointage enregistree
 * sera celle du renvoi, pas celle du scan : acceptable pour une presence.
 */
const CLE_ATTENTE = "nulll_scans_attente";
type ScanAttente = { token: string; raceId: string; at: number };

function lireAttente(): ScanAttente[] {
  try {
    const brut = window.localStorage.getItem(CLE_ATTENTE);
    const liste = brut ? (JSON.parse(brut) as unknown) : [];
    return Array.isArray(liste) ? (liste as ScanAttente[]).filter((s) => typeof s.token === "string" && typeof s.raceId === "string") : [];
  } catch {
    return [];
  }
}

function ecrireAttente(liste: ScanAttente[]) {
  try {
    window.localStorage.setItem(CLE_ATTENTE, JSON.stringify(liste));
  } catch {
    // Stockage indisponible (navigation privee) : le scan est perdu, et on le dit.
  }
}

/** Chaque issue a sa couleur : sur le terrain on lit l'ecran d'un coup d'oeil. */
const ALLURE: Record<string, string> = {
  success: "bg-[#FFB200] text-[#773331]",
  already_checked_in: "bg-[#F1EDE9] text-[#773331]",
  wrong_race: "bg-[#EBA0CD] text-[#773331]",
  race_unavailable: "bg-[#EBA0CD] text-[#773331]",
  cancelled_registration: "bg-[#773331] text-[#F1EDE9]",
  invalid_qr: "bg-[#773331] text-[#F1EDE9]",
  forbidden: "bg-[#773331] text-[#F1EDE9]"
};

export function RaceScanner({ courses, courseInitiale }: { courses: Course[]; courseInitiale?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  // Le rendu ne suit pas assez vite pour la boucle de decodage : la course
  // choisie est aussi gardee dans une ref, sinon un changement de course
  // n'atteindrait pas le callback deja en cours.
  const premiere = courseInitiale ?? courses[0]?.id ?? "";
  const courseRef = useRef<string>(premiere);
  const dernierRef = useRef<string>("");

  const [courseId, setCourseId] = useState(premiere);
  const [statut, setStatut] = useState("Caméra en attente.");
  const [resultat, setResultat] = useState<CheckinOutcome | null>(null);
  const [enCours, startTransition] = useTransition();
  const [compteurs, setCompteurs] = useState<{ inscrits: number; scannes: number } | null>(null);
  const [relecture, setRelecture] = useState(0);
  const [enAttente, setEnAttente] = useState(0);
  const renvoiRef = useRef(false);

  // Les scans gardes hors ligne repartent des que le reseau revient, et
  // sont retentes toutes les quinze secondes tant qu'il en reste.
  const renvoyerAttente = useCallback(async () => {
    let liste = lireAttente();
    setEnAttente(liste.length);

    if (renvoiRef.current || liste.length === 0 || !navigator.onLine) return;
    renvoiRef.current = true;

    try {
      while (liste.length > 0) {
        const scan = liste[0];
        const donnees = new FormData();
        donnees.set("token", scan.token);
        donnees.set("race_id", scan.raceId);

        let reponse;
        try {
          reponse = await scanRegistration({}, donnees);
        } catch {
          // Toujours hors ligne : on garde le reste pour plus tard.
          break;
        }

        liste = liste.slice(1);
        ecrireAttente(liste);

        if (reponse.resultat) {
          setResultat(reponse.resultat);
          setStatut(`Renvoyé : ${MESSAGES_SCAN[reponse.resultat.result] ?? "résultat inconnu"}`);
        }
      }

      setEnAttente(liste.length);
      setRelecture((n) => n + 1);
    } finally {
      renvoiRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Meme detour que la camera : hors du corps de l'effet, pour ne pas
    // enchainer un rendu sur l'autre au montage.
    const t = window.setTimeout(() => void renvoyerAttente(), 0);
    window.addEventListener("online", renvoyerAttente);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("online", renvoyerAttente);
    };
  }, [renvoyerAttente]);

  useEffect(() => {
    if (enAttente === 0) return;
    const t = window.setInterval(() => void renvoyerAttente(), 15000);
    return () => window.clearInterval(t);
  }, [enAttente, renvoyerAttente]);

  // Inscrits et scannes de la sortie choisie, relus a chaque changement de
  // sortie et apres chaque scan : un autre admin peut scanner en meme temps.
  useEffect(() => {
    let actif = true;
    compterSortie(courseId).then((c) => {
      if (actif) setCompteurs(c);
    });
    return () => {
      actif = false;
    };
  }, [courseId, relecture]);

  const arreter = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }, []);

  const traiter = useCallback((texte: string) => {
    const token = decodeMemberQrToken(texte) ?? texte.trim();

    if (!token) return;

    // Un QR reste devant l'objectif plusieurs images d'affilee : sans ce
    // garde-fou, la meme inscription partirait des dizaines de fois.
    if (token === dernierRef.current) return;
    dernierRef.current = token;

    setStatut("Vérification…");

    startTransition(async () => {
      const donnees = new FormData();
      donnees.set("token", token);
      donnees.set("race_id", courseRef.current);

      let reponse;

      try {
        reponse = await scanRegistration({}, donnees);
      } catch {
        // Le serveur est injoignable : on garde le scan, il partira au
        // retour du reseau.
        const liste = [...lireAttente(), { token, raceId: courseRef.current, at: Date.now() }];
        ecrireAttente(liste);
        setEnAttente(lireAttente().length);
        setResultat(null);
        setStatut(lireAttente().length === liste.length ? "Hors ligne : scan gardé, il partira au retour du réseau." : "Hors ligne et stockage indisponible : ce scan est perdu.");
        window.setTimeout(() => {
          dernierRef.current = "";
        }, 3000);
        return;
      }

      if (reponse.error) {
        setResultat({ ok: false, result: "invalid_qr" });
        setStatut(reponse.error);
      } else if (reponse.resultat) {
        setResultat(reponse.resultat);
        setStatut(MESSAGES_SCAN[reponse.resultat.result] ?? "Résultat inconnu");
      }

      setRelecture((n) => n + 1);

      // On rouvre le meme QR au bout de trois secondes : le temps de lire
      // l'ecran, pas plus.
      window.setTimeout(() => {
        dernierRef.current = "";
      }, 3000);
    });
  }, []);

  const demarrer = useCallback(async () => {
    if (!videoRef.current || !courseRef.current) return;

    arreter();
    setStatut("Caméra ouverte. Présente un QR.");

    const lecteur = new BrowserQRCodeReader();

    try {
      controlsRef.current = await lecteur.decodeFromVideoDevice(undefined, videoRef.current, (lu) => {
        const texte = lu?.getText();
        if (texte) traiter(texte);
      });
    } catch {
      setStatut("Caméra bloquée. Autorise l’accès, et vérifie que la page est en HTTPS.");
    }
  }, [arreter, traiter]);

  useEffect(() => {
    const t = window.setTimeout(() => void demarrer(), 0);
    return () => {
      window.clearTimeout(t);
      arreter();
    };
  }, [demarrer, arreter]);

  const nom = [resultat?.first_name, resultat?.last_name].filter(Boolean).join(" ");

  return (
    <div className="race-scanner grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,.7fr)]">
      <div className="scanner-camera grid gap-4">
        <label className="account-field grid gap-2 font-mono text-xs font-black uppercase">
          <span>Sortie à pointer</span>
          <select
            className="field"
            onChange={(e) => {
              courseRef.current = e.target.value;
              setCourseId(e.target.value);
              setResultat(null);
              dernierRef.current = "";
            }}
            value={courseId}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <div className="scanner-video border-2 border-[#773331] bg-[#773331] p-2">
          <video className="aspect-square w-full bg-black object-cover" muted playsInline ref={videoRef} />
        </div>

        <div className="scanner-controls flex flex-wrap gap-2">
          <button className="nav-link" onClick={() => void demarrer()} type="button">
            Relancer la caméra
          </button>
          <button className="nav-link" onClick={arreter} type="button">
            Couper
          </button>
        </div>
      </div>

      <aside className="scanner-feedback grid content-start gap-4">
        <div aria-live="polite" className="scanner-counts grid grid-cols-2 border-2 border-[#773331]">
          <p className="border-r-2 border-[#773331] bg-[#FFB200] p-4">
            <span className="block font-display text-[clamp(2.6rem,7vw,3.6rem)] leading-none tabular-nums">{compteurs ? compteurs.scannes : "…"}</span>
            <span className="mt-2 block font-mono text-xs font-black uppercase tracking-[.14em]">Scannés</span>
          </p>
          <p className="bg-[#F1EDE9] p-4">
            <span className="block font-display text-[clamp(2.6rem,7vw,3.6rem)] leading-none tabular-nums">{compteurs ? compteurs.inscrits : "…"}</span>
            <span className="mt-2 block font-mono text-xs font-black uppercase tracking-[.14em]">Inscrits à la sortie</span>
          </p>
        </div>

        <div
          aria-live="polite"
          className={`scanner-result border-2 border-[#773331] p-5 ${resultat ? ALLURE[resultat.result] ?? "bg-[#F1EDE9]" : "bg-[#F1EDE9]"}`}
        >
          <p className="font-mono text-xs font-black uppercase tracking-[.16em] opacity-70">
            {enCours ? "Lecture…" : "Dernier scan"}
          </p>
          <p className="mt-3 font-display text-[clamp(1.8rem,4.5vw,2.8rem)] uppercase leading-none">
            {resultat ? MESSAGES_SCAN[resultat.result] : "En attente"}
          </p>
          {nom ? <p className="mt-3 text-lg font-bold">{nom}</p> : null}
        </div>

        <p aria-live="polite" className="scanner-status font-mono text-xs font-black uppercase tracking-[.12em] opacity-70">{statut}</p>

        {enAttente > 0 ? (
          <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 border-2 border-[#773331] bg-[#FFB200] p-4">
            <p className="font-mono text-xs font-black uppercase tracking-[.12em]">
              {enAttente} scan{enAttente > 1 ? "s" : ""} en attente de réseau
            </p>
            <button className="nav-link" onClick={() => void renvoyerAttente()} type="button">
              Renvoyer maintenant
            </button>
          </div>
        ) : null}

        <p className="font-mono text-xs font-black uppercase leading-relaxed tracking-[.12em] text-[#773331]">
          Un QR d’une autre sortie est refusé, et le refus est tracé. Chaque scan est enregistré, même raté.
        </p>
      </aside>
    </div>
  );
}
