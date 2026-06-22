export const navItems = [
  { key: "home", label: "01. HOME", labelFr: "01. ACCUEIL", href: "/" },
  { key: "runs", label: "02. RUNS", labelFr: "02. RUNS", href: "/runs" },
  { key: "community", label: "03. COMMUNITY", labelFr: "03. COMMUNAUTE", href: "/community" },
  { key: "merch", label: "04. MERCH", labelFr: "04. MERCH", href: "/merch" },
  { key: "about", label: "05. ABOUT", labelFr: "05. A PROPOS", href: "/about" },
  { key: "contact", label: "06. CONTACT", labelFr: "06. CONTACT", href: "/contact" }
] as const;

export const runFacts = [
  {
    label: "NEXT DROP",
    value: "25.06.2026",
    detail: "19:12 / ROTONDE"
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
    id: "drop-001",
    date: "SAT 07 JUN",
    time: "19:00",
    title: "Next Drop",
    route: "4.8 KM / CITY LOOP",
    start: "Aix-en-Provence",
    status: "OPEN"
  },
  {
    id: "drop-002",
    date: "SAT 21 JUN",
    time: "19:30",
    title: "Next Drop",
    route: "7.2 KM / SOFT CLIMB",
    start: "Aix-en-Provence",
    status: "DROP SOON"
  },
  {
    id: "drop-003",
    date: "SAT 05 JUL",
    time: "19:30",
    title: "Next Drop",
    route: "5.5 KM / CHAT FIRST",
    start: "Aix-en-Provence",
    status: "WAITLIST"
  }
] as const;

export const merchItems = [
  {
    id: "tee-blackout",
    name: "BLACKOUT TEE",
    price: "38 EUR",
    variant: "black",
    caption: "Club mark. Heavy cotton. Zero finesse."
  },
  {
    id: "tee-white-noise",
    name: "WHITE NOISE TEE",
    price: "38 EUR",
    variant: "white",
    caption: "Runs badly. Washes worse. Looks correct."
  },
  {
    id: "tee-warning",
    name: "SOCIAL WARNING TEE",
    price: "42 EUR",
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
