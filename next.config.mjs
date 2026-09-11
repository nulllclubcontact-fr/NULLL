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

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securite }];
  }
};

export default nextConfig;
