"use client";

import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { decodeMemberQrToken } from "../../../../lib/qr/token";
import { scanRegistration } from "../../courses-actions";
import { MESSAGES_SCAN, type CheckinOutcome } from "../../../../lib/races/types";

type Course = { id: string; title: string; start_datetime: string };

/** Chaque issue a sa couleur : sur le terrain on lit l'ecran d'un coup d'oeil. */
const ALLURE: Record<string, string> = {
  success: "bg-[#ffb000] text-[#351815]",
  already_checked_in: "bg-[#f6eadf] text-[#351815]",
  wrong_race: "bg-[#d96ab4] text-[#351815]",
  cancelled_registration: "bg-[#351815] text-[#f6eadf]",
  invalid_qr: "bg-[#351815] text-[#f6eadf]",
  forbidden: "bg-[#351815] text-[#f6eadf]"
};

export function RaceScanner({ courses, courseInitiale }: { courses: Course[]; courseInitiale?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  // Le rendu ne suit pas assez vite pour la boucle de decodage : la course
  // choisie est aussi gardee dans une ref, sinon un changement de course
  // n'atteindrait pas le callback deja en cours.
  const courseRef = useRef<string>(courseInitiale ?? courses[0]?.id ?? "");
  const dernierRef = useRef<string>("");

  const [courseId, setCourseId] = useState(courseRef.current);
  const [statut, setStatut] = useState("Caméra en attente.");
  const [resultat, setResultat] = useState<CheckinOutcome | null>(null);
  const [enCours, startTransition] = useTransition();

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

      const reponse = await scanRegistration({}, donnees);

      if (reponse.error) {
        setResultat({ ok: false, result: "invalid_qr" });
        setStatut(reponse.error);
      } else if (reponse.resultat) {
        setResultat(reponse.resultat);
        setStatut(MESSAGES_SCAN[reponse.resultat.result] ?? "Résultat inconnu");
      }

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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,.7fr)]">
      <div className="grid gap-4">
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

        <div className="border-2 border-[#351815] bg-[#351815] p-2">
          <video className="aspect-square w-full bg-black object-cover" muted playsInline ref={videoRef} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="nav-link" onClick={() => void demarrer()} type="button">
            Relancer la caméra
          </button>
          <button className="nav-link" onClick={arreter} type="button">
            Couper
          </button>
        </div>
      </div>

      <aside className="grid content-start gap-4">
        <div
          aria-live="polite"
          className={`border-2 border-[#351815] p-5 ${resultat ? ALLURE[resultat.result] ?? "bg-[#f6eadf]" : "bg-[#f6eadf]"}`}
        >
          <p className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] opacity-70">
            {enCours ? "Lecture…" : "Dernier scan"}
          </p>
          <p className="mt-3 font-display text-[clamp(1.8rem,4.5vw,2.8rem)] uppercase leading-none">
            {resultat ? MESSAGES_SCAN[resultat.result] : "En attente"}
          </p>
          {nom ? <p className="mt-3 text-lg font-bold">{nom}</p> : null}
          <p className="mt-3 font-mono text-[.62rem] font-black uppercase tracking-[.12em] opacity-70">{statut}</p>
        </div>

        <p className="font-mono text-[.6rem] font-black uppercase leading-relaxed tracking-[.12em] text-[#351815]/45">
          Un QR d’une autre sortie est refusé, et le refus est tracé. Chaque scan est enregistré, même raté.
        </p>
      </aside>
    </div>
  );
}
