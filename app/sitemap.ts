import type { MetadataRoute } from "next";
import { SEO_SLUGS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/pricing", "/about", "/privacy", "/terms"];
  const seoRoutes = SEO_SLUGS.map((slug) => `/${slug}`);

  return [...staticRoutes, ...seoRoutes].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-06-08"),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7
  }));
}
