import "server-only";

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

export async function createAdminPartner(input: { name: string; contactEmail: string | null }) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("partners").insert({
    name: input.name,
    contact_email: input.contactEmail,
    active: true
  });

  if (error) {
    throw new Error("Partner create failed");
  }
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
