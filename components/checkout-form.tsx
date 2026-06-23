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
    setCart(parseCart(window.localStorage.getItem(CART_STORAGE_KEY)));
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
        message: locale === "fr" ? "Ton panier est vide." : "Your cart is empty."
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
        message:
          locale === "fr"
            ? "La demande n'a pas pu partir. Réessaie ou contacte-nous directement par email."
            : "The request could not be sent. Try again or contact us directly by email."
      });
      return;
    }

    if (!response.ok) {
      setStatus({
        type: "error",
        message:
          payload?.message ??
          (locale === "fr" ? "Impossible d’envoyer la demande pour le moment." : "Unable to submit the request right now.")
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
      <div className="panel p-8" role="status">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">{locale === "fr" ? "Commande reçue" : "Order received"}</p>
        <h2 className="mt-4 font-display text-[clamp(2.6rem,5vw,4rem)] uppercase leading-[0.92]">
          {locale === "fr" ? "Demande confirmée." : "Request confirmed."}
        </h2>
        <p className="mt-4 max-w-2xl text-paper/76">
          {locale === "fr"
            ? "Nous avons enregistré ta demande. Conserve cette référence et surveille ta boîte mail pour la confirmation."
            : "Your request has been recorded. Keep this reference and watch your inbox for confirmation."}
        </p>
        <div className="mt-6 inline-flex border border-paper bg-paper px-4 py-3 text-ink">
          <strong>{status.reference}</strong>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link className="primary-link" href={getRoute(locale, "runs")}>
            {locale === "fr" ? "Voir les prochains runs" : "See upcoming runs"}
          </Link>
          <Link className="secondary-link" href={getRoute(locale, "merch")}>
            {locale === "fr" ? "Retour au merch" : "Back to merch"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_0.48fr]">
      <form className="panel p-6 lg:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label={locale === "fr" ? "Prénom" : "First name"}
            autoComplete="given-name"
            onChange={(value) => setForm((current) => ({ ...current, firstName: value }))}
            required
            value={form.firstName}
          />
          <Field
            label={locale === "fr" ? "Nom" : "Last name"}
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
            label={locale === "fr" ? "Téléphone" : "Phone"}
            autoComplete="tel"
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
            required
            value={form.phone}
          />
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm uppercase tracking-[0.14em] text-paper/58">
            {locale === "fr" ? "Méthode de remise" : "Delivery method"}
          </span>
          <select
            className="field"
            onChange={(event) => setForm((current) => ({ ...current, deliveryMethod: event.target.value }))}
            required
            value={form.deliveryMethod}
          >
            <option value="pickup">{locale === "fr" ? "Retrait local à Aix-en-Provence" : "Local pickup in Aix-en-Provence"}</option>
            <option value="shipping">{locale === "fr" ? "Envoi après confirmation" : "Shipping after confirmation"}</option>
          </select>
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm uppercase tracking-[0.14em] text-paper/58">
            {locale === "fr" ? "Notes" : "Notes"}
          </span>
          <textarea
            className="field min-h-[140px]"
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder={
              locale === "fr" ? "Taille souhaitée, préférence de remise, message utile..." : "Preferred size, pickup preference, useful message..."
            }
            value={form.notes}
          />
        </label>

        {status.type === "error" ? <p className="mt-4 text-sm text-[#ff8e75]" role="alert">{status.message}</p> : null}

        <button aria-busy={status.type === "loading"} className="primary-button mt-6 w-full justify-center" disabled={status.type === "loading"} type="submit">
          {status.type === "loading"
            ? locale === "fr"
              ? "Envoi en cours..."
              : "Submitting..."
            : locale === "fr"
              ? "Envoyer ma demande"
              : "Submit my order"}
        </button>
      </form>

      <aside className="panel p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">{locale === "fr" ? "Récapitulatif" : "Summary"}</p>
        <div className="mt-4 space-y-4">
          {items.length ? (
            items.map((item) => (
              <div className="border-b border-paper/10 pb-4" key={item!.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item!.name}</p>
                    <p className="text-sm text-paper/55">
                      {item!.quantity} x {item!.price}€
                    </p>
                  </div>
                  <strong>{item!.quantity * item!.price}€</strong>
                </div>
              </div>
            ))
          ) : (
            <p className="text-paper/64">
              {locale === "fr" ? "Aucun article dans le panier." : "No items in your cart."}
            </p>
          )}
        </div>
        <div className="mt-6 border-t border-paper/15 pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-paper/64">{locale === "fr" ? "Total" : "Total"}</span>
            <strong className="text-2xl">{total}€</strong>
          </div>
        </div>
        <p className="mt-5 text-sm text-paper/58">
          {locale === "fr"
            ? "La demande confirme ton panier, ton mode de remise et tes coordonnées avant validation finale par email."
            : "The request confirms your cart, delivery method and contact details before the final email confirmation."}
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
      <span className="mb-2 block text-sm uppercase tracking-[0.14em] text-paper/58">{label}</span>
      <input autoComplete={autoComplete} className="field" onChange={(event) => onChange(event.target.value)} required={required} type={type} value={value} />
    </label>
  );
}
