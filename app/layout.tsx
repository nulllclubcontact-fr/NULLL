import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Roboto_Condensed, Caveat } from "next/font/google";
import "./globals.css";

// Le site n'embarquait aucune police : il comptait sur Haettenschweiler,
// livree avec Microsoft Office. Les visiteurs qui ne l'ont pas retombaient
// sur Arial, bien plus large — et le letter-spacing negatif des titres,
// calibre pour une police ultra-condensee, collait les lettres entre elles.
// next/font telecharge les polices au build et les sert depuis le domaine :
// pas d'appel externe a l'execution, et pas de saut de mise en page.
/**
 * Trois roles, deux familles telechargees.
 *
 * Roboto Condensed porte tout le texte : en 900 pour les titres, en 400
 * pour la lecture courante, en 500/700 pour les intitules en capitales.
 * Une seule famille pour trois usages, ce qui tient l'ensemble.
 *
 * Caveat est l'ecriture manuscrite, reservee aux titres qu'on veut
 * decontractes. A garder rare : c'est ce qui la rend efficace.
 *
 * Arpona, la police du logo, n'est pas chargee — elle n'a pas a l'etre.
 * Le logo est servi en image partout (logo-cream.png, logo-burgundy.png),
 * donc son dessin est deja fige dedans.
 */
const police_display = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-display",
  // Ajuste les metriques du repli pour qu'un chargement lent ne decale rien.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Helvetica Neue", "Arial", "sans-serif"]
});

/**
 * Les intitules en capitales du site — « 01 — NULLL.CLUB », les chapeaux —
 * passaient par une machine a ecrire. Ils prennent desormais la meme
 * famille condensee que le reste.
 *
 * La variable garde son nom : elle est citee 260 fois dans le projet, et
 * la renommer partout pour un gain cosmetique serait un mauvais echange.
 * Elle designe ici un role — l'intitule technique — pas une chasse fixe.
 */
const police_mono = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["Arial Narrow", "Arial", "sans-serif"]
});

const police_main = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-hand",
  fallback: ["Bradley Hand", "Segoe Script", "cursive"]
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
    <html className={`${police_display.variable} ${police_mono.variable} ${police_main.variable}`} lang="fr">
      <body>{children}</body>
    </html>
  );
}
