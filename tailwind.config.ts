import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        "ink-soft": "#070707",
        paper: "#ffffff",
        ash: "#a7a7a7",
        rust: "#d64a24",
        accent: "#ff3fb4",
        shock: "#ff3fb4"
      },
      fontFamily: {
        // Les variables viennent de next/font (voir app/layout.tsx). Les noms
        // systeme restent en repli pour le cas ou la police ne charge pas.
        display: ["var(--font-display)", "Haettenschweiler", "Impact", "Arial Narrow", "sans-serif"],
        // « mono » designe ici un role — l intitule technique en capitales —
        // et non une chasse fixe. Le nom est conserve parce qu il est cite
        // 260 fois dans le projet.
        mono: ["var(--font-mono)", "Arial Narrow", "Arial", "sans-serif"],
        // Le texte courant prend la condensee, jamais Anton : une police
        // d affiche ne se lit pas en paragraphe.
        sans: ["var(--font-mono)", "Arial Narrow", "Helvetica Neue", "Arial", "sans-serif"],
        // L ecriture manuscrite, pour les titres decontractes. A garder rare.
        hand: ["var(--font-hand)", "Bradley Hand", "Segoe Script", "cursive"]
      },
      animation: {
        marquee: "marquee 24s linear infinite",
        jitter: "jitter 7s steps(1, end) infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        jitter: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "18%": { transform: "translate(2px, -1px)" },
          "41%": { transform: "translate(-2px, 1px)" },
          "63%": { transform: "translate(1px, 2px)" },
          "82%": { transform: "translate(-1px, -2px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
