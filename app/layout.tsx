import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nulll.club"),
  title: "NULLL.CLUB | Social Run Club Aix-en-Provence",
  description:
    "NULLL.CLUB est un social run club a Aix-en-Provence. Sport is the pretext. Make it real.",
  icons: {
    icon: "/assets/brand/nulll-mark.png",
    shortcut: "/assets/brand/nulll-mark.png",
    apple: "/assets/brand/nulll-mark.png"
  },
  openGraph: {
    title: "NULLL.CLUB",
    description: "Sport is the pretext. Aix-en-Provence social run club.",
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
