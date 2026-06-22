"use client";

import { useEffect, useState } from "react";

type SiteLanguage = "en" | "fr";

type LanguageToggleProps = {
  className?: string;
};

function applyLanguage(nextLang: SiteLanguage) {
  document.documentElement.dataset.lang = nextLang;
  document.documentElement.lang = nextLang;
  window.localStorage.setItem("nulll-lang", nextLang);
}

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const [lang, setLang] = useState<SiteLanguage>("en");

  useEffect(() => {
    const savedLang = window.localStorage.getItem("nulll-lang") === "fr" ? "fr" : "en";
    setLang(savedLang);
    applyLanguage(savedLang);
  }, []);

  const nextLang = lang === "fr" ? "en" : "fr";

  return (
    <button
      aria-label={lang === "fr" ? "Switch site to English" : "Passer le site en francais"}
      className={`group grid place-items-center border-white bg-black px-3 py-3 font-mono text-xs font-black uppercase text-white transition hover:bg-shock hover:text-black ${className}`}
      onClick={() => {
        setLang(nextLang);
        applyLanguage(nextLang);
      }}
      type="button"
    >
      <span>
        {lang === "fr" ? "EN" : "FR"}
        <span className="text-shock group-hover:text-black"> / </span>
        {lang === "fr" ? "FR" : "EN"}
      </span>
    </button>
  );
}
