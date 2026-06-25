"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getProSession, setProSession } from "../../lib/pro/guard";
import { getTierForPoints, type LoyaltyTier } from "../../lib/loyalty/tiers";
import { createSupabaseServiceClient } from "../../lib/supabase/service";

export type ProLoginState = {
  error?: string;
};

export type LookupMemberResult =
  | {
      ok: true;
      firstName: string;
      tierName: string;
      discountPercent: number;
      currentMonthPoints: number;
    }
  | {
      ok: false;
      error: string;
    };

export type CreditPurchaseState = {
  error?: string;
  confirmation?: {
    memberFirstName: string;
    pointsAwarded: number;
    tierName: string;
    discountPercent: number;
  };
};

type PartnerAccessCode = {
  id: string;
  partner_id: string;
  code_hash: string;
  partners: { active: boolean | null } | null;
};

const attempts = new Map<string, { count: number; resetAt: number }>();

function readCode(formData: FormData) {
  const value = formData.get("code");
  return typeof value === "string" ? value.trim() : "";
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formatRpcError() {
  return "Achat refuse. Verifie le QR et le montant.";
}

function getAttemptKey(code: string) {
  return code.slice(0, 4).toLowerCase() || "empty";
}

function isRateLimited(code: string) {
  const key = getAttemptKey(code);
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  current.count += 1;
  return current.count > 8;
}

export async function loginPro(_previousState: ProLoginState, formData: FormData): Promise<ProLoginState> {
  const code = readCode(formData);

  if (!code) {
    return { error: "Code invalide" };
  }

  if (isRateLimited(code)) {
    return { error: "Code invalide" };
  }

  const supabase = createSupabaseServiceClient();
  const { data: accessCodes, error } = await supabase
    .from("partner_access_codes")
    .select("id,partner_id,code_hash,partners(active)")
    .eq("active", true)
    .returns<PartnerAccessCode[]>();

  if (error || !accessCodes?.length) {
    return { error: "Code invalide" };
  }

  for (const accessCode of accessCodes) {
    if (!accessCode.partners?.active) {
      continue;
    }

    const matches = await bcrypt.compare(code, accessCode.code_hash);

    if (matches) {
      await supabase.from("partner_access_codes").update({ last_used_at: new Date().toISOString() }).eq("id", accessCode.id);
      await setProSession(accessCode.partner_id);
      redirect("/pro/scan");
    }
  }

  return { error: "Code invalide" };
}

export async function lookupMember(token: string): Promise<LookupMemberResult> {
  const session = await getProSession();

  if (!session) {
    return { ok: false, error: "Session pro expiree" };
  }

  const cleanToken = token.trim();

  if (!cleanToken) {
    return { ok: false, error: "QR invalide" };
  }

  const supabase = createSupabaseServiceClient();
  const [{ data: profile, error: profileError }, { data: tiers, error: tiersError }] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,current_month_points")
      .eq("qr_token", cleanToken)
      .maybeSingle<{ first_name: string | null; current_month_points: number | null }>(),
    supabase
      .from("loyalty_tiers")
      .select("id,name,min_points,discount_percent,position")
      .order("min_points", { ascending: true })
      .returns<LoyaltyTier[]>()
  ]);

  if (profileError || tiersError || !profile) {
    return { ok: false, error: "Membre introuvable" };
  }

  const currentMonthPoints = profile.current_month_points ?? 0;
  const tierProgress = getTierForPoints(currentMonthPoints, tiers ?? []);

  return {
    ok: true,
    firstName: profile.first_name ?? "Membre NULLL",
    tierName: tierProgress.currentTier?.name ?? "Base",
    discountPercent: tierProgress.currentTier?.discount_percent ?? 0,
    currentMonthPoints
  };
}

export async function creditPurchase(_previousState: CreditPurchaseState, formData: FormData): Promise<CreditPurchaseState> {
  const session = await getProSession();

  if (!session) {
    return { error: "Session pro expiree" };
  }

  const token = readText(formData, "qr_token");
  const label = readText(formData, "label");
  const amountValue = readText(formData, "amount_eur").replace(",", ".");
  const amount = Number(amountValue);

  if (!token) {
    return { error: "QR manquant. Nouveau scan." };
  }

  if (!label || label.length > 80) {
    return { error: "Libelle requis. Court." };
  }

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000) {
    return { error: "Montant invalide." };
  }

  const supabase = createSupabaseServiceClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("qr_token", token)
    .maybeSingle<{ id: string }>();

  if (profileError || !profile) {
    return { error: "Membre introuvable." };
  }

  const since = new Date(Date.now() - 30_000).toISOString();
  const { data: duplicate } = await supabase
    .from("transactions")
    .select("id")
    .eq("member_id", profile.id)
    .eq("partner_id", session.partnerId)
    .eq("amount_eur", amount)
    .gte("created_at", since)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (duplicate) {
    return { error: "Doublon bloque. Attends avant de revalider." };
  }

  const { data, error } = await supabase.rpc("credit_from_purchase", {
    p_qr_token: token,
    p_partner_id: session.partnerId,
    p_label: label,
    p_amount: amount
  });

  if (error || !data || typeof data !== "object") {
    return { error: formatRpcError() };
  }

  const result = data as {
    member_first_name?: string | null;
    points_awarded?: number;
    tier_name?: string | null;
    discount_percent?: number | string | null;
  };

  return {
    confirmation: {
      memberFirstName: result.member_first_name ?? "Membre NULLL",
      pointsAwarded: Number(result.points_awarded ?? 0),
      tierName: result.tier_name ?? "Base",
      discountPercent: Number(result.discount_percent ?? 0)
    }
  };
}
