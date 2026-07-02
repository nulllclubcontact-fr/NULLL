import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { productsByLocale, type Locale } from "../../../lib/site-content";
import { createSupabaseServiceClient } from "../../../lib/supabase/service";

const allowedDeliveryMethods = new Set(["pickup", "shipping"]);

type CheckoutItemInput = {
  productId?: unknown;
  quantity?: unknown;
};

function readString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getLocale(value: unknown): Locale | null {
  return value === "fr" ? "fr" : null;
}

function makeReference() {
  return `NULLL-${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Payload invalide." }, { status: 400 });
  }

  const locale = getLocale(payload.locale);

  if (!locale) {
    return NextResponse.json({ message: "Locale invalide." }, { status: 400 });
  }

  const firstName = readString(payload.firstName, 80);
  const lastName = readString(payload.lastName, 80);
  const email = readString(payload.email, 160).toLowerCase();
  const phone = readString(payload.phone, 40);
  const deliveryMethod = readString(payload.deliveryMethod, 24);
  const notes = readString(payload.notes, 1000);

  if (!firstName || !lastName || !email || !phone || !allowedDeliveryMethods.has(deliveryMethod) || !isEmail(email)) {
    return NextResponse.json(
      {
        message: "Merci de compléter tous les champs obligatoires."
      },
      { status: 400 }
    );
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 20) {
    return NextResponse.json(
      {
        message: "Le panier est vide."
      },
      { status: 400 }
    );
  }

  const products = productsByLocale[locale];
  const validatedItems = (payload.items as CheckoutItemInput[])
    .map((item) => {
      const productId = typeof item.productId === "string" ? item.productId : "";
      const quantity = Number(item.quantity);
      const product = products.find((entry) => entry.id === productId);

      if (!product || !Number.isInteger(quantity) || quantity <= 0 || quantity > 20) {
        return null;
      }

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity
      };
    })
    .filter(Boolean);

  if (validatedItems.length !== payload.items.length || validatedItems.length === 0) {
    return NextResponse.json(
      {
        message: "Le panier contient un article invalide."
      },
      { status: 400 }
    );
  }

  const total = validatedItems.reduce((sum, item) => sum + item!.lineTotal, 0);
  const reference = makeReference();

  let supabase;

  try {
    supabase = createSupabaseServiceClient();
  } catch {
    return NextResponse.json(
      {
        message: "Commande indisponible: configuration serveur manquante."
      },
      { status: 503 }
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("checkout_orders")
    .insert({
      reference,
      locale,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      delivery_method: deliveryMethod,
      notes: notes || null,
      total_eur: total
    })
    .select("id")
    .single<{ id: string }>();

  if (orderError || !order) {
    return NextResponse.json(
      {
        message: "Impossible d’enregistrer la commande pour le moment."
      },
      { status: 503 }
    );
  }

  const { error: itemsError } = await supabase.from("checkout_order_items").insert(
    validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item!.productId,
      product_name: item!.productName,
      quantity: item!.quantity,
      unit_price_eur: item!.unitPrice,
      line_total_eur: item!.lineTotal
    }))
  );

  if (itemsError) {
    return NextResponse.json(
      {
        message: "Commande créée, mais panier incomplet. Contacte-nous avec la référence."
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    reference
  });
}
