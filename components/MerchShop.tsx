"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { merchItems } from "../lib/content";
import { ArrowIcon } from "./ArrowIcon";
import { LocalizedText } from "./LocalizedText";

type MerchItem = (typeof merchItems)[number];
type CartState = Partial<Record<MerchItem["id"], number>>;

const visualByVariant = {
  black: {
    image: "/assets/merch/tee-black-blank.png",
    title: "NULLL LOGO TEE",
    price: "35.00",
    overlay: "logo"
  },
  white: {
    image: "/assets/merch/tee-white-blank.png",
    title: "RUN BAD TEE",
    price: "35.00",
    overlay: "run"
  },
  warning: {
    image: "/assets/merch/tee-black-blank.png",
    title: "NO EXCUSE TEE",
    price: "35.00",
    overlay: "no-excuse"
  }
} as const;

function getCartCount(cart: CartState) {
  return Object.values(cart).reduce((total, quantity) => total + (quantity ?? 0), 0);
}

export function MerchShop() {
  const [cart, setCart] = useState<CartState>({});
  const count = getCartCount(cart);

  const total = useMemo(
    () =>
      merchItems.reduce((sum, item) => {
        return sum + (cart[item.id] ?? 0) * item.amount;
      }, 0),
    [cart]
  );

  function addItem(id: MerchItem["id"]) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }

  function removeItem(id: MerchItem["id"]) {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) - 1);
      const next = { ...current };

      if (nextQuantity === 0) {
        delete next[id];
      } else {
        next[id] = nextQuantity;
      }

      return next;
    });
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_270px]">
      <div className="grid min-w-0 grid-cols-1 items-start gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {merchItems.map((item, index) => (
          <ProductCard addItem={addItem} index={index + 1} item={item} key={item.id} />
        ))}
      </div>

      <aside className="border-2 border-white bg-black text-white xl:sticky xl:top-28 xl:self-start" aria-live="polite">
        <div className="flex items-center justify-between border-b-2 border-white p-4 font-mono uppercase">
          <span className="text-shock">
            <LocalizedText en="Cart" fr="Cart" />
          </span>
          <span>[{count}]</span>
        </div>

        {count === 0 ? (
          <div className="p-4 font-mono text-sm uppercase text-white/65">
            <LocalizedText
              en="No tee selected yet. Hit add to cart, the signal will appear here."
              fr="No tee selected. Clique Add to cart, le signal apparait ici."
            />
          </div>
        ) : (
          <div>
            {merchItems.map((item) => {
              const quantity = cart[item.id] ?? 0;
              if (!quantity) return null;
              const visual = visualByVariant[item.variant];

              return (
                <div className="grid grid-cols-[1fr_auto] gap-3 border-b-2 border-white p-4 font-mono uppercase" key={item.id}>
                  <div>
                    <p className="copy-safe text-sm font-black">{visual.title}</p>
                    <p className="mt-2 text-xs text-white/60">
                      {quantity} x {item.price}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <button
                      aria-label={`Remove one ${visual.title}`}
                      className="grid h-8 w-8 place-items-center border-2 border-white transition hover:bg-white hover:text-black"
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      -
                    </button>
                    <button
                      aria-label={`Add one ${visual.title}`}
                      className="grid h-8 w-8 place-items-center border-2 border-white transition hover:bg-shock hover:text-black"
                      onClick={() => addItem(item.id)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="border-b-2 border-white p-4 font-mono uppercase">
              <p className="text-xs text-white/60">
                <LocalizedText en="Estimated total" fr="Total estimate" />
              </p>
              <p className="mt-2 text-3xl font-black text-shock">{total} EUR</p>
            </div>
          </div>
        )}

        {count === 0 ? (
          <button
            className="flex w-full cursor-not-allowed items-center justify-between p-4 font-mono text-sm uppercase text-white/35"
            disabled
            type="button"
          >
            <span>
              <LocalizedText en="Select a tee first" fr="Choisis un tee d'abord" />
            </span>
            <ArrowIcon />
          </button>
        ) : (
          <Link
            className="flex w-full items-center justify-between bg-shock p-4 font-mono text-sm font-black uppercase text-black transition hover:bg-white"
            href="/contact"
          >
            <span>
              <LocalizedText en="Order via contact" fr="Commander via contact" />
            </span>
            <ArrowIcon />
          </Link>
        )}
      </aside>
    </div>
  );
}

function ProductCard({
  addItem,
  index,
  item
}: {
  addItem: (id: MerchItem["id"]) => void;
  index: number;
  item: MerchItem;
}) {
  const visual = visualByVariant[item.variant];

  return (
    <article className="group min-w-0 self-start border-2 border-white bg-white text-black transition hover:-translate-y-2 hover:shadow-[8px_8px_0_#ff3fb4]">
      <div className="relative aspect-[1.03/1] overflow-hidden border-b-2 border-black">
        <Image alt={visual.title} className="object-cover" fill sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 100vw" src={visual.image} />
        <div className="absolute left-4 top-3 font-mono text-sm uppercase">{String(index).padStart(3, "0")}.</div>
        <div className="absolute right-4 top-3 font-mono text-sm uppercase">[T-SHIRT]</div>
        <div className="vertical-copy absolute bottom-7 right-4 font-mono text-xs uppercase">Make it real.</div>
        {visual.overlay === "logo" ? (
          <Image
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-[43%] h-auto w-[34%] -translate-x-1/2 object-contain"
            height={116}
            src="/assets/brand/nulll-logo.png"
            width={252}
          />
        ) : null}
        {visual.overlay === "run" ? (
          <div className="absolute left-1/2 top-[36%] w-[62%] -translate-x-1/2 text-center font-display text-[clamp(1.6rem,2vw,2.25rem)] uppercase leading-[0.96] text-black">
            RUN BAD
            <br />
            MEET PEOPLE
          </div>
        ) : null}
        {visual.overlay === "no-excuse" ? (
          <div className="display-safe absolute left-1/2 top-[33%] w-[70%] -translate-x-1/2 text-center font-display text-[clamp(2.15rem,3.2vw,3.7rem)] uppercase text-white">
            NO PACE
            <br />
            NO EGO
            <br />
            NO EXCUSE
          </div>
        ) : null}
      </div>
      <div className="bg-black p-3 text-white">
        <div className="flex items-center justify-between gap-3 border-b-2 border-white pb-2 font-mono text-sm uppercase">
          <h2 className="copy-safe">{visual.title}</h2>
          <span className="whitespace-nowrap text-shock">{visual.price} EUR</span>
        </div>
        <button
          aria-label={`Add ${visual.title} to cart`}
          className="mt-3 flex min-h-12 w-full items-center justify-between border-2 border-white px-4 py-3 font-mono text-sm uppercase transition hover:bg-shock hover:text-black"
          onClick={() => addItem(item.id)}
          type="button"
        >
          <span>
            <LocalizedText en="Add to cart" fr="Add to cart" />
          </span>
          <span aria-hidden="true">-&gt;</span>
        </button>
      </div>
    </article>
  );
}
