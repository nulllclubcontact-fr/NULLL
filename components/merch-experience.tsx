"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowIcon } from "./ArrowIcon";
import { getRoute, productsByLocale, type Locale, type Product } from "../lib/site-content";

const productMood = ["/assets/photos/editorial-bed.webp", "/assets/photos/editorial-shower.webp", "/assets/photos/runner-ground.webp"];

/**
 * La boutique n'est pas ouverte : les pieces se montrent, rien ne
 * s'achete. Le panier menait jusqu'a un vrai formulaire de commande alors
 * que rien n'est a vendre. Il reviendra avec BOUTIQUE_OUVERTE (lib/shop.ts),
 * une fois prix, tailles et photos des pieces valides.
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

/**
 * Ouvre une fenetre modale sans le saut de defilement par defaut :
 * showModal() donne le focus au premier element focusable, souvent un
 * bouton en bas, et le navigateur l'amene a l'ecran, ce qui ouvre la
 * fenetre deja defilee, titre coupe.
 */
function ouvrirCadre(cadre: HTMLDialogElement | null) {
  if (!cadre) return;
  cadre.showModal();
  cadre.focus({ preventScroll: true });
  cadre.scrollTop = 0;
}

function CadreModal({
  cadreRef,
  children,
  titreId
}: {
  cadreRef: React.RefObject<HTMLDialogElement | null>;
  children: React.ReactNode;
  titreId: string;
}) {
  return (
    <dialog
      aria-labelledby={titreId}
      // Le texte peut etre long : la fenetre se borne a la hauteur d'ecran
      // et defile a l'interieur plutot que de deborder.
      className="max-h-[calc(100dvh-3rem)] w-[min(32rem,calc(100vw-2.5rem))] overflow-y-auto border-2 border-[#F1EDE9] bg-[#3A1A18] p-0 text-[#F1EDE9] shadow-[14px_14px_0_#EBA0CD] backdrop:bg-[#3A1A18]/85 focus:outline-none"
      ref={cadreRef}
      tabIndex={-1}
    >
      <div className="p-7 sm:p-9">{children}</div>
    </dialog>
  );
}

/**
 * Dit d'entree de jeu que la boutique est un brouillon. Les etiquettes sur
 * les photos le rappellent, mais elles se lisent apres coup : quelqu'un qui
 * arrive ici croit tomber sur une vraie boutique.
 *
 * Elle s'ouvre a chaque arrivee sur la page, sans memoire : la boutique
 * n'est pas reelle, le visiteur doit le lire a chaque fois, pas seulement
 * a sa premiere visite.
 */
export function MerchNotice({ runsHref }: { runsHref: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Un dialog ferme est display:none et hors de l'arbre d'accessibilite :
    // pas besoin d'un etat pour ne pas le monter.
    ouvrirCadre(ref.current);
  }, []);

  return (
    <CadreModal cadreRef={ref} titreId="merch-notice-title">
      <>
        <p className="font-mono text-xs font-black uppercase tracking-[.2em] text-[#FFB200] [word-spacing:.22em]">Petit problème</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,6vw,2.9rem)] uppercase leading-[1.12] tracking-[-.03em]" id="merch-notice-title">
          La boutique est vide.
        </h2>

        <p className="mt-6 text-base leading-relaxed text-[#F1EDE9]">
          Enfin&hellip; techniquement, elle est pleine. Pleine de t-shirts qu&rsquo;on n&rsquo;a jamais produits.
        </p>

        {/* Le releve reste en mono : c'est la seule enumeration gardee, et
            c'est celle qui porte la blague le plus vite. */}
        <ul className="mt-5 space-y-2 border-l-2 border-[#FFB200] pl-4 font-mono text-xs font-black uppercase leading-snug tracking-[.06em] text-[#F1EDE9] [word-spacing:.14em]">
          <li>Stock : 0.</li>
          <li>Impressions : 0.</li>
          <li>Budget : on préfère ne pas en parler.</li>
        </ul>

        <p className="mt-6 text-base leading-relaxed text-[#F1EDE9]">
          Et les photos ? Aucun rapport. Une fille dans un lit, un mec sous la douche, des baskets par terre. Nous, on
          appelle ça une direction artistique.
        </p>

        <p className="mt-4 text-base leading-relaxed text-[#F1EDE9]">
          Un jour ça sortira vraiment, sûrement autour d&rsquo;un événement du club. En retard, probablement.
        </p>

        {/* La chute : en display, elle se detache du reste du texte. */}
        <p className="mt-6 font-display text-[clamp(1.35rem,3.4vw,1.8rem)] uppercase leading-[1.12] tracking-[-.02em] text-[#FFB200]">
          De toute façon, on ne peut littéralement rien te vendre.
        </p>

        {/* Empiles : cote a cote dans 32rem, les deux libelles passaient a
            la ligne au milieu d'un mot. */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            className="inline-flex min-h-14 flex-1 items-center justify-center border-2 border-[#FFB200] bg-[#FFB200] px-6 font-mono text-xs font-black uppercase tracking-[.1em] text-[#773331] transition-colors [word-spacing:.12em] hover:bg-transparent hover:text-[#FFB200] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#F1EDE9]"
            onClick={() => ref.current?.close()}
            type="button"
          >
            Ok, je regarde quand même
          </button>
          <Link
            className="inline-flex min-h-14 flex-1 items-center justify-center border-2 border-[#F1EDE9]/40 px-6 text-center font-mono text-xs font-black uppercase tracking-[.1em] transition-colors [word-spacing:.12em] hover:border-[#F1EDE9] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#EBA0CD]"
            href={runsHref}
          >
            Venir courir, ça oui
          </Link>
        </div>
      </>
    </CadreModal>
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
