import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const SITE = "https://oficinasbecasbienestar.com.mx";

function isExcludedFromSitemap(url) {
  try {
    const path = new URL(url).pathname;
    return (
      path.includes("404") ||
      path.endsWith("/sitemap.xml") ||
      path.endsWith("/sitemap.xml/")
    );
  } catch {
    return url.includes("404");
  }
}

function sitemapPriority(url) {
  if (url === `${SITE}/`) {
    return { priority: 1, changefreq: "weekly" };
  }
  if (url.includes("/tipo/")) {
    return { priority: 0.8, changefreq: "weekly" };
  }
  if (/\/estado\/[^/]+\/[^/]+\/$/.test(url)) {
    return { priority: 0.7, changefreq: "weekly" };
  }
  if (/\/estado\/[^/]+\/$/.test(url)) {
    return { priority: 0.9, changefreq: "weekly" };
  }
  if (url.includes("/sede/")) {
    return { priority: 0.6, changefreq: "monthly" };
  }
  if (url === `${SITE}/blog/` || /\/blog\/[^/]+\/$/.test(url)) {
    return { priority: 0.7, changefreq: "weekly" };
  }
  return { priority: 0.5, changefreq: "weekly" };
}

/** Copia sitemap-index.xml a sitemap.xml para quien espera esa URL. */
function sitemapXmlAlias() {
  return {
    name: "sitemap-xml-alias",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const dist = fileURLToPath(dir);
        const indexFile = join(dist, "sitemap-index.xml");
        const aliasFile = join(dist, "sitemap.xml");
        if (existsSync(indexFile)) {
          copyFileSync(indexFile, aliasFile);
        }
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  output: "static",
  compressHTML: true,
  prefetch: false,
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      // Modern targets — avoid legacy polyfills flagged as unused/legacy JS.
      target: ["chrome111", "edge111", "firefox111", "safari16.4"],
      cssTarget: "safari16.4",
    },
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: "weekly",
      lastmod: new Date("2026-09-18"),
      filter: (page) => !isExcludedFromSitemap(page),
      serialize(item) {
        if (isExcludedFromSitemap(item.url)) {
          return undefined;
        }
        const { priority, changefreq } = sitemapPriority(item.url);
        item.priority = priority;
        item.changefreq = changefreq;
        return item;
      },
    }),
    sitemapXmlAlias(),
  ],
});
