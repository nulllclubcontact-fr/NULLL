import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { getRoute, productsByLocale, type Locale, type Product } from "../lib/site-content";

const productMood = ["/assets/photos/editorial-bed.webp", "/assets/photos/editorial-shower.webp", "/assets/photos/runner-ground.webp"];

/**
 * La boutique n'est pas ouverte : les pieces se montrent, rien ne
 * s'achete. Le panier menait jusqu'a un vrai formulaire de commande alors
 * que rien n'est a vendre, et deux fenetres repetaient la meme blague a
 * chaque visite. Une seule annonce, dans la page. Le panier reviendra avec
 * BOUTIQUE_OUVERTE (lib/shop.ts), une fois prix, tailles et photos valides.
 */
export function MerchExperience({ locale }: { locale: Locale }) {
  const products = productsByLocale[locale];

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
      {/* Bloc plein : le contour est porte par le conteneur (haut/gauche) et
          chaque piece ferme son bas et sa droite. Les pieces se touchent sur
          un seul filet, et une derniere rangee incomplete ne laisse pas de
          case noire, ce que ferait l'astuce gap-px sur fond sombre. */}
      <div className="grid border-l-2 border-t-2 border-[#773331] md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard index={index} key={product.id} product={product} />
        ))}
      </div>

      <aside className="sticky top-28 h-fit border-2 border-[#773331] bg-[#3A1A18] p-6 text-[#F1EDE9] shadow-[10px_10px_0_#EBA0CD]">
        <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#FFB200] [word-spacing:.18em]">Pas encore en vente</p>
        <p className="mt-4 font-display text-[clamp(2.2rem,3.4vw,3.2rem)] uppercase leading-[1.12] tracking-[-.03em]">
          Les pièces arrivent.
        </p>
        <p className="mt-6 text-base leading-relaxed text-[#F1EDE9]">Les sorties, elles, sont déjà là.</p>
        <Link
          className="mt-7 inline-flex min-h-16 w-full items-center justify-between gap-4 border-2 border-[#FFB200] bg-[#FFB200] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#773331] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#FFB200] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#F1EDE9]"
          href={getRoute(locale, "runs")}
        >
          <span>Voir les sorties</span>
          <ArrowIcon />
        </Link>
      </aside>
    </div>
  );
}

function ProductCard({ index, product }: { index: number; product: Product }) {
  return (
    <article className="group flex flex-col border-b-2 border-r-2 border-[#773331] bg-[#F1EDE9]">
      <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-[#773331]">
        {/* Photo d'ambiance, pas une photo du produit : elle ne decrit rien
            que le titre et le descriptif ne disent deja, donc decorative.
            Au survol le grain tombe et la piece reprend ses couleurs. */}
        <Image
          alt=""
          className="image-grit object-cover transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:[filter:none]"
          fill
          sizes="(min-width: 1280px) 26vw, (min-width: 768px) 44vw, 100vw"
          src={productMood[index % productMood.length]}
        />
        <span className="absolute left-0 top-0 border-b-2 border-r-2 border-[#773331] bg-[#F1EDE9] px-3 py-2 font-mono text-xs font-black uppercase tracking-[.16em]">
          Drop 00{index + 1}
        </span>
        {/* Dit franchement ce que la photo est : ces visuels sont des images
            d'ambiance, pas le t-shirt. A retirer le jour ou les vraies
            photos arrivent. */}
        <span className="absolute bottom-0 right-0 border-l-2 border-t-2 border-[#773331] bg-[#773331] px-3 py-2 font-mono text-xs font-black uppercase tracking-[.16em] text-[#F1EDE9] [word-spacing:.1em]">
          Visuel d’ambiance
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* h2 et non h3 : les pieces sont des elements de premier niveau de
            la page. En h3 elles suivaient directement le h1, et un lecteur
            d'ecran qui navigue par titres sautait une marche. */}
        <h2 className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] uppercase leading-[1.12] tracking-[-.03em]">{product.name}</h2>
        <p className="mt-4 text-base leading-relaxed text-[#773331]">{product.description}</p>

        <p className="mt-auto border-t-2 border-[#773331] pt-5 font-mono text-xs font-black uppercase tracking-[.14em] [word-spacing:.14em]">
          Bientôt · pas encore en vente
        </p>
      </div>
    </article>
  );
}
