"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";
import { parseCart, serializeCart, upsertCartItem, CART_STORAGE_KEY, type CartItem } from "../lib/shop";
import { getRoute, productsByLocale, type Locale, type Product } from "../lib/site-content";

const productMood = ["/assets/photos/editorial-bed.webp", "/assets/photos/editorial-shower.webp", "/assets/photos/runner-ground.webp"];

export function MerchExperience({ locale }: { locale: Locale }) {
  const products = productsByLocale[locale];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCart(parseCart(window.localStorage.getItem(CART_STORAGE_KEY)));
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(cart));
  }, [cart, mounted]);

  const cartMap = useMemo(() => new Map(cart.map((item) => [item.productId, item.quantity])), [cart]);
  const total = useMemo(
    () => products.reduce((sum, product) => sum + (cartMap.get(product.id) ?? 0) * product.price, 0),
    [cartMap, products]
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const commandeRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
      {/* Bloc plein : le contour est porte par le conteneur (haut/gauche) et
          chaque piece ferme son bas et sa droite. Les pieces se touchent sur
          un seul filet, et une derniere rangee incomplete ne laisse pas de
          case noire — ce que ferait l'astuce gap-px sur fond sombre. */}
      <div className="grid border-l-2 border-t-2 border-[#351815] md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => {
          const quantity = cartMap.get(product.id) ?? 0;
          return (
            <ProductCard
              checkoutHref={getRoute(locale, "checkout")}
              index={index}
              key={product.id}
              product={product}
              quantity={quantity}
              setCart={setCart}
            />
          );
        })}
      </div>

      <aside className="sticky top-28 h-fit border-2 border-[#351815] bg-[#1c0d0b] p-6 text-[#f6eadf] shadow-[10px_10px_0_#d96ab4]">
        <p className="font-mono text-xs font-black uppercase tracking-[.16em] text-[#ffb000] [word-spacing:.18em]">Panier</p>
        <p className="mt-4 font-display text-[clamp(2.4rem,3.6vw,3.6rem)] uppercase leading-[.9] tracking-[-.03em] [word-spacing:.08em]">
          {count} pièce
          {count > 1 ? "s" : ""}
        </p>

        <div className="mt-8 space-y-5">
          {count === 0 ? (
            <p className="text-base leading-relaxed text-[#f6eadf]/70">
              Le panier est vide. Ajoute une pièce du club pour passer commande.
            </p>
          ) : (
            products
              .filter((product) => cartMap.get(product.id))
              .map((product) => (
                <div className="border-b-2 border-[#f6eadf]/25 pb-5" key={product.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-[1.15rem] uppercase leading-[.98] tracking-[-.02em]">{product.name}</p>
                      <p className="mt-2 font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#f6eadf]/55">
                        {cartMap.get(product.id)} × {product.price} EUR
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-mono text-sm font-black">{(cartMap.get(product.id) ?? 0) * product.price} EUR</p>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="mt-8 border-t-2 border-[#f6eadf] pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-mono text-[.62rem] font-black uppercase tracking-[.18em] text-[#f6eadf]/55">Total estimé</span>
            <strong className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] uppercase leading-none tracking-[-.02em] text-[#ffb000]">{total} EUR</strong>
          </div>
        </div>

        {/* Ne mene plus au formulaire de commande : il n'y a rien a
            expedier. Le bouton ouvre la fenetre qui le dit et renvoie
            vers les sorties. */}
        <button
          className={`mt-7 inline-flex min-h-16 w-full items-center justify-between gap-4 border-2 px-6 font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] transition-colors focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf] ${
            count === 0
              ? "border-[#f6eadf]/30 text-[#f6eadf]/40"
              : "border-[#ffb000] bg-[#ffb000] text-[#351815] hover:bg-transparent hover:text-[#ffb000]"
          }`}
          disabled={count === 0}
          onClick={() => ouvrirCadre(commandeRef.current)}
          type="button"
        >
          <span>Passer commande</span>
          <ArrowIcon />
        </button>

        <p className="mt-5 text-sm leading-relaxed text-[#f6eadf]/55">
          La commande reste simple : tu envoies la demande, le club confirme ensuite par email.
        </p>

        <CadreModal cadreRef={commandeRef} titreId="merch-commande-title">
          <>
            <p className="font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#d96ab4] [word-spacing:.22em]">Erreur 404 : le t-shirt</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,6vw,2.9rem)] uppercase leading-[.9] tracking-[-.03em] [word-spacing:.08em]" id="merch-commande-title">
              Wesh brother, t&rsquo;as pas compris ?
            </h2>

            <p className="mt-6 text-base leading-relaxed text-[#f6eadf]/82">
              On les a pas. Zéro t-shirt, zéro carton, zéro colis à t&rsquo;envoyer. Ton panier est un très beau geste,
              mais il ne part nulle part.
            </p>

            <p className="mt-4 text-base leading-relaxed text-[#f6eadf]/82">
              Par contre, samedi, on court. Ça, on l&rsquo;a vraiment.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                className="inline-flex min-h-14 items-center justify-center border-2 border-[#ffb000] bg-[#ffb000] px-6 text-center font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] text-[#351815] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
                href={getRoute(locale, "runs")}
              >
                Va courir plutôt
              </Link>
              <button
                className="inline-flex min-h-14 items-center justify-center border-2 border-[#f6eadf]/40 px-6 text-center font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] transition-colors hover:border-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]"
                onClick={() => commandeRef.current?.close()}
                type="button"
              >
                Je garde mon panier imaginaire
              </button>
            </div>
          </>
        </CadreModal>
      </aside>
    </div>
  );
}

/**
 * Ouvre une fenetre modale sans le saut de defilement par defaut :
 * showModal() donne le focus au premier element focusable — souvent un
 * bouton en bas — et le navigateur l'amene a l'ecran, ce qui ouvre la
 * fenetre deja defilee, titre coupe.
 */
function ouvrirCadre(cadre: HTMLDialogElement | null) {
  if (!cadre) return;
  cadre.showModal();
  cadre.focus({ preventScroll: true });
  cadre.scrollTop = 0;
}

/** Habillage commun aux deux fenetres de la page merch. */
function CadreModal({
  cadreRef,
  children,
  onClose,
  titreId
}: {
  cadreRef: React.RefObject<HTMLDialogElement | null>;
  children: React.ReactNode;
  onClose?: () => void;
  titreId: string;
}) {
  return (
    <dialog
      aria-labelledby={titreId}
      // Le texte peut etre long : la fenetre se borne a la hauteur d'ecran
      // et defile a l'interieur plutot que de deborder.
      className="max-h-[calc(100dvh-3rem)] w-[min(32rem,calc(100vw-2.5rem))] overflow-y-auto border-2 border-[#f6eadf] bg-[#1c0d0b] p-0 text-[#f6eadf] shadow-[14px_14px_0_#d96ab4] backdrop:bg-[#1c0d0b]/85 focus:outline-none"
      onClose={onClose}
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
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.2em] text-[#ffb000] [word-spacing:.22em]">Petit problème</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,6vw,2.9rem)] uppercase leading-[.9] tracking-[-.03em] [word-spacing:.08em]" id="merch-notice-title">
          La boutique est vide.
        </h2>

        <p className="mt-6 text-base leading-relaxed text-[#f6eadf]/82">
          Enfin&hellip; techniquement, elle est pleine. Pleine de t-shirts qu&rsquo;on n&rsquo;a jamais produits.
        </p>

        {/* Le releve reste en mono : c'est la seule enumeration gardee, et
            c'est celle qui porte la blague le plus vite. */}
        <ul className="mt-5 space-y-2 border-l-2 border-[#ffb000] pl-4 font-mono text-[.72rem] font-black uppercase leading-snug tracking-[.06em] text-[#f6eadf]/75 [word-spacing:.14em]">
          <li>Stock : 0.</li>
          <li>Impressions : 0.</li>
          <li>Budget : on préfère ne pas en parler.</li>
        </ul>

        <p className="mt-6 text-base leading-relaxed text-[#f6eadf]/82">
          Et les photos ? Aucun rapport. Une fille dans un lit, un mec sous la douche, des baskets par terre. Nous, on
          appelle ça une direction artistique.
        </p>

        <p className="mt-4 text-base leading-relaxed text-[#f6eadf]/82">
          Un jour ça sortira vraiment, sûrement autour d&rsquo;un événement du club. En retard, probablement.
        </p>

        {/* La chute : en display, elle se detache du reste du texte. */}
        <p className="mt-6 font-display text-[clamp(1.35rem,3.4vw,1.8rem)] uppercase leading-[.98] tracking-[-.02em] text-[#ffb000] [word-spacing:.08em]">
          De toute façon, on ne peut littéralement rien te vendre.
        </p>

        {/* Empiles : cote a cote dans 32rem, les deux libelles passaient a
            la ligne au milieu d'un mot. */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            className="inline-flex min-h-14 flex-1 items-center justify-center border-2 border-[#ffb000] bg-[#ffb000] px-6 font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] text-[#351815] transition-colors hover:bg-transparent hover:text-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f6eadf]"
            onClick={() => ref.current?.close()}
            type="button"
          >
            Ok, je fais semblant
          </button>
          <Link
            className="inline-flex min-h-14 flex-1 items-center justify-center border-2 border-[#f6eadf]/40 px-6 text-center font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] transition-colors hover:border-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]"
            href={runsHref}
          >
            Venir courir, ça oui
          </Link>
        </div>
      </>
    </CadreModal>
  );
}

function ProductCard({
  checkoutHref,
  index,
  product,
  quantity,
  setCart
}: {
  checkoutHref: string;
  index: number;
  product: Product;
  quantity: number;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  const inCart = quantity > 0;
  return (
    <article className="group flex flex-col border-b-2 border-r-2 border-[#351815] bg-[#f6eadf]">
      <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-[#351815]">
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
        <span className="absolute left-0 top-0 border-b-2 border-r-2 border-[#351815] bg-[#f6eadf] px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.16em]">
          Drop 00{index + 1}
        </span>
        {/* Dit franchement ce que la photo est : ces visuels sont des images
            d'ambiance, pas le t-shirt. Sans ca le visiteur croit acheter ce
            qu'il voit. A retirer le jour ou les vraies photos arrivent. */}
        <span className="absolute bottom-0 right-0 border-l-2 border-t-2 border-[#351815] bg-[#351815] px-3 py-2 font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#f6eadf] [word-spacing:.1em]">
          Visuel d’ambiance
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-[.62rem] font-black uppercase tracking-[.16em] text-[#d96ab4]">{product.badge}</p>
        <h3 className="mt-3 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] uppercase leading-[.92] tracking-[-.03em] [word-spacing:.08em]">{product.name}</h3>
        <p className="mt-4 text-base leading-relaxed text-[#351815]/72">{product.description}</p>
        <p className="mt-3 font-mono text-[.62rem] font-black uppercase tracking-[.06em] text-[#351815]/50 [word-spacing:.14em]">{product.fit}</p>

        <div className="mt-auto pt-7">
          {/* Prix et quantite sur la meme ligne : c'est la decision d'achat,
              elle se lit d'un coup juste au-dessus du bouton. */}
          <div className="flex items-end justify-between gap-4 border-t-2 border-[#351815] pt-5">
            <p className="font-display text-[clamp(1.9rem,2.6vw,2.4rem)] leading-none tracking-[-.02em]">
              {product.price}
              <span className="ml-1 align-baseline font-mono text-xs font-black tracking-[.08em]">EUR</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                aria-label={`Retirer un exemplaire de ${product.name}`}
                className="grid h-11 w-11 place-items-center border-2 border-[#351815] font-mono text-lg font-black transition-colors hover:bg-[#351815] hover:text-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#d96ab4] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#351815]"
                disabled={quantity === 0}
                onClick={() => setCart((current) => upsertCartItem(current, product.id, Math.max(0, quantity - 1)))}
                type="button"
              >
                −
              </button>
              <span aria-hidden="true" className="w-9 text-center font-display text-2xl leading-none">{quantity}</span>
              <button
                aria-label={`Ajouter un exemplaire de ${product.name}`}
                className="grid h-11 w-11 place-items-center border-2 border-[#351815] font-mono text-lg font-black transition-colors hover:bg-[#ffb000] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#d96ab4]"
                onClick={() => setCart((current) => upsertCartItem(current, product.id, quantity + 1))}
                type="button"
              >
                +
              </button>
              <span className="sr-only" role="status">
                {quantity} {product.name} dans le panier
              </span>
            </div>
          </div>

          {/* Le selecteur ci-dessus ecrit deja dans le panier. Si ce bouton
              ajoutait lui aussi, une piece reglee sur 1 puis validee ici
              partait a 2. Tant que la piece n'est pas prise il l'ajoute,
              ensuite il ne fait plus qu'emmener au panier. */}
          {inCart ? (
            <Link
              className="mt-5 flex min-h-16 w-full items-center justify-between border-2 border-[#351815] bg-[#ffb000] px-5 font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] text-[#351815] transition-colors hover:bg-[#351815] hover:text-[#f6eadf] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]"
              href={checkoutHref}
            >
              <span>Voir le panier</span>
              <ArrowIcon />
            </Link>
          ) : (
            <button
              aria-label={`Ajouter ${product.name} au panier`}
              className="mt-5 flex min-h-16 w-full items-center justify-between border-2 border-[#351815] bg-[#351815] px-5 font-mono text-xs font-black uppercase tracking-[.1em] [word-spacing:.12em] text-[#f6eadf] transition-colors hover:bg-[#ffb000] hover:text-[#351815] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#d96ab4]"
              onClick={() => setCart((current) => upsertCartItem(current, product.id, 1))}
              type="button"
            >
              <span>Ajouter au panier</span>
              <ArrowIcon />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
