import type { ReactNode } from "react";

type LocalizedTextProps = {
  en: ReactNode;
  fr: ReactNode;
};

export function LocalizedText({ en, fr }: LocalizedTextProps) {
  return (
    <>
      <span className="lang-en">{en}</span>
      <span className="lang-fr">{fr}</span>
    </>
  );
}
