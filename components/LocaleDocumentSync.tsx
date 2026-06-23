"use client";

import { useEffect } from "react";

type LocaleDocumentSyncProps = {
  locale: "fr" | "eng";
};

export function LocaleDocumentSync({ locale }: LocaleDocumentSyncProps) {
  useEffect(() => {
    document.documentElement.lang = locale === "fr" ? "fr" : "en";
    document.documentElement.dataset.lang = locale;
  }, [locale]);

  return null;
}
