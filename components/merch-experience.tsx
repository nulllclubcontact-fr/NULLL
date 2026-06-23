"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowIcon } from "./ArrowIcon";
import { parseCart, serializeCart, upsertCartItem, CART_STORAGE_KEY, type CartItem } from "../lib/shop";
import { getRoute, productsByLocale, type Locale } from "../lib/site-content";

export function MerchExperience({ locale }: { locale: Locale }) {
  const products = productsByLocale[locale];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(parseCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(cart));
  }, [cart, mounted]);

  const cartMap = useMemo(() => new Map(cart.map((item) => [item.productId, item.quantity])), [cart]);
  const total = useMemo(
    () =>
      products.reduce((sum, product) => {
        return sum + (cartMap.get(product.id) ?? 0) * product.price;
      }, 0),
    [cartMap, products]
  );

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const quantity = cartMap.get(product.id) ?? 0;
          return (
            <article className="panel overflow-hidden" key={product.id}>
              <div className="relative aspect-[4/5] border-b border-paper/15">
                <Image alt={product.alt} className="object-cover" fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 48vw, 100vw" src={product.image} />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-accent">{product.badge}</p>
                    <h3 className="mt-2 font-display text-[clamp(1.9rem,3vw,2.8rem)] uppercase leading-[0.95]">{product.name}</h3>
                  </div>
                  <p className="whitespace-nowrap text-lg font-semibold">{product.price}€</p>
                </div>
                <p className="mt-4 text-paper/72">{product.description}</p>
                <p className="mt-2 text-sm text-paper/52">{product.fit}</p>
                <div className="mt-5 flex items-center gap-3">
                  <button
                    aria-label={
                      locale === "fr"
                        ? `Retirer un exemplaire de ${product.name}`
                        : `Remove one ${product.name}`
                    }
                    className="icon-button"
                    disabled={quantity === 0}
                    onClick={() => setCart((current) => upsertCartItem(current, product.id, Math.max(0, quantity - 1)))}
                    type="button"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg">{quantity}</span>
                  <button
                    aria-label={
                      locale === "fr"
                        ? `Ajouter un exemplaire de ${product.name}`
                        : `Add one ${product.name}`
                    }
                    className="icon-button"
                    onClick={() => setCart((current) => upsertCartItem(current, product.id, quantity + 1))}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <button
                  aria-label={
                    locale === "fr"
                      ? `Ajouter ${product.name} au panier`
                      : `Add ${product.name} to cart`
                  }
                  className="primary-button mt-5 w-full justify-between"
                  onClick={() => setCart((current) => upsertCartItem(current, product.id, quantity + 1))}
                  type="button"
                >
                  <span>{locale === "fr" ? "Ajouter au panier" : "Add to cart"}</span>
                  <ArrowIcon />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="panel sticky top-28 h-fit p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">{locale === "fr" ? "Panier" : "Cart"}</p>
        <p className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] uppercase">
          {count} {locale === "fr" ? "article" : "item"}
          {count > 1 ? "s" : ""}
        </p>
        <div className="mt-6 space-y-4">
          {count === 0 ? (
            <p className="text-paper/64">
              {locale === "fr"
                ? "Le panier est vide. Ajoute au moins une pièce pour passer à l’étape commande."
                : "Your cart is empty. Add at least one item to continue to checkout."}
            </p>
          ) : (
            products
              .filter((product) => cartMap.get(product.id))
              .map((product) => (
                <div className="border-b border-paper/10 pb-4" key={product.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-paper/55">
                        {cartMap.get(product.id)} x {product.price}€
                      </p>
                    </div>
                    <p>{(cartMap.get(product.id) ?? 0) * product.price}€</p>
                  </div>
                </div>
              ))
          )}
        </div>
        <div className="mt-6 border-t border-paper/15 pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-paper/64">{locale === "fr" ? "Total estimé" : "Estimated total"}</span>
            <strong className="text-2xl">{total}€</strong>
          </div>
        </div>
        <Link
          aria-disabled={count === 0}
          className={count === 0 ? "primary-link mt-6 pointer-events-none opacity-40" : "primary-link mt-6"}
          href={getRoute(locale, "checkout")}
        >
          <span>{locale === "fr" ? "Passer à la commande" : "Continue to checkout"}</span>
          <ArrowIcon />
        </Link>
        <p className="mt-4 text-sm text-paper/55">
          {locale === "fr"
            ? "Une fois la commande envoyée, tu reçois une référence et la suite de la confirmation par email."
            : "Once the checkout is submitted, you receive a reference and the next confirmation step by email."}
        </p>
      </aside>
    </div>
  );
}
