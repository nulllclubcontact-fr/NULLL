"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "../../lib/admin/require-admin";
import { createAdminPartner, deleteAdminPartner, issueAdminPartnerCode, setAdminPartnerActive } from "../../lib/admin/repo";

export type PartenaireState = { error?: string; code?: string; partenaireId?: string; nom?: string };

function lire(formData: FormData, cle: string, max = 200) {
  const valeur = formData.get(cle);
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function rafraichir(partenaireId?: string) {
  revalidatePath("/admin/reseau");
  revalidatePath("/admin/partenaires");
  if (partenaireId) revalidatePath(`/admin/reseau/${partenaireId}`);
}

/** Cree le partenaire et son premier code, rendu en clair une seule fois. */
export async function creerPartenaire(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  if (!(await isAdminUser())) {
    return { error: "Accès refusé." };
  }

  const nom = lire(formData, "name", 120);
  const email = lire(formData, "contact_email").toLowerCase();

  if (!nom) {
    return { error: "Il faut au moins un nom." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "E-mail invalide." };
  }

  try {
    const partenaireId = await createAdminPartner({ name: nom, contactEmail: email || null });
    const code = await issueAdminPartnerCode(partenaireId);
    rafraichir(partenaireId);
    return { code, partenaireId, nom };
  } catch {
    return { error: "Création refusée. Réessaie." };
  }
}

/** Nouveau code : l'ancien cesse aussitot de fonctionner. */
export async function genererNouveauCode(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  if (!(await isAdminUser())) {
    return { error: "Accès refusé." };
  }

  const partenaireId = lire(formData, "partner_id", 40);

  if (!partenaireId) {
    return { error: "Partenaire manquant." };
  }

  try {
    const code = await issueAdminPartnerCode(partenaireId);
    rafraichir(partenaireId);
    return { code, partenaireId };
  } catch {
    return { error: "Génération impossible. Réessaie." };
  }
}

export async function basculerPartenaire(formData: FormData) {
  if (!(await isAdminUser())) {
    redirect("/membre");
  }

  const partenaireId = lire(formData, "partner_id", 40);

  if (partenaireId) {
    await setAdminPartnerActive(partenaireId, formData.get("active") === "true");
    rafraichir(partenaireId);
  }
}

export async function supprimerPartenaire(_previousState: PartenaireState, formData: FormData): Promise<PartenaireState> {
  if (!(await isAdminUser())) {
    return { error: "Accès refusé." };
  }

  const partenaireId = lire(formData, "partner_id", 40);

  if (!partenaireId) {
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

  rafraichir();
  redirect("/admin/reseau");
}
