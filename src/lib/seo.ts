import { truncate } from "./format";
import { PRIMARY_PHRASE, PRIMARY_PHRASE_SINGULAR } from "./site";
import type { Sede } from "./sedes";
import { TIPO_META, type TipoSede } from "./tipos";

const META_MAX = 160;

const STATE_CITY_BRAND = "Oficinas Becas Bienestar Benito Juárez";
const STATE_CITY_DIRECTORY =
  "Directorio de Oficinas de las Becas Bienestar Benito Juárez";

function meta(text: string): string {
  return truncate(text.replace(/\s+/g, " ").trim(), META_MAX);
}

export function homeTitle(): string {
  const year = new Date().getFullYear();
  return `Oficinas Becas Bienestar Benito Juárez ${year} - Directorio Nacional`;
}

export function homeH1(): string {
  return PRIMARY_PHRASE;
}

export function homeDescription(): string {
  return "Directorio de Oficinas de las Becas Bienestar Benito Juárez. Consulta la sede más cerca a tu domicilio.";
}

export function estadoTitle(display: string): string {
  return `${STATE_CITY_BRAND} en ${display} - Directorio Estatal`;
}

export function estadoH1(display: string): string {
  return `${PRIMARY_PHRASE} en ${display}`;
}

export function estadoDescription(input: { display: string }): string {
  return `${STATE_CITY_DIRECTORY} en ${input.display}. Consulta la sede más cerca a tu domicilio.`;
}

export function municipioTitle(municipio: string): string {
  return `${STATE_CITY_BRAND} en ${municipio} - Horario, teléfono y direcciones`;
}

export function municipioH1(municipio: string): string {
  return `${PRIMARY_PHRASE} en ${municipio}`;
}

export function municipioDescription(input: {
  municipio: string;
  estado: string;
}): string {
  return `${STATE_CITY_DIRECTORY} en ${input.municipio}, ${input.estado}, con horario, teléfono y direcciones.`;
}

/**
 * Código que la ficha ya muestra: prefijo del nombre (id de CABB/SARE o CCT).
 * Las ORE no traen ese prefijo; en la página el identificador corto es el tipo.
 */
function sedeClave(sede: Pick<Sede, "nombreDisplay" | "tipoShort">): string {
  const coded = sede.nombreDisplay.match(/^([0-9A-Z]{2,12})(?:\s+-\s+|\s+)/i);
  if (coded) return coded[1];
  return sede.tipoShort;
}

export function sedeTitle(sede: Sede): string {
  const clave = sedeClave(sede);
  return `Oficina Becas Bienestar ${sede.municipioDisplay} - ${clave} | Horario, Dirección y Teléfono`;
}

export function sedeH1(sede: Sede): string {
  const clave = sedeClave(sede);
  return `${PRIMARY_PHRASE_SINGULAR} en ${sede.municipioDisplay} - ${clave}`;
}

export function sedeDescription(sede: Sede): string {
  const clave = sedeClave(sede);
  return `Consulta el horario, dirección y teléfono de la Oficina de Becas Bienestar en ${sede.municipioDisplay}, ${sede.estadoDisplay} - ${clave}.`;
}

export function tipoTitle(tipo: TipoSede, count: number): string {
  const metaTipo = TIPO_META[tipo];
  return `${metaTipo.short}: oficinas de Becas para el Bienestar Benito Juárez | ${metaTipo.label} (${count})`;
}

export function tipoH1(tipo: TipoSede): string {
  const metaTipo = TIPO_META[tipo];
  return `Oficinas ${metaTipo.short} de Becas para el Bienestar Benito Juárez`;
}

export function tipoDescription(tipo: TipoSede, count: number): string {
  const extra = {
    CABB: "centros locales de atención",
    SARE: "sedes auxiliares regionales",
    ORE: "representaciones estatales",
  }[tipo];
  return meta(
    `Listado de ${count} ${tipo} (${extra}) de las Oficinas de Becas para el Bienestar Benito Juárez en México. Consulta dirección por estado.`,
  );
}

export function buscarTitle(): string {
  return `Buscar ${PRIMARY_PHRASE} | Sedes de atención`;
}

export function buscarH1(): string {
  return `Buscar ${PRIMARY_PHRASE}`;
}

export function buscarDescription(): string {
  return meta(
    `Busca ${PRIMARY_PHRASE} por estado, municipio o tipo de sede (CABB, SARE u ORE). Consulta dirección y contacto de cada oficina.`,
  );
}

export function notFoundTitle(): string {
  return `Página no encontrada | ${PRIMARY_PHRASE}`;
}

export function notFoundH1(): string {
  return "No encontramos esa página";
}

export function notFoundDescription(): string {
  return meta(
    `La página no existe. Usa el buscador o elige un estado para localizar Oficinas de Becas para el Bienestar Benito Juárez y sus sedes de atención.`,
  );
}

export function blogIndexTitle(): string {
  return `Noticias y guía | ${PRIMARY_PHRASE}`;
}

export function blogIndexH1(): string {
  return `Noticias y guía de ${PRIMARY_PHRASE}`;
}

export function blogIndexDescription(): string {
  return meta(
    `Noticias y guía de ${PRIMARY_PHRASE}: cómo hablar con un asesor, preparar tu visita y localizar una sede de atención.`,
  );
}

export function blogPostTitle(title: string): string {
  return `${title} | ${PRIMARY_PHRASE}`;
}

export function blogPostH1(title: string): string {
  return title;
}

export function blogPostDescription(description: string): string {
  return meta(description);
}

export function estadoListName(display: string): string {
  return `${PRIMARY_PHRASE} en ${display}`;
}

export function municipioListName(municipio: string, estado: string): string {
  return `${PRIMARY_PHRASE} en ${municipio}, ${estado}`;
}
