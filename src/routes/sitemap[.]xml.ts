import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getModelCatalog, getInventory } from "@/lib/pricing.functions";

const BASE_URL = "https://obnovi.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/kupi", changefreq: "daily", priority: "0.9" },
          { path: "/prodaj", changefreq: "weekly", priority: "0.9" },
          { path: "/kako-radi", changefreq: "monthly", priority: "0.6" },
          { path: "/pitanja", changefreq: "monthly", priority: "0.6" },
          { path: "/o-nama", changefreq: "yearly", priority: "0.4" },
          { path: "/kontakt", changefreq: "yearly", priority: "0.4" },
        ];

        try {
          const models = await getModelCatalog();
          for (const m of models) {
            entries.push({ path: `/kupi-iphone/${m.slug}`, changefreq: "weekly", priority: "0.8" });
          }
        } catch { /* ignore — sitemap still valid without dynamic entries */ }

        try {
          const items = await getInventory();
          for (const it of items ?? []) {
            entries.push({ path: `/kupi/${it.id}`, changefreq: "weekly", priority: "0.7" });
          }
        } catch { /* ignore */ }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
