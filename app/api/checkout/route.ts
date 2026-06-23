import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const isFrench = payload?.locale === "fr";

  const required = ["firstName", "lastName", "email", "phone", "deliveryMethod"];
  const missing = required.find((field) => !payload?.[field]);

  if (missing) {
    return NextResponse.json(
      {
        message: isFrench ? "Merci de compléter tous les champs obligatoires." : "Please complete every required field."
      },
      { status: 400 }
    );
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json(
      {
        message: isFrench ? "Le panier est vide." : "The cart is empty."
      },
      { status: 400 }
    );
  }

  const reference = `NULLL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return NextResponse.json({
    ok: true,
    reference
  });
}
