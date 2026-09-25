"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "../../lib/admin/require-admin";
import { journaliser } from "../../lib/admin/journal";
import { identifiantValide } from "../../lib/admin/regles";
import { createAdminPartner, deleteAdminPartner, issueAdminPartnerCode, setAdminPartnerActive, updateAdminPartner } from "../../lib/admin/repo";

export type PartenaireState = { error?: string; message?: string; code?: string; partenaireId?: string; nom?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function lire(formData: FormData, cle: string, max = 200) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function rafraichir(partenaireId?: string) {
  revalidatePath("/admin/reseau");
  if (partenaireId) revalidatePath(`/admin/reseau/${partenaireId}`);
}

/** Cree le partenaire et son premier code, rendu en clair une seule fois. */
export async function creerPartenaire(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const nom = lire(formData, "name", 120);
  const email = lire(formData, "contact_email").toLowerCase();

  if (!nom) {
    return { error: "Il faut au moins un nom." };
  }

  if (email && !EMAIL.test(email)) {
    return { error: "E-mail invalide." };
  }

  try {
    const partenaireId = await createAdminPartner({ name: nom, contactEmail: email || null });
    const code = await issueAdminPartnerCode(partenaireId);
    await journaliser(admin.user.id, "partenaire.creation", partenaireId, { nom });
    rafraichir(partenaireId);
    return { code, partenaireId, nom };
  } catch {
    return { error: "Création refusée. Réessaie." };
  }
}

/** Nouveau code : l'ancien cesse aussitot de fonctionner. */
export async function genererNouveauCode(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const partenaireId = lire(formData, "partner_id", 40);

  if (!identifiantValide(partenaireId)) {
    return { error: "Partenaire manquant." };
  }

  try {
    const code = await issueAdminPartnerCode(partenaireId);
    await journaliser(admin.user.id, "partenaire.code", partenaireId);
    rafraichir(partenaireId);
    return { code, partenaireId };
  } catch {
    return { error: "Génération impossible. Réessaie." };
  }
}

/** Corriger le nom ou l'e-mail d'un partenaire sans toucher a ses codes ni a ses ventes. */
export async function modifierPartenaire(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const partenaireId = lire(formData, "partner_id", 40);
  const nom = lire(formData, "name", 120);
  const email = lire(formData, "contact_email").toLowerCase();

  if (!identifiantValide(partenaireId) || !nom) {
    return { error: "Il faut au moins un nom." };
  }

  if (email && !EMAIL.test(email)) {
    return { error: "E-mail invalide." };
  }

  try {
    await updateAdminPartner(partenaireId, { name: nom, contactEmail: email || null });
  } catch {
    return { error: "Enregistrement refusé. Réessaie." };
  }

  await journaliser(admin.user.id, "partenaire.modification", partenaireId, { nom });
  rafraichir(partenaireId);
  return { message: "Enregistré." };
}

export async function basculerPartenaire(formData: FormData) {
  const admin = await isAdminUser();

  if (!admin) {
    redirect("/membre");
  }

  const partenaireId = lire(formData, "partner_id", 40);

  if (identifiantValide(partenaireId)) {
    const actif = formData.get("active") === "true";
    await setAdminPartnerActive(partenaireId, actif);
    await journaliser(admin.user.id, actif ? "partenaire.activation" : "partenaire.desactivation", partenaireId);
    rafraichir(partenaireId);
  }
}

export async function supprimerPartenaire(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  const admin = await isAdminUser();

  if (!admin) {
    return { error: "Accès refusé." };
  }

  const partenaireId = lire(formData, "partner_id", 40);

  if (!identifiantValide(partenaireId)) {
    return { error: "Partenaire manquant." };
  }

  let resultat;

  try {
    resultat = await deleteAdminPartner(partenaireId);
  } catch {
    return { error: "Suppression impossible. Réessaie." };
  }

  if (!resultat.deleted) {
    return {
      error: `${resultat.sales} vente${resultat.sales > 1 ? "s sont rattachées" : " est rattachée"} à ce partenaire : les effacer ferait disparaître des points de membres. Désactive-le plutôt, il ne pourra plus se connecter.`
    };
  }

  await journaliser(admin.user.id, "partenaire.suppression", partenaireId);
  rafraichir();
  redirect("/admin/reseau");
}
