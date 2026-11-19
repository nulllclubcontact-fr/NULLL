/**
 * Affiche tout de suite pendant que le serveur prepare la page : la barre
 * d'administration reste en place, seul le contenu attend. Sans ce fichier,
 * un clic sur un onglet ne donnait aucun signe de vie jusqu'a la reponse.
 */
export default function ChargementAdmin() {
  return (
    <section aria-busy="true" aria-label="Chargement" className="shell grid gap-10 py-8 lg:py-12">
      <div className="grid gap-4">
        <div className="h-3 w-32 animate-pulse bg-[#1E1A21]/20" />
        <div className="h-14 w-72 max-w-full animate-pulse bg-[#1E1A21]/20" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["bg-[#1E1A21]/25", "bg-[#E8459E]/60", "bg-[#FFC531]/50", "bg-[#1E1A21]/10"].map((teinte) => (
          <div className={`h-40 animate-pulse border-2 border-white/15 ${teinte}`} key={teinte} />
        ))}
      </div>
      <div className="grid gap-3">
        <div className="h-3 w-48 animate-pulse bg-[#1E1A21]/20" />
        <div className="h-24 animate-pulse border-2 border-white/30" />
        <div className="h-24 animate-pulse border-2 border-white/30" />
      </div>
    </section>
  );
}
