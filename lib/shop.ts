export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutPayload = {
  locale: "fr";
  items: CartItem[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  notes: string;
};

export const CART_STORAGE_KEY = "nulll-cart-v2";

export function parseCart(value: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry) => entry && typeof entry.productId === "string" && Number.isFinite(entry.quantity))
      .map((entry) => ({
        productId: entry.productId,
        quantity: Math.max(1, Math.floor(entry.quantity))
      }));
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]) {
  return JSON.stringify(items.filter((item) => item.quantity > 0));
}

export function upsertCartItem(items: CartItem[], productId: string, quantity: number) {
  const next = items.filter((item) => item.productId !== productId);
  if (quantity > 0) {
    next.push({ productId, quantity });
  }
  return next;
}
