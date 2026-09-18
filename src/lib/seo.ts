import { truncate } from "./format";
import { PRIMARY_PHRASE, PRIMARY_PHRASE_SINGULAR } from "./site";
import type { Sede } from "./sedes";
import { TIPO_META, type TipoSede } from "./tipos";

const META_MAX = 160;

function meta(text: string): string {
  return truncate(text.replace(/\s+/g, " ").trim(), META_MAX);
}

function mentionsProgram(text: string): boolean {
  return /becas\s+para\s+el\s+bienestar\s+benito\s+ju[aá]rez/i.test(text);
}

export function homeTitle(): string {
  return `${PRIMARY_PHRASE} | Directorio de sedes de atención en México`;
}

export function homeH1(): string {
  return PRIMARY_PHRASE;
}

export function homeDescription(stats: {
  sedes: number;
  estados: number;
  cabb: number;
  sare: number;
  ore: number;
}): string {
  return meta(
    `Directorio de ${PRIMARY_PHRASE} en México: ${stats.sedes} sedes de atención (${stats.cabb} CABB, ${stats.sare} SARE y ${stats.ore} ORE) en ${stats.estados} estados. Consulta dirección y contacto.`,
  );
}

export function estadoTitle(display: string, count: number): string {
  const n = count === 1 ? "sede de atención" : "sedes de atención";
  return `${PRIMARY_PHRASE} en ${display} | ${count} ${n}`;
}

export function estadoH1(display: string): string {
  return `${PRIMARY_PHRASE} en ${display}`;
}

export function estadoDescription(input: {
  display: string;
  oficial: string;
  count: number;
  municipios: number;
  cabb: number;
  sare: number;
  ore: number;
}): string {
  const oficial =
    input.oficial !== input.display ? ` (${input.oficial})` : "";
  return meta(
    `Oficinas y sedes de atención de Becas para el Bienestar Benito Juárez en ${input.display}${oficial}: ${input.count} oficinas (${input.cabb} CABB, ${input.sare} SARE y ${input.ore} ORE) en ${input.municipios} municipios. Consulta dirección.`,
  );
}

export function municipioTitle(
  municipio: string,
  estado: string,
  count: number,
): string {
  const n = count === 1 ? "oficina" : "oficinas";
  return `${municipio}, ${estado}: ${n} de Becas para el Bienestar Benito Juárez`;
}

export function municipioH1(municipio: string, estado: string): string {
  return `${PRIMARY_PHRASE} en ${municipio}, ${estado}`;
}

export function municipioDescription(input: {
  municipio: string;
  estado: string;
  count: number;
  cabb: number;
  sare: number;
  ore: number;
}): string {
  const parts: string[] = [];
  if (input.cabb) parts.push(`${input.cabb} CABB`);
  if (input.sare) parts.push(`${input.sare} SARE`);
  if (input.ore) parts.push(`${input.ore} ORE`);
  const mix = parts.length ? ` Incluye ${parts.join(", ")}.` : "";
  const n = input.count === 1 ? "oficina" : "oficinas";
  return meta(
    `${PRIMARY_PHRASE} en ${input.municipio}, ${input.estado}: ${input.count} ${n} o sedes de atención.${mix} Consulta dirección y tipo de sede.`,
  );
}

export function sedeTitle(sede: Sede): string {
  const loc = `${sede.municipioDisplay}, ${sede.estadoDisplay}`;
  if (mentionsProgram(sede.nombreDisplay)) {
    return `${sede.nombreDisplay} | ${sede.tipoShort} en ${loc}`;
  }
  return `${sede.nombreDisplay} (${sede.tipoShort}) · ${loc} | ${PRIMARY_PHRASE_SINGULAR}`;
}

export function sedeH1(sede: Sede): string {
  return sede.nombreDisplay;
}

export function sedeDescription(sede: Sede): string {
  const contact = sede.telefonos.length
    ? ` Tel. ${sede.telefonos[0]}.`
    : sede.correos.length
      ? ` Correo ${sede.correos[0]}.`
      : "";
  return meta(
    `${sede.nombreDisplay}, ${PRIMARY_PHRASE_SINGULAR.toLowerCase()} (${sede.tipoShort}) en ${sede.municipioDisplay}, ${sede.estadoDisplay}. Dirección: ${sede.direccion}. C.P. ${sede.cp}.${contact} Consulta ubicación.`,
  );
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
  const metaTipo = TIPO_META[tipo];
  return meta(
    `${count} ${metaTipo.label} (${metaTipo.short}) dentro de las ${PRIMARY_PHRASE} en México. ${metaTipo.descripcion} Consulta dirección por estado.`,
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
    `Busca ${PRIMARY_PHRASE} por estado, municipio, tipo de sede (CABB, SARE u ORE) o palabra clave. Consulta dirección y contacto de cada oficina.`,
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

export function estadoListName(display: string): string {
  return `${PRIMARY_PHRASE} en ${display}`;
}

export function municipioListName(municipio: string, estado: string): string {
  return `${PRIMARY_PHRASE} en ${municipio}, ${estado}`;
}
