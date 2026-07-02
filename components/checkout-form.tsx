"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { parseCart, serializeCart, CART_STORAGE_KEY, type CartItem } from "../lib/shop";
import { getRoute, productsByLocale, type Locale } from "../lib/site-content";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "success"; reference: string };

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  notes: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  deliveryMethod: "pickup",
  notes: ""
};

export function CheckoutForm({ locale }: { locale: Locale }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [form, setForm] = useState<FormState>(initialState);

  const products = productsByLocale[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCart(parseCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const items = useMemo(
    () =>
      cart
        .map((entry) => {
          const product = products.find((item) => item.id === entry.productId);
          if (!product) {
            return null;
          }
          return { ...product, quantity: entry.quantity };
        })
        .filter(Boolean),
    [cart, products]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item!.price * item!.quantity, 0),
    [items]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length) {
      setStatus({
        type: "error",
        message: "Ton panier est vide."
      });
      return;
    }

    setStatus({ type: "loading" });

    let response: Response;
    let payload: { message?: string; reference?: string } = {};

    try {
      response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          locale,
          items: cart,
          ...form
        })
      });
      payload = await response.json();
    } catch {
      setStatus({
        type: "error",
        message: "La demande n’a pas pu partir. Réessaie ou contacte-nous directement par email."
      });
      return;
    }

    if (!response.ok) {
      setStatus({
        type: "error",
        message:
          payload?.message ??
          "Impossible d’envoyer la demande pour le moment."
      });
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart([]));
    setCart([]);
    setForm(initialState);
    setStatus({ type: "success", reference: payload.reference ?? "NULLL-CONFIRMED" });
  }

  if (status.type === "success") {
    return (
      <div className="border-2 border-[#351815] bg-[#f6eadf] p-8" role="status">
        <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">Commande reçue</p>
        <h2 className="mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] uppercase leading-[0.92]">
          Demande confirmée.
        </h2>
        <p className="mt-4 max-w-2xl text-[#351815]/76">
          Nous avons enregistré ta demande. Conserve cette référence et surveille ta boîte mail pour la confirmation.
        </p>
        <div className="mt-6 inline-flex border-2 border-[#351815] bg-[#ffb000] px-4 py-3 text-[#351815]">
          <strong>{status.reference}</strong>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link className="inline-flex min-h-14 items-center border-2 border-[#351815] bg-[#351815] px-4 py-3 font-mono text-sm font-black uppercase text-[#f6eadf]" href={getRoute(locale, "runs")}>
            Voir les prochains runs
          </Link>
          <Link className="inline-flex min-h-14 items-center border-2 border-[#351815] bg-[#f6eadf] px-4 py-3 font-mono text-sm font-black uppercase text-[#351815]" href={getRoute(locale, "merch")}>
            Retour au merch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_0.48fr]">
      <form className="border-2 border-[#351815] bg-[#f6eadf] p-6 lg:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Prénom"
            autoComplete="given-name"
            onChange={(value) => setForm((current) => ({ ...current, firstName: value }))}
            required
            value={form.firstName}
          />
          <Field
            label="Nom"
            autoComplete="family-name"
            onChange={(value) => setForm((current) => ({ ...current, lastName: value }))}
            required
            value={form.lastName}
          />
          <Field
            label="Email"
            autoComplete="email"
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            required
            type="email"
            value={form.email}
          />
          <Field
            label="Téléphone"
            autoComplete="tel"
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            required
            value={form.phone}
          />
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block font-mono text-xs font-black uppercase text-[#351815]/58">
            Méthode de remise
          </span>
          <select
            className="w-full border-2 border-[#351815] bg-[#f6eadf] p-3 font-mono text-sm outline-none transition focus:bg-[#ffb000]/20"
            onChange={(event) => setForm((current) => ({ ...current, deliveryMethod: event.target.value }))}
            required
            value={form.deliveryMethod}
          >
            <option value="pickup">Retrait local à Aix-en-Provence</option>
            <option value="shipping">Envoi après confirmation</option>
          </select>
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block font-mono text-xs font-black uppercase text-[#351815]/58">
            Notes
          </span>
          <textarea
            className="min-h-[140px] w-full border-2 border-[#351815] bg-[#f6eadf] p-3 font-mono text-sm outline-none transition focus:bg-[#ffb000]/20"
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Taille souhaitée, préférence de remise, message utile..."
            value={form.notes}
          />
        </label>

        {status.type === "error" ? <p className="mt-4 text-sm text-[#ff8e75]" role="alert">{status.message}</p> : null}

        <button aria-busy={status.type === "loading"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center border-2 border-[#351815] bg-[#351815] px-4 py-3 font-mono text-sm font-black uppercase text-[#f6eadf] transition hover:bg-[#ffb000] hover:text-[#351815] disabled:opacity-50" disabled={status.type === "loading"} type="submit">
          {status.type === "loading" ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </form>

      <aside className="border-2 border-[#351815] bg-[#351815] p-6 text-[#f6eadf]">
        <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">Récapitulatif</p>
        <div className="mt-4 space-y-4">
          {items.length ? (
            items.map((item) => (
              <div className="border-b-2 border-[#f6eadf] pb-4" key={item!.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item!.name}</p>
                    <p className="text-sm text-[#f6eadf]/55">
                      {item!.quantity} x {item!.price}€
                    </p>
                  </div>
                  <strong>{item!.quantity * item!.price}€</strong>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#f6eadf]/64">
              Aucun article dans le panier.
            </p>
          )}
        </div>
        <div className="mt-6 border-t-2 border-[#f6eadf] pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#f6eadf]/64">Total</span>
            <strong className="text-2xl">{total}€</strong>
          </div>
        </div>
        <p className="mt-5 text-sm text-[#f6eadf]/58">
          La demande confirme ton panier, ton mode de remise et tes coordonnées avant validation finale par email.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  autoComplete,
  onChange,
  required = false,
  type = "text",
  value
}: {
  label: string;
  autoComplete?: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs font-black uppercase text-[#351815]/58">{label}</span>
      <input autoComplete={autoComplete} className="w-full border-2 border-[#351815] bg-[#f6eadf] p-3 font-mono text-sm outline-none transition focus:bg-[#ffb000]/20" onChange={(event) => onChange(event.target.value)} required={required} type={type} value={value} />
    </label>
  );
}
