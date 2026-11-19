import type { MetadataRoute } from "next";
import { listActus } from "../lib/actus";
import { guidesDeLaRubrique } from "../lib/guides";
import { getRoute, type RouteKey } from "../lib/site-content";

// « about » n'est plus une page : elle redirige en 308 vers « community ».
// Une URL qui redirige n'a rien a faire dans un sitemap.
const routeKeys: RouteKey[] = ["home", "runs", "community", "merch", "contact", "localClub", "localRunning", "localEvents", "news", "partners", "guides"];

// Pas de lastmod : la date du build annoncait chaque page modifiee a
// chaque deploiement, ce qui est faux, et Google ignore un lastmod peu
// fiable. Mieux vaut n'en donner aucun qu'un faux.
// Une actu, elle, a une vraie date de publication : on la donne.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = routeKeys.map((routeKey) => ({
    url: `https://nulll.club${getRoute("fr", routeKey)}`,
    changeFrequency: routeKey === "home" || routeKey === "runs" || routeKey === "news" ? "weekly" : "monthly",
    priority: routeKey === "home" ? 1 : routeKey === "runs" ? 0.9 : 0.7
  }));
  const actus: MetadataRoute.Sitemap = listActus().map((actu) => ({
    url: `https://nulll.club${getRoute("fr", "news")}/${actu.slug}`,
    lastModified: actu.date,
    changeFrequency: "monthly",
    priority: 0.6
  }));
  // Les guides servis sous /fr/guide/ (les trois premiers gardent leur adresse, deja listee).
  const guides: MetadataRoute.Sitemap = guidesDeLaRubrique().map((guide) => ({
    url: `https://nulll.club${guide.chemin}`,
    lastModified: guide.dateMiseAJour,
    changeFrequency: "monthly",
    priority: 0.7
  }));
  return [...pages, ...actus, ...guides];
}
