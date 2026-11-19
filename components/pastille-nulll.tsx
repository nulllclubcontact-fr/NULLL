import Image from "next/image";

/**
 * Le logo du club en version reseaux (NULLL au-dessus de CLUB, losange
 * entre les deux), petit, blanc, sans fond, en haut a droite des photos
 * d'actus. Decoratif : la carte porte deja le nom du club.
 */
export function PastilleNulll() {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="absolute right-4 top-4 z-[1] h-auto w-[64px] sm:w-[72px]"
      height={660}
      src="/assets/brand/logo-empile-blanc.svg"
      unoptimized
      width={1284}
    />
  );
}
