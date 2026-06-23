export const navItems = [
  { key: "home", label: "01. HOME", labelFr: "01. ACCUEIL", href: "/" },
  { key: "runs", label: "02. RUNS", labelFr: "02. RUNS", href: "/runs" },
  { key: "community", label: "03. COMMUNITY", labelFr: "03. COMMUNITY", href: "/community" },
  { key: "merch", label: "04. MERCH", labelFr: "04. MERCH", href: "/merch" },
  { key: "about", label: "05. ABOUT", labelFr: "05. A PROPOS", href: "/about" },
  { key: "contact", label: "06. CONTACT", labelFr: "06. CONTACT", href: "/contact" }
] as const;

export const runFacts = [
  {
    label: "PROCHAIN RUN",
    value: "12.09.2026",
    detail: "AIX / DJ SETS APRES"
  },
  {
    label: "LOCATION",
    value: "AIX-EN-PROVENCE",
    detail: "43.5297 N / 5.4474 E"
  },
  {
    label: "PACE",
    value: "NO EGO",
    detail: "TALKING SPEED ACCEPTED"
  },
  {
    label: "RULE",
    value: "COME AS YOU ARE",
    detail: "NO GEAR CHECK"
  }
] as const;

export type NavKey = (typeof navItems)[number]["key"];

export const upcomingRuns = [
  {
    id: "run-001",
    date: "SAM 12 SEP",
    dateEn: "SAT 12 SEP",
    time: "08:30",
    title: "Prochain Run",
    titleEn: "Next Run",
    fullDate: "12 septembre 2026",
    fullDateEn: "September 12, 2026",
    route: "5 KM / SOCIAL LOOP",
    routeEn: "5 KM / SOCIAL LOOP",
    start: "Aix-en-Provence",
    status: "DJ SETS APRES"
  },
  {
    id: "run-002",
    date: "SAM 19 SEP",
    dateEn: "SAT 19 SEP",
    time: "08:30",
    title: "Prochain Run",
    titleEn: "Next Run",
    fullDate: "19 septembre 2026",
    fullDateEn: "September 19, 2026",
    route: "6 KM / NO EGO PACE",
    routeEn: "6 KM / NO EGO PACE",
    start: "Aix-en-Provence",
    status: "DJ SETS APRES"
  },
  {
    id: "run-003",
    date: "SAM 26 SEP",
    dateEn: "SAT 26 SEP",
    time: "08:30",
    title: "Prochain Run",
    titleEn: "Next Run",
    fullDate: "26 septembre 2026",
    fullDateEn: "September 26, 2026",
    route: "5.5 KM / TALK FIRST",
    routeEn: "5.5 KM / TALK FIRST",
    start: "Aix-en-Provence",
    status: "DJ SETS APRES"
  }
] as const;

export const merchItems = [
  {
    id: "tee-blackout",
    name: "BLACKOUT TEE",
    price: "35 EUR",
    amount: 35,
    variant: "black",
    caption: "Club mark. Heavy cotton. Zero finesse."
  },
  {
    id: "tee-white-noise",
    name: "WHITE NOISE TEE",
    price: "35 EUR",
    amount: 35,
    variant: "white",
    caption: "Runs badly. Washes worse. Looks correct."
  },
  {
    id: "tee-warning",
    name: "SOCIAL WARNING TEE",
    price: "35 EUR",
    amount: 35,
    variant: "warning",
    caption: "Not a running brand. A public signal."
  }
] as const;

export const slogans = [
  "NO PACE. NO EGO. NO EXCUSE.",
  "RUN BAD. MEET PEOPLE.",
  "AIX IS TOO SMALL TO STAY ALONE.",
  "SPORT IS THE PRETEXT.",
  "COME ALONE. LEAVE CONNECTED.",
  "MAKE IT REAL."
] as const;

export const contactInfo = {
  instagram: "https://www.instagram.com/nulll.club",
  instagramLabel: "@nulll.club",
  email: "contact@nulll.club",
  linkedin: "https://www.linkedin.com/company/nulll-club/"
} as const;

export const firstRunTargetIso = "2026-09-12T08:30:00+02:00";
