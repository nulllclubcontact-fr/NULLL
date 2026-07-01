import type { MetadataRoute } from "next";
import { getRoute, type RouteKey } from "../lib/site-content";

const routeKeys: RouteKey[] = ["home", "runs", "community", "merch", "about", "contact", "localClub", "localRunning", "localEvents"];
const lastModified = new Date("2026-06-22");

export default function sitemap(): MetadataRoute.Sitemap {
  return routeKeys.map((routeKey) => ({
    url: `https://nulll.club${getRoute("fr", routeKey)}`,
    lastModified,
    changeFrequency: routeKey === "home" || routeKey === "runs" ? "weekly" : "monthly",
    priority: routeKey === "home" ? 1 : routeKey === "runs" ? 0.9 : 0.7
  }));
}
