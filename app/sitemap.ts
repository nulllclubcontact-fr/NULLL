import type { MetadataRoute } from "next";
import { listActus } from "../lib/actus";
import { getRoute, type RouteKey } from "../lib/site-content";

// « about » n'est plus une page : elle redirige en 308 vers « community ».
// Une URL qui redirige n'a rien a faire dans un sitemap.
const routeKeys: RouteKey[] = ["home", "runs", "community", "merch", "contact", "localClub", "localRunning", "localEvents", "news"];

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
  return [...pages, ...actus];
}
