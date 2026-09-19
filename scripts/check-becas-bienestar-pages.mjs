import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = join(import.meta.dirname, "..", "dist");
const TARGET = "https://becasmexico.org/becas-bienestar/";
const LINK_RE = /<a\b[^>]*\bhref=["']https?:\/\/(?:www\.)?becasmexico\.org\/becas-bienestar\/?["'][^>]*>/gi;
const PHRASE_RE = /Becas[ \t]+Bienestar/gi;
const OFFICIAL_RE = /Becas para el Bienestar/gi;

async function htmlFiles(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await htmlFiles(path)));
    } else if (entry.name.endsWith(".html")) {
      out.push(path);
    }
  }
  return out;
}

function visibleBody(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
}

function phraseOutsideAnchors(body) {
  const strippedAnchors = body.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ");
  return PHRASE_RE.test(strippedAnchors);
}

const files = await htmlFiles(DIST);
if (!files.length) {
  throw new Error(`No HTML files in ${DIST}`);
}

let over = 0;
let missing = 0;
const samples = [];

for (const file of files) {
  const html = await readFile(file, "utf8");
  const body = visibleBody(html);
  const links = body.match(LINK_RE) ?? [];
  const rel = file.slice(DIST.length);
  if (links.length > 1) {
    over += 1;
    samples.push(`${rel}: ${links.length} outbound links`);
  }
  const mentionsStandalone = phraseOutsideAnchors(body);
  const mentionsOfficial = OFFICIAL_RE.test(body);
  if ((mentionsStandalone || mentionsOfficial) && links.length === 0) {
    missing += 1;
    samples.push(`${rel}: mentions program but 0 outbound links`);
  }
}

console.log(`Checked ${files.length} HTML files`);
if (over || missing) {
  console.error(`too many links: ${over}`);
  console.error(`missing links: ${missing}`);
  for (const line of samples.slice(0, 20)) console.error("  " + line);
  process.exit(1);
}
console.log(`All pages that mention the program have exactly one link to ${TARGET}`);
