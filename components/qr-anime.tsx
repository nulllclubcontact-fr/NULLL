"use client";

/**
 * QR décoratif, présenté comme un ticket : c'est l'objet que le compte
 * donne au membre, le montrer vaut mieux que l'écrire.
 *
 * Le motif est calcule, pas tire au hasard : un Math.random() donnerait un
 * rendu different sur le serveur et dans le navigateur, et React signalerait
 * une erreur d'hydratation.
 */
const TAILLE = 21;

function estRepere(x: number, y: number) {
  const dans = (dx: number, dy: number) => {
    const ax = Math.abs(x - dx);
    const ay = Math.abs(y - dy);
    return Math.max(ax, ay) <= 3;
  };
  return dans(3, 3) || dans(TAILLE - 4, 3) || dans(3, TAILLE - 4);
}

function moduleRepere(x: number, y: number) {
  const centre = (dx: number, dy: number) => Math.max(Math.abs(x - dx), Math.abs(y - dy));
  for (const [dx, dy] of [
    [3, 3],
    [TAILLE - 4, 3],
    [3, TAILLE - 4]
  ]) {
    const d = centre(dx, dy);
    if (d <= 3) return d === 2 ? false : true;
  }
  return false;
}

function moduleDonnee(x: number, y: number) {
  // Suite deterministe : melange les deux coordonnees pour eviter les
  // diagonales trop regulieres, sans dependre du hasard.
  const h = (x * 73 + y * 151 + ((x * y) % 17) * 31) % 100;
  return h < 46;
}

export function QrAnime() {
  const modules = [];
  for (let y = 0; y < TAILLE; y += 1) {
    for (let x = 0; x < TAILLE; x += 1) {
      const plein = estRepere(x, y) ? moduleRepere(x, y) : moduleDonnee(x, y);
      modules.push({ x, y, plein });
    }
  }

  // Un ticket blanc, fixe : plus de construction module par module ni de
  // ligne de scan.
  return (
    <div aria-hidden="true" className="rounded-[2px] bg-white p-5 text-[#141116] sm:p-6">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${TAILLE}, minmax(0, 1fr))` }}>
        {modules.map(({ x, y, plein }) => (
          <span className={`aspect-square ${plein ? "bg-[#141116]" : "bg-transparent"}`} key={`${x}-${y}`} />
        ))}
      </div>
      <p className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#141116]/25 pt-3 font-mono text-[11px] font-bold uppercase tracking-[.14em]">
        <span>Nulll Club</span>
        <span>Social run · samedi</span>
      </p>
    </div>
  );
}
