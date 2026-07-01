"use server";

import bcrypt from "bcryptjs";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, getAdminSession, setAdminSession } from "../../lib/admin/guard";
import {
  createAdminLoyaltyTier,
  createAdminPartner,
  createAdminPartnerCode,
  deleteAdminLoyaltyTier,
  revokeAdminPartnerCode,
  setAdminPartnerActive,
  updateAdminLoyaltyTier,
  updateAdminPointsPerEuro
} from "../../lib/admin/repo";

export type AdminLoginState = {
  error?: string;
};

export type GenerateCodeState = {
  error?: string;
  code?: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isAdminCodeValid(code: string) {
  const expected = process.env.NULLL_ADMIN_CODE ?? "";

  if (!code || !expected) {
    return false;
  }

  const givenBuffer = Buffer.from(code);
  const expectedBuffer = Buffer.from(expected);

  return givenBuffer.length === expectedBuffer.length && timingSafeEqual(givenBuffer, expectedBuffer);
}

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }
}

function generatePlainCode() {
  return `PRO-${randomBytes(9).toString("base64url").toUpperCase()}`;
}

function readNumber(formData: FormData, key: string) {
  const value = readText(formData, key).replace(",", ".");
  return Number(value);
}

function isValidTier(input: { name: string; minPoints: number; discountPercent: number; position: number }) {
  return (
    input.name.length > 0 &&
    input.name.length <= 80 &&
    Number.isInteger(input.minPoints) &&
    input.minPoints >= 0 &&
    input.minPoints <= 100_000 &&
    Number.isFinite(input.discountPercent) &&
    input.discountPercent >= 0 &&
    input.discountPercent <= 100 &&
    Number.isInteger(input.position) &&
    input.position >= 0 &&
    input.position <= 1000
  );
}

export async function loginAdmin(_previousState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const code = readText(formData, "code");

  if (!isAdminCodeValid(code)) {
    return { error: "Acces refuse." };
  }

  try {
    await setAdminSession();
  } catch {
    return { error: "Session admin indisponible: secret serveur manquant." };
  }

  redirect("/admin/partenaires");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createPartner(formData: FormData) {
  await requireAdmin();

  const name = readText(formData, "name");
  const contactEmail = readText(formData, "contact_email").toLowerCase();

  if (!name || name.length > 120) {
    redirect("/admin/partenaires");
  }

  await createAdminPartner({
    name,
    contactEmail: contactEmail || null
  });
  revalidatePath("/admin/partenaires");
  redirect("/admin/partenaires");
}

export async function activatePartner(formData: FormData) {
  await requireAdmin();

  const partnerId = readText(formData, "partner_id");

  if (partnerId) {
    await setAdminPartnerActive(partnerId, true);
  }

  revalidatePath("/admin/partenaires");
}

export async function deactivatePartner(formData: FormData) {
  await requireAdmin();

  const partnerId = readText(formData, "partner_id");

  if (partnerId) {
    await setAdminPartnerActive(partnerId, false);
  }

  revalidatePath("/admin/partenaires");
}

export async function generatePartnerCode(_previousState: GenerateCodeState, formData: FormData): Promise<GenerateCodeState> {
  await requireAdmin();

  const partnerId = readText(formData, "partner_id");

  if (!partnerId) {
    return { error: "Partenaire manquant." };
  }

  const code = generatePlainCode();
  const codeHash = await bcrypt.hash(code, 12);

  await createAdminPartnerCode(partnerId, codeHash);
  revalidatePath("/admin/partenaires");

  return { code };
}

export async function revokePartnerCode(formData: FormData) {
  await requireAdmin();

  const codeId = readText(formData, "code_id");

  if (codeId) {
    await revokeAdminPartnerCode(codeId);
  }

  revalidatePath("/admin/partenaires");
}

export async function updatePointsPerEuro(formData: FormData) {
  await requireAdmin();

  const pointsPerEuro = readNumber(formData, "points_per_euro");

  if (!Number.isFinite(pointsPerEuro) || pointsPerEuro <= 0 || pointsPerEuro > 100) {
    redirect("/admin/fidelite");
  }

  await updateAdminPointsPerEuro(pointsPerEuro);
  revalidatePath("/admin/fidelite");
  revalidatePath("/membre");
  redirect("/admin/fidelite");
}

export async function createLoyaltyTier(formData: FormData) {
  await requireAdmin();

  const input = {
    name: readText(formData, "name"),
    minPoints: readNumber(formData, "min_points"),
    discountPercent: readNumber(formData, "discount_percent"),
    position: readNumber(formData, "position")
  };

  if (!isValidTier(input)) {
    redirect("/admin/fidelite");
  }

  await createAdminLoyaltyTier(input);
  revalidatePath("/admin/fidelite");
  revalidatePath("/membre");
  redirect("/admin/fidelite");
}

export async function updateLoyaltyTier(formData: FormData) {
  await requireAdmin();

  const tierId = readText(formData, "tier_id");
  const input = {
    name: readText(formData, "name"),
    minPoints: readNumber(formData, "min_points"),
    discountPercent: readNumber(formData, "discount_percent"),
    position: readNumber(formData, "position")
  };

  if (!tierId || !isValidTier(input)) {
    redirect("/admin/fidelite");
  }

  await updateAdminLoyaltyTier(tierId, input);
  revalidatePath("/admin/fidelite");
  revalidatePath("/membre");
}

export async function deleteLoyaltyTier(formData: FormData) {
  await requireAdmin();

  const tierId = readText(formData, "tier_id");

  if (tierId) {
    await deleteAdminLoyaltyTier(tierId);
  }

  revalidatePath("/admin/fidelite");
  revalidatePath("/membre");
}
