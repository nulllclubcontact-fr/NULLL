/**
 * En-tetes de securite sur toutes les pages. Pas de CSP complete : le
 * bouton Google et Supabase chargent des scripts et des cadres qu'une
 * politique trop stricte casserait sans prevenir. On ferme deja l'essentiel :
 * le site ne peut pas etre affiche dans le cadre d'un autre (clickjacking),
 * le navigateur ne devine pas les types de fichiers, et la camera n'est
 * ouverte qu'au site lui-meme (scanner du jour de course).
 */
const securite = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" }
];

/**
 * CSP complete, en mode observation seulement : rien n'est bloque, chaque
 * violation est envoyee a /api/csp et finit dans les logs. Quand deux
 * semaines passent sans rapport legitime (Google, Apple, Supabase,
 * Vercel), elle pourra remplacer la ligne frame-ancestors ci-dessus.
 * 'unsafe-inline' sur script-src : Next injecte des scripts en ligne sans
 * nonce dans cette configuration ; a resserrer avec des nonces ensuite.
 */
const cspObservation = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://accounts.google.com https://vercel.live https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://accounts.google.com",
  "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://vitals.vercel-insights.com https://vercel.live",
  "frame-src https://accounts.google.com https://appleid.apple.com https://vercel.live",
  "form-action 'self' https://appleid.apple.com https://accounts.google.com",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "report-uri /api/csp"
].join("; ");

securite.push({ key: "Content-Security-Policy-Report-Only", value: cspObservation });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Les photos de sortie deposees dans Supabase passent par l'optimiseur
  // (tailles adaptees, WebP/AVIF) au lieu d'etre servies brutes, jusqu'a
  // 10 Mo. Seul le stockage public du projet est autorise.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }]
  },
  async headers() {
    return [{ source: "/:path*", headers: securite }];
  }
};

export default nextConfig;
