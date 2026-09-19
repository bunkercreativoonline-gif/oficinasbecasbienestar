import type { APIRoute } from "astro";
import { renderLlmsTxt } from "../lib/llmsTxt";

export const GET: APIRoute = async () => {
  const body = await renderLlmsTxt();
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
