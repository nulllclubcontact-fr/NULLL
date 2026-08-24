"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60)
  };
}

/**
 * Compte a rebours jusqu'au depart. Rendu uniquement cote client pour
 * eviter tout ecart entre le HTML serveur et le navigateur.
 */
export function Countdown({ isoDate, centered = false }: { isoDate: string; centered?: boolean }) {
  const target = new Date(isoDate).getTime();
  const [parts, setParts] = useState<Parts | null>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  useEffect(() => {
    const update = () => setParts(diff(target));
    const initialId = window.setTimeout(update, 0);
    const intervalId = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
    };
  }, [target]);

  if (!mounted) {
    return <div aria-hidden="true" className="countdown-shell" />;
  }

  if (!parts) {
    return (
      <p className="font-display text-[clamp(2rem,3.4vw,3rem)] uppercase leading-none">
        C’est aujourd’hui.
      </p>
    );
  }

  const cells: Array<[number, string]> = [
    [parts.days, "jours"],
    [parts.hours, "heures"],
    [parts.minutes, "min"],
    [parts.seconds, "sec"]
  ];

  return (
    <div className="countdown-shell">
      <p className="font-mono text-xs font-black uppercase tracking-[.18em] opacity-65">Départ dans</p>
      <div className={`mt-3 flex items-end gap-4 sm:gap-6 ${centered ? "justify-center" : ""}`}>
        {cells.map(([value, label], index) => (
          <div className="flex items-end gap-4 sm:gap-6" key={label}>
            <div>
              <span className="countdown-value font-display">{String(value).padStart(2, "0")}</span>
              <span className="mt-1 block font-mono text-[.6rem] font-black uppercase tracking-[.14em] opacity-50">
                {label}
              </span>
            </div>
            {index < cells.length - 1 ? (
              <span aria-hidden="true" className="countdown-sep font-display">:</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
