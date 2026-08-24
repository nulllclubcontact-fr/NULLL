import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nulll.club"),
  title: "NULLL.CLUB | Club de course à Aix-en-Provence",
  description:
    "NULLL.CLUB est un club de course ouvert à tous à Aix-en-Provence.",
  verification: {
    google: "fNfY1cH-yZV7xIDDC6nfD4skGeF04uJSexk94VyoQSY"
  },
  icons: {
    icon: "/assets/brand/nulll-mark.png",
    shortcut: "/assets/brand/nulll-mark.png",
    apple: "/assets/brand/nulll-mark.png"
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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
