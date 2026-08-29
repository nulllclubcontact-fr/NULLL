import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Anton, Courier_Prime } from "next/font/google";
import "./globals.css";

// Le site n'embarquait aucune police : il comptait sur Haettenschweiler,
// livree avec Microsoft Office. Les visiteurs qui ne l'ont pas retombaient
// sur Arial, bien plus large — et le letter-spacing negatif des titres,
// calibre pour une police ultra-condensee, collait les lettres entre elles.
// next/font telecharge les polices au build et les sert depuis le domaine :
// pas d'appel externe a l'execution, et pas de saut de mise en page.
const police_display = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
  // Ajuste les metriques du repli pour qu'un chargement lent ne decale rien.
  adjustFontFallback: false,
  fallback: ["Haettenschweiler", "Impact", "Arial Narrow", "sans-serif"]
});

const police_mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["Courier New", "Courier", "monospace"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nulll.club"),
  title: "NULLL.CLUB | Club de course à Aix-en-Provence",
  description:
    "NULLL.CLUB est un club de course ouvert à tous à Aix-en-Provence.",
  verification: {
    google: "fNfY1cH-yZV7xIDDC6nfD4skGeF04uJSexk94VyoQSY"
  },
  icons: {
    // Trois tailles plutot qu'un seul fichier : l'onglet prend le 32,
    // l'ecran d'accueil iOS le 180, le reste le 512.
    icon: [
      { url: "/assets/brand/icone-n-rose-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/brand/icone-n-rose.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/assets/brand/icone-n-rose-32.png",
    apple: "/assets/brand/icone-n-rose-180.png"
  },
  openGraph: {
    title: "NULLL.CLUB",
    description: "Club de course ouvert à tous à Aix-en-Provence.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#f6eadf",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={`${police_display.variable} ${police_mono.variable}`} lang="fr">
      <body>{children}</body>
    </html>
  );
}
