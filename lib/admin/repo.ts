import "server-only";

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { createSupabaseServiceClient } from "../supabase/service";

export type AdminPartner = {
  id: string;
  name: string;
  contact_email: string | null;
  active: boolean;
  created_at: string;
  partner_access_codes: AdminPartnerCode[];
};

export type AdminPartnerCode = {
  id: string;
  active: boolean;
  created_at: string;
  last_used_at: string | null;
};

export type AdminLoyaltyTier = {
  id: string;
  name: string;
  min_points: number;
  discount_percent: number;
  position: number;
  created_at: string;
};

type AppConfigRow = {
  value: number | string | null;
};

export async function listAdminPartners() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id,name,contact_email,active,created_at,partner_access_codes(id,active,created_at,last_used_at)")
    .order("created_at", { ascending: false })
    .returns<AdminPartner[]>();

  if (error) {
    throw new Error("Partners unavailable");
  }

  return data ?? [];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getAdminPartner(partnerId: string) {
  // Un identifiant mal forme ferait lever Postgres : on repond « introuvable ».
  if (!UUID.test(partnerId)) {
    return null;
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id,name,contact_email,active,created_at,partner_access_codes(id,active,created_at,last_used_at)")
    .eq("id", partnerId)
    .maybeSingle<AdminPartner>();

  if (error) {
    throw new Error("Partner unavailable");
  }

  return data;
}

export type AdminPartnerSale = {
  id: string;
  partner_id: string;
  member_id: string;
  label: string;
  amount_eur: number;
  points_awarded: number;
  created_at: string;
  profiles: { first_name: string | null; last_name: string | null } | null;
};

const SALES_PAGE_SIZE = 1000;

/**
 * Ventes scannees en caisse, de la plus recente a la plus ancienne. Supabase
 * plafonne une lecture a 1000 lignes : on pagine pour que les totaux restent
 * justes quand l'historique grossit.
 */
export async function listAdminPartnerSales(partnerId?: string) {
  const supabase = createSupabaseServiceClient();
  const sales: AdminPartnerSale[] = [];

  for (let from = 0; ; from += SALES_PAGE_SIZE) {
    const base = supabase
      .from("transactions")
      .select("id,partner_id,member_id,label,amount_eur,points_awarded,created_at,profiles(first_name,last_name)");
    const filtered = partnerId ? base.eq("partner_id", partnerId) : base;
    const { data, error } = await filtered
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, from + SALES_PAGE_SIZE - 1)
      .returns<AdminPartnerSale[]>();

    if (error) {
      throw new Error("Sales unavailable");
    }

    sales.push(...(data ?? []));

    if (!data || data.length < SALES_PAGE_SIZE) {
      return sales;
    }
  }
}

/** Totaux d'une liste de ventes, attendue triee de la plus recente a la plus ancienne. */
export function summarizePartnerSales(sales: AdminPartnerSale[]) {
  const purchasesByMember = new Map<string, number>();
  let revenue = 0;
  let points = 0;

  for (const sale of sales) {
    revenue += Number(sale.amount_eur);
    points += sale.points_awarded;
    purchasesByMember.set(sale.member_id, (purchasesByMember.get(sale.member_id) ?? 0) + 1);
  }

  return {
    revenue,
    points,
    count: sales.length,
    clients: purchasesByMember.size,
    returningClients: [...purchasesByMember.values()].filter((n) => n > 1).length,
    averageBasket: sales.length === 0 ? 0 : revenue / sales.length,
    lastSaleAt: sales[0]?.created_at ?? null
  };
}

export async function createAdminPartner(input: { name: string; contactEmail: string | null }) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("partners")
    .insert({
      name: input.name,
      contact_email: input.contactEmail,
      active: true
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw new Error("Partner create failed");
  }

  return data.id;
}

/**
 * Donne au partenaire un nouveau code d'acces a l'espace pro et le renvoie
 * en clair, pour un seul affichage : seule son empreinte bcrypt est gardee.
 * Un seul code vaut a la fois : les precedents cessent de fonctionner.
 */
export async function issueAdminPartnerCode(partnerId: string) {
  const supabase = createSupabaseServiceClient();
  const code = `PRO-${randomBytes(9).toString("base64url").toUpperCase()}`;
  const codeHash = await bcrypt.hash(code, 12);

  const { data, error } = await supabase
    .from("partner_access_codes")
    .insert({ partner_id: partnerId, code_hash: codeHash, active: true })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw new Error("Code create failed");
  }

  // Le nouveau code existe avant que les anciens tombent : le partenaire
  // n'est jamais laisse sans acces si l'une des deux ecritures echoue.
  const { error: revokeError } = await supabase
    .from("partner_access_codes")
    .update({ active: false })
    .eq("partner_id", partnerId)
    .eq("active", true)
    .neq("id", data.id);

  if (revokeError) {
    throw new Error("Code revoke failed");
  }

  return code;
}

/**
 * Supprime un partenaire sans vente. S'il en a, la base refuse (les ventes
 * portent l'historique de points des membres) : on le dit sans rien casser.
 */
export async function deleteAdminPartner(partnerId: string) {
  const supabase = createSupabaseServiceClient();
  const { count, error: countError } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("partner_id", partnerId);

  if (countError) {
    throw new Error("Sales unavailable");
  }

  if ((count ?? 0) > 0) {
    return { deleted: false, sales: count ?? 0 };
  }

  const { error } = await supabase.from("partners").delete().eq("id", partnerId);

  if (error) {
    throw new Error("Partner delete failed");
  }

  return { deleted: true, sales: 0 };
}

export async function setAdminPartnerActive(partnerId: string, active: boolean) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("partners").update({ active }).eq("id", partnerId);

  if (error) {
    throw new Error("Partner update failed");
  }
}

export async function createAdminPartnerCode(partnerId: string, codeHash: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("partner_access_codes").insert({
    partner_id: partnerId,
    code_hash: codeHash,
    active: true
  });

  if (error) {
    throw new Error("Code create failed");
  }
}

export async function revokeAdminPartnerCode(codeId: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("partner_access_codes").update({ active: false }).eq("id", codeId);

  if (error) {
    throw new Error("Code revoke failed");
  }
}

export async function getAdminPointsPerEuro() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "points_per_euro")
    .maybeSingle<AppConfigRow>();

  if (error) {
    throw new Error("Config unavailable");
  }

  return Number(data?.value ?? 1);
}

export async function updateAdminPointsPerEuro(pointsPerEuro: number) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("app_config").upsert({
    key: "points_per_euro",
    value: pointsPerEuro,
    updated_at: new Date().toISOString()
  });

  if (error) {
    throw new Error("Config update failed");
  }
}

export async function listAdminLoyaltyTiers() {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("loyalty_tiers")
    .select("id,name,min_points,discount_percent,position,created_at")
    .order("min_points", { ascending: true })
    .returns<AdminLoyaltyTier[]>();

  if (error) {
    throw new Error("Tiers unavailable");
  }

  return data ?? [];
}

export async function createAdminLoyaltyTier(input: { name: string; minPoints: number; discountPercent: number; position: number }) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("loyalty_tiers").insert({
    name: input.name,
    min_points: input.minPoints,
    discount_percent: input.discountPercent,
    position: input.position
  });

  if (error) {
    throw new Error("Tier create failed");
  }
}

export async function updateAdminLoyaltyTier(
  tierId: string,
  input: { name: string; minPoints: number; discountPercent: number; position: number }
) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("loyalty_tiers")
    .update({
      name: input.name,
      min_points: input.minPoints,
      discount_percent: input.discountPercent,
      position: input.position
    })
    .eq("id", tierId);

  if (error) {
    throw new Error("Tier update failed");
  }
}

export async function deleteAdminLoyaltyTier(tierId: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("loyalty_tiers").delete().eq("id", tierId);

  if (error) {
    throw new Error("Tier delete failed");
  }
}
