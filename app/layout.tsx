import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NULLL.CLUB | Aix-en-Provence Social Run Club",
  description:
    "NULLL.CLUB is a social run club in Aix-en-Provence. Running is just the excuse. Make it real.",
  openGraph: {
    title: "NULLL.CLUB",
    description: "Running is just the excuse. Aix-en-Provence social run club.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
