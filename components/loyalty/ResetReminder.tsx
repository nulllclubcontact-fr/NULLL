"use client";

import { useEffect, useMemo, useState } from "react";

type ResetReminderProps = {
  currentMonthPoints: number;
};

type TimeLeft = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
};

function getParisParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23"
  }).formatToParts(date);

  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function getParisOffsetMs(date: Date) {
  const parts = getParisParts(date);
  const utcEquivalent = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);

  return utcEquivalent - date.getTime();
}

function getNextParisMonthStart(now: Date) {
  const parts = getParisParts(now);
  const nextMonth = parts.month === 12 ? 1 : parts.month + 1;
  const nextYear = parts.month === 12 ? parts.year + 1 : parts.year;
  const utcGuess = new Date(Date.UTC(nextYear, nextMonth - 1, 1, 0, 0, 0));
  const offset = getParisOffsetMs(utcGuess);

  return new Date(utcGuess.getTime() - offset);
}

function getTimeLeft(now: Date): TimeLeft {
  const resetAt = getNextParisMonthStart(now);
  const totalMs = Math.max(resetAt.getTime() - now.getTime(), 0);
  const totalMinutes = Math.ceil(totalMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return { totalMs, days, hours, minutes };
}

function formatTimeLeft(timeLeft: TimeLeft) {
  if (timeLeft.days > 0) {
    return `${timeLeft.days}j ${timeLeft.hours}h`;
  }

  if (timeLeft.hours > 0) {
    return `${timeLeft.hours}h ${timeLeft.minutes}min`;
  }

  return `${timeLeft.minutes}min`;
}

export function ResetReminder({ currentMonthPoints }: ResetReminderProps) {
  const [now, setNow] = useState(() => new Date());
  const timeLeft = useMemo(() => getTimeLeft(now), [now]);
  const isUrgent = timeLeft.totalMs <= 5 * 24 * 60 * 60 * 1000;
  const hasPoints = currentMonthPoints > 0;

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60000);

    return () => window.clearInterval(interval);
  }, []);

  const message = !hasPoints
    ? "Commence a scanner pour debloquer ta premiere reduc."
    : isUrgent
      ? "Apres, retour a zero. Fais-les compter."
      : "Tes points sautent bientot. Profite de ton palier maintenant.";

  return (
    <section
      aria-live="polite"
      className={`border-2 p-5 md:p-6 ${
        isUrgent ? "border-[#351815] bg-[#ffb000] text-[#351815]" : "border-[#351815] bg-[#351815] text-[#f6eadf] panel-grid"
      }`}
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className={`font-mono text-sm font-black uppercase ${isUrgent ? "text-[#351815]/70" : "text-[#ffb000]"}`}>
            Reset mensuel
          </p>
          <p className="mt-3 font-display text-[clamp(2.8rem,8vw,6.6rem)] uppercase leading-none">{message}</p>
        </div>
        <div className={`border-2 p-4 text-right ${isUrgent ? "border-[#351815] bg-[#351815] text-[#ffb000]" : "border-[#f6eadf] bg-[#f6eadf] text-[#351815]"}`}>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em]">Reset dans</p>
          <p className="mt-2 font-display text-[clamp(3rem,8vw,6rem)] uppercase leading-none">{formatTimeLeft(timeLeft)}</p>
        </div>
      </div>
    </section>
  );
}
