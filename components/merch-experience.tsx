"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";
import { parseCart, serializeCart, upsertCartItem, CART_STORAGE_KEY, type CartItem } from "../lib/shop";
import { getRoute, productsByLocale, type Locale, type Product } from "../lib/site-content";

const productMood = ["/assets/nulll-new/pool-legs.png", "/assets/nulll-new/water-face.png", "/assets/nulll-new/run-finish.png"];

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

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => {
          const quantity = cartMap.get(product.id) ?? 0;
          return <ProductCard index={index} key={product.id} product={product} quantity={quantity} setCart={setCart} />;
        })}
      </div>

      <aside className="sticky top-28 h-fit border-2 border-[#351815] bg-[#351815] p-5 text-[#f6eadf]">
        <p className="font-mono text-xs font-black uppercase text-[#ffb000]">Panier</p>
        <p className="mt-3 font-display text-[clamp(2.4rem,3.6vw,3.6rem)] uppercase leading-[0.96]">
          {count} piece
          {count > 1 ? "s" : ""}
        </p>
        <div className="mt-6 space-y-4">
          {count === 0 ? (
            <p className="font-bold text-[#f6eadf]/70">
              Le panier est vide. Ajoute une piece du club pour passer commande.
            </p>
          ) : (
            products
              .filter((product) => cartMap.get(product.id))
              .map((product) => (
                <div className="border-b-2 border-[#f6eadf] pb-4" key={product.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-sm text-[#f6eadf]/60">
                        {cartMap.get(product.id)} x {product.price} EUR
                      </p>
                    </div>
                    <p>{(cartMap.get(product.id) ?? 0) * product.price} EUR</p>
                  </div>
                </div>
              ))
          )}
        </div>
        <div className="mt-6 border-t-2 border-[#f6eadf] pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#f6eadf]/64">Total estime</span>
            <strong className="text-2xl text-[#ffb000]">{total} EUR</strong>
          </div>
        </div>
        <Link
          aria-disabled={count === 0}
          className={`mt-6 inline-flex min-h-14 w-full items-center justify-between gap-4 border-2 border-[#f6eadf] px-4 py-3 font-mono text-sm font-black uppercase transition ${
            count === 0 ? "pointer-events-none opacity-40" : "bg-[#ffb000] text-[#351815] hover:-translate-y-1 hover:bg-[#d96ab4]"
          }`}
          href={getRoute(locale, "checkout")}
        >
          <span>Passer commande</span>
          <ArrowIcon />
        </Link>
        <p className="mt-4 text-sm text-[#f6eadf]/55">
          La commande reste simple: tu envoies la demande, le club confirme ensuite par email.
        </p>
      </aside>
    </div>
  );
}

function ProductCard({
  index,
  product,
  quantity,
  setCart
}: {
  index: number;
  product: Product;
  quantity: number;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}) {
  return (
    <article className="group overflow-hidden border-2 border-[#351815] bg-[#f6eadf] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#d96ab4]">
      <div className="relative aspect-[4/5] border-b-2 border-[#351815]">
        <Image alt={product.alt} className="object-cover" fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 48vw, 100vw" src={productMood[index % productMood.length]} />
        <div className="absolute inset-0 bg-[#351815]/10" />
        <Image alt="" aria-hidden="true" className="absolute left-1/2 top-1/2 h-auto w-[72%] -translate-x-1/2 -translate-y-1/2" height={157} src={index === 1 ? "/assets/nulll-new/logo-yellow.png" : "/assets/nulll-new/logo-pink.png"} width={1225} />
        <div className="absolute left-4 top-4 border-2 border-[#351815] bg-[#f6eadf] px-3 py-2 font-mono text-xs font-black uppercase">Drop 00{index + 1}</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#351815] pb-4">
          <div>
            <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">{product.badge}</p>
            <h3 className="mt-2 font-display text-[clamp(2.1rem,3.6vw,3.2rem)] uppercase leading-[0.96]">{product.name}</h3>
          </div>
          <p className="whitespace-nowrap border-2 border-[#351815] bg-[#ffb000] px-2 py-1 font-mono text-xs font-black">{product.price} EUR</p>
        </div>
        <p className="mt-4 font-bold leading-tight text-[#351815]/72">{product.description}</p>
        <p className="mt-2 text-sm font-bold text-[#351815]/52">{product.fit}</p>
        <div className="mt-5 flex items-center gap-3">
          <button
            aria-label={`Retirer un exemplaire de ${product.name}`}
            className="grid h-11 w-11 place-items-center border-2 border-[#351815] font-mono font-black transition hover:bg-[#351815] hover:text-[#f6eadf] disabled:opacity-40"
            disabled={quantity === 0}
            onClick={() => setCart((current) => upsertCartItem(current, product.id, Math.max(0, quantity - 1)))}
            type="button"
          >
            -
          </button>
          <span className="w-10 text-center text-lg font-black">{quantity}</span>
          <button
            aria-label={`Ajouter un exemplaire de ${product.name}`}
            className="grid h-11 w-11 place-items-center border-2 border-[#351815] font-mono font-black transition hover:bg-[#ffb000]"
            onClick={() => setCart((current) => upsertCartItem(current, product.id, quantity + 1))}
            type="button"
          >
            +
          </button>
        </div>
        <button
          aria-label={`Ajouter ${product.name} au panier`}
          className="mt-5 flex min-h-14 w-full items-center justify-between border-2 border-[#351815] bg-[#351815] px-4 py-3 font-mono text-sm font-black uppercase text-[#f6eadf] transition hover:-translate-y-1 hover:bg-[#ffb000] hover:text-[#351815]"
          onClick={() => setCart((current) => upsertCartItem(current, product.id, quantity + 1))}
          type="button"
        >
          <span>Ajouter au panier</span>
          <ArrowIcon />
        </button>
      </div>
    </article>
  );
}
