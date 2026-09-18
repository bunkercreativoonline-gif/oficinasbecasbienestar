import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const SITE = "https://oficinasbecasbienestar.com.mx";

export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  output: "static",
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  build: {
    format: "directory",
    inlineStylesheets: "auto",
  },
  integrations: [
    sitemap({
      changefreq: "weekly",
      lastmod: new Date("2026-09-18"),
      serialize(item) {
        const url = item.url;
        if (url === `${SITE}/`) {
          item.priority = 1;
        } else if (url.includes("/sede/")) {
          item.priority = 0.8;
        } else if (/\/estado\/[^/]+\/[^/]+\/$/.test(url)) {
          item.priority = 0.7;
        } else if (/\/estado\/[^/]+\/$/.test(url)) {
          item.priority = 0.75;
        } else if (url.includes("/tipo/")) {
          item.priority = 0.6;
        } else if (url.includes("/buscar/")) {
          item.priority = 0.5;
          item.changefreq = "monthly";
        }
        return item;
      },
    }),
  ],
});
