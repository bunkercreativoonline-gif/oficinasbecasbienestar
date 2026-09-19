export const BECAS_BIENESTAR_URL = "https://becasmexico.org/becas-bienestar/";

const OUTBOUND_HREF_RE =
  /https?:\/\/(?:www\.)?becasmexico\.org\/becas-bienestar\/?/i;

/** Two-word phrase; preserves the original match when wrapping. */
const PHRASE_RE = /Becas[ \t]+Bienestar/gi;

export function hasBecasBienestarOutboundLink(html: string): boolean {
  return OUTBOUND_HREF_RE.test(html);
}

function lastIndexOfOpenAnchor(before: string): number {
  const patterns = ["<a ", "<a\n", "<a\t", "<a>"];
  let last = -1;
  for (const token of patterns) {
    const idx = before.toLowerCase().lastIndexOf(token);
    if (idx > last) last = idx;
  }
  return last;
}

function isInsideAnchor(html: string, index: number): boolean {
  const before = html.slice(0, index);
  const lastOpen = lastIndexOfOpenAnchor(before);
  if (lastOpen === -1) return false;
  const lastClose = before.toLowerCase().lastIndexOf("</a>");
  return lastOpen > lastClose;
}

function isInsideTag(html: string, index: number): boolean {
  const before = html.slice(0, index);
  const lastLt = before.lastIndexOf("<");
  const lastGt = before.lastIndexOf(">");
  return lastLt > lastGt;
}

/**
 * Do not wrap the two words when they only appear as a slice of short branding
 * ("Oficinas Becas Bienestar") or would split the official program name.
 */
function isProtectedBrand(html: string, index: number): boolean {
  const prefix = html.slice(Math.max(0, index - 16), index);
  return /Oficinas\s+$/i.test(prefix);
}

/**
 * Wrap the first plain-text "Becas Bienestar" (any casing of those two words)
 * with a single outbound link. Skips matches already inside an `<a>` tag or
 * protected branding. If the string already links to the target URL, it is
 * left unchanged.
 */
export function linkFirstBecasBienestar(html: string): {
  html: string;
  linked: boolean;
} {
  if (hasBecasBienestarOutboundLink(html)) {
    return { html, linked: true };
  }

  const re = new RegExp(PHRASE_RE.source, PHRASE_RE.flags);
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    if (isInsideAnchor(html, match.index)) continue;
    if (isInsideTag(html, match.index)) continue;
    if (isProtectedBrand(html, match.index)) continue;

    const original = match[0];
    const wrapped = `${html.slice(0, match.index)}<a href="${BECAS_BIENESTAR_URL}">${original}</a>${html.slice(match.index + original.length)}`;
    return { html: wrapped, linked: true };
  }

  return { html, linked: false };
}
