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
    <div className="grid gap-5">
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard index={index} key={product.id} product={product} />
        ))}
      </ul>

      <aside className="mt-10 flex flex-col items-center gap-5 rounded-[2px] bg-[#E8459E] px-6 py-14 text-center sm:py-16">
        <p className="st st-cream">Pas encore en vente</p>
        <p className="st st-yellow st-xl">Les pièces arrivent</p>
        <p className="text-lg font-bold text-white">Les sorties, elles, sont déjà là.</p>
        <Link className="hx-pill" href={getRoute(locale, "runs")}>
          <span>Voir les sorties</span>
          <ArrowIcon />
        </Link>
      </aside>
    </div>
  );
}

function ProductCard({ index, product }: { index: number; product: Product }) {
  const couleurs = ["st-yellow", "st-pink", "st-lime"];
  return (
    <li className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
        {/* Photo d'ambiance, pas une photo du produit : decorative. */}
        <Image
          alt=""
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
          src={productMood[index % productMood.length]}
        />
        <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(20,17,22,.8))]" />
        <span className="st st-cream absolute left-4 top-4">Drop 00{index + 1}</span>
        <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-2">
          {/* h2 : les pieces sont des elements de premier niveau de la page. */}
          <h2 className={`st ${couleurs[index % couleurs.length]} text-[clamp(26px,2.4vw,36px)]`}>{product.name}</h2>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[.14em] text-white/75">Visuel d’ambiance · bientôt</span>
        </div>
      </div>
      <p className="mt-4 text-base leading-relaxed text-white/80">{product.description}</p>
    </li>
  );
}
