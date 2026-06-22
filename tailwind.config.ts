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
        paper: "#ffffff",
        ash: "#a7a7a7",
        rust: "#d64a24",
        shock: "#ff3fb4"
      },
      fontFamily: {
        display: ["Haettenschweiler", "Impact", "Arial Narrow", "Arial", "sans-serif"],
        mono: ["Courier New", "Courier", "monospace"],
        sans: ["Arial", "Helvetica", "sans-serif"]
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
