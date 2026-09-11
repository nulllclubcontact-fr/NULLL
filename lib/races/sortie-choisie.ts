/**
 * La sortie choisie sur la page « Sorties » voyage dans l'URL jusqu'a
 * l'espace membre (?sortie=<id>), a travers identification, inscription,
 * connexion et decharge. Elle n'inscrit personne : l'espace membre la met
 * en avant et le membre confirme d'un clic.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sortieValide(valeur: unknown): valeur is string {
  return typeof valeur === "string" && UUID.test(valeur);
}

/** « ?sortie=<id> » si l'identifiant est valable, sinon rien. */
export function suiteSortie(valeur: unknown) {
  return sortieValide(valeur) ? `?sortie=${valeur}` : "";
}

export function destinationMembre(valeur: unknown) {
  return `/membre${suiteSortie(valeur)}`;
}
