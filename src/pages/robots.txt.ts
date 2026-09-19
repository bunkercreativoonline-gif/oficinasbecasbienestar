import type { APIRoute } from "astro";
import { SITE_URL } from "../lib/site";

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /404.html",
    "Disallow: /404/",
    "",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    `# Machine-readable site summary: ${SITE_URL}/llms.txt`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
