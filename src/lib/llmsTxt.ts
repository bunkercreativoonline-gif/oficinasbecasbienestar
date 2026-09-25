import { getPublishedPosts, blogPath } from "./blog";
import { getEstadoHubs, getStats } from "./sedes";
import {
  OFFICIAL_BUSCADOR,
  OFFICIAL_PROGRAMA,
  PRIMARY_PHRASE,
  SITE_TAGLINE,
  SITE_URL,
  SOURCE_UPDATED,
} from "./site";
import { TIPO_META } from "./tipos";

function abs(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mdLink(label: string, path: string, note?: string): string {
  const link = `- [${label}](${abs(path)})`;
  return note ? `${link}: ${note}` : link;
}

/** Markdown summary at /llms.txt for agents (llmstxt.org + Lighthouse). */
export async function renderLlmsTxt(): Promise<string> {
  const stats = getStats();
  const estados = getEstadoHubs();
  const posts = await getPublishedPosts();

  const lines = [
    `# ${PRIMARY_PHRASE}`,
    "",
    `> ${SITE_TAGLINE}. ${stats.sedes} sedes (${stats.cabb} CABB, ${stats.sare} SARE, ${stats.ore} ORE) en ${stats.estados} estados y ${stats.municipios} municipios. No es un sitio oficial de gobierno.`,
    "",
    `Directorio estático con dirección, teléfono y mapa tomados del buscador oficial de sedes (${SOURCE_UPDATED}). Verifica horarios y vigencia en la fuente oficial antes de acudir. Este sitio no gestiona citas ni trámites.`,
    "",
    "Cómo navegar: en la portada elige estado y municipio para abrir la página de esa ciudad, o recorre el listado por estado y tipo de sede. Cada ficha (`/sede/...`) incluye datos de contacto y mapa.",
    "",
    "## Navegación",
    "",
    mdLink("Inicio", "/", "Elige estado y municipio para abrir la página de la ciudad"),
    mdLink("Noticias", "/blog/", "Guías prácticas del directorio"),
    mdLink(TIPO_META.CABB.short, `/tipo/${TIPO_META.CABB.slug}/`, TIPO_META.CABB.label),
    mdLink(TIPO_META.SARE.short, `/tipo/${TIPO_META.SARE.slug}/`, TIPO_META.SARE.label),
    mdLink(TIPO_META.ORE.short, `/tipo/${TIPO_META.ORE.slug}/`, TIPO_META.ORE.label),
    mdLink("Mapa del sitio", "/sitemap-index.xml", "Índice de URLs para rastreo"),
    "",
    "## Oficinas por estado",
    "",
    ...estados.map((estado) =>
      mdLink(
        estado.display,
        estado.path,
        `${estado.count} sedes · ${estado.municipios} municipios`,
      ),
    ),
    "",
    "## Noticias",
    "",
    ...(posts.length
      ? posts.map((post) => mdLink(post.data.title, blogPath(post.id), post.data.description))
      : ["- Sin artículos publicados."]),
    "",
    "## Fuentes oficiales",
    "",
    mdLink("Buscador oficial de sedes de atención", OFFICIAL_BUSCADOR),
    mdLink("Programa en gob.mx", OFFICIAL_PROGRAMA),
    "",
  ];

  return `${lines.join("\n")}\n`;
}
