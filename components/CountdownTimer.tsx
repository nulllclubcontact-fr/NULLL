"use client";

import { useEffect, useMemo, useState } from "react";
import { firstRunTargetIso } from "../lib/content";
import { LocalizedText } from "./LocalizedText";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdownParts(targetTime: number): CountdownParts {
  const diff = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownTimer({ className = "" }: { className?: string }) {
  const targetTime = useMemo(() => new Date(firstRunTargetIso).getTime(), []);
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getCountdownParts(targetTime));
    tick();
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, [targetTime]);

  return (
    <div className={`font-mono uppercase ${className}`} aria-label="Compte a rebours jusqu'au prochain run">
      <span className="block text-[10px] leading-tight text-white/65">
        <LocalizedText en="Time to first run" fr="Time avant run" />
      </span>
      <span className="mt-1 block whitespace-nowrap text-[clamp(0.72rem,0.9vw,0.92rem)] font-black leading-tight text-shock">
        {parts ? `${parts.days}D ${pad(parts.hours)}H ${pad(parts.minutes)}M ${pad(parts.seconds)}S` : "--D --H --M --S"}
      </span>
    </div>
  );
}
