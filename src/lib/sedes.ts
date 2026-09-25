import rawSedes from "../data/sedes.json";
import { limpiarDireccion, type DireccionLimpia } from "./direccion";
import {
  cleanNombre,
  parseCoord,
  splitList,
} from "./format";
import {
  estadoDisplay,
  estadoOficial,
  estadoFromSlug,
  estadoSlug,
  sedeSlug,
  slugify,
  titleCaseEs,
} from "./slug";
import { TIPO_META, type TipoSede, isTipo } from "./tipos";

export interface SedeRaw {
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  asentamiento: string;
  localidad: string;
  municipio: string;
  estado: string;
  estadoId: number;
  municipioId: number;
  cp: number | string;
  telefonos: string;
  correos: string;
  lat: string;
  lng: string;
  gps: string;
}

export interface Sede {
  id: number;
  nombre: string;
  nombreDisplay: string;
  tipo: TipoSede;
  tipoLabel: string;
  tipoShort: string;
  direccion: string;
  direccionOriginal: string;
  direccionLimpia: DireccionLimpia;
  asentamiento: string;
  asentamientoDisplay: string;
  localidad: string;
  localidadDisplay: string;
  municipio: string;
  municipioDisplay: string;
  estado: string;
  estadoDisplay: string;
  estadoOficial: string;
  estadoId: number;
  municipioId: number;
  cp: string;
  telefonos: string[];
  correos: string[];
  lat: number | null;
  lng: number | null;
  slug: string;
  estadoSlug: string;
  municipioSlug: string;
  path: string;
  estadoPath: string;
  municipioPath: string;
}

export interface SearchHit {
  slug: string;
  path: string;
  nombre: string;
  tipo: TipoSede;
  municipio: string;
  estado: string;
  estadoSlug: string;
  municipioSlug: string;
  direccion: string;
  direccionOriginal: string;
  cp: string;
}

export interface MunicipioHub {
  nombre: string;
  display: string;
  slug: string;
  path: string;
  estado: string;
  estadoSlug: string;
  estadoDisplay: string;
  count: number;
  cabb: number;
  sare: number;
  ore: number;
}

export interface EstadoHub {
  nombre: string;
  display: string;
  oficial: string;
  slug: string;
  path: string;
  count: number;
  cabb: number;
  sare: number;
  ore: number;
  municipios: number;
}

function normalizeSede(raw: SedeRaw): Sede {
  if (!isTipo(raw.tipo)) {
    throw new Error(`Tipo de sede desconocido: ${raw.tipo} (id ${raw.id})`);
  }
  const tipo = raw.tipo;
  const eSlug = estadoSlug(raw.estado);
  const mSlug = slugify(raw.municipio);
  const slug = sedeSlug(raw.nombre, tipo, raw.estado);
  const estadoPath = `/estado/${eSlug}/`;
  const municipioPath = `${estadoPath}${mSlug}/`;
  const lat = parseCoord(raw.lat);
  const lng = parseCoord(raw.lng);
  const direccionLimpia = limpiarDireccion({
    direccion: raw.direccion,
    asentamiento: raw.asentamiento,
    localidad: raw.localidad,
    municipio: raw.municipio,
    estado: raw.estado,
    cp: raw.cp,
  });

  return {
    id: raw.id,
    nombre: raw.nombre,
    nombreDisplay: cleanNombre(raw.nombre),
    tipo,
    tipoLabel: TIPO_META[tipo].label,
    tipoShort: TIPO_META[tipo].short,
    direccion: direccionLimpia.unaLinea,
    direccionOriginal: raw.direccion,
    direccionLimpia,
    asentamiento: raw.asentamiento,
    asentamientoDisplay: titleCaseEs(raw.asentamiento),
    localidad: raw.localidad,
    localidadDisplay: titleCaseEs(raw.localidad),
    municipio: raw.municipio,
    municipioDisplay: titleCaseEs(raw.municipio),
    estado: raw.estado,
    estadoDisplay: estadoDisplay(raw.estado),
    estadoOficial: estadoOficial(raw.estado),
    estadoId: raw.estadoId,
    municipioId: raw.municipioId,
    cp: direccionLimpia.postalCode,
    telefonos: splitList(raw.telefonos),
    correos: splitList(raw.correos),
    lat,
    lng,
    slug,
    estadoSlug: eSlug,
    municipioSlug: mSlug,
    path: `/sede/${slug}/`,
    estadoPath,
    municipioPath,
  };
}

const SEDES: Sede[] = (rawSedes as SedeRaw[]).map(normalizeSede);

const BY_SLUG = new Map(SEDES.map((sede) => [sede.slug, sede]));

function countTipos(list: Sede[]) {
  let cabb = 0;
  let sare = 0;
  let ore = 0;
  for (const sede of list) {
    if (sede.tipo === "CABB") cabb += 1;
    else if (sede.tipo === "SARE") sare += 1;
    else ore += 1;
  }
  return { cabb, sare, ore };
}

export function getAllSedes(): Sede[] {
  return SEDES;
}

export function getSedeBySlug(slug: string): Sede | undefined {
  return BY_SLUG.get(slug);
}

export function getSedesByEstado(estadoSlugValue: string): Sede[] {
  return SEDES.filter((sede) => sede.estadoSlug === estadoSlugValue);
}

export function getSedesByMunicipio(estadoSlugValue: string, municipioSlugValue: string): Sede[] {
  return SEDES.filter(
    (sede) =>
      sede.estadoSlug === estadoSlugValue && sede.municipioSlug === municipioSlugValue,
  );
}

export function getSedesByTipo(tipo: TipoSede): Sede[] {
  return SEDES.filter((sede) => sede.tipo === tipo);
}

export function getNearbySedes(sede: Sede, limit = 6): Sede[] {
  const sameMunicipio = SEDES.filter(
    (other) => other.id !== sede.id && other.municipioPath === sede.municipioPath,
  );
  if (sameMunicipio.length >= limit) return sameMunicipio.slice(0, limit);
  const seen = new Set(sameMunicipio.map((item) => item.id));
  const sameEstado = SEDES.filter(
    (other) => other.id !== sede.id && other.estadoSlug === sede.estadoSlug && !seen.has(other.id),
  );
  return [...sameMunicipio, ...sameEstado].slice(0, limit);
}

let estadoHubsCache: EstadoHub[] | null = null;
let municipioHubsCache: MunicipioHub[] | null = null;

export function getEstadoHubs(): EstadoHub[] {
  if (estadoHubsCache) return estadoHubsCache;

  const grouped = new Map<string, Sede[]>();
  for (const sede of SEDES) {
    const list = grouped.get(sede.estadoSlug) ?? [];
    list.push(sede);
    grouped.set(sede.estadoSlug, list);
  }

  const hubs: EstadoHub[] = [];
  for (const [slug, list] of grouped) {
    const first = list[0];
    const tipos = countTipos(list);
    const municipios = new Set(list.map((sede) => sede.municipioSlug));
    hubs.push({
      nombre: first.estado,
      display: first.estadoDisplay,
      oficial: first.estadoOficial,
      slug,
      path: first.estadoPath,
      count: list.length,
      ...tipos,
      municipios: municipios.size,
    });
  }

  estadoHubsCache = hubs.sort((a, b) => a.display.localeCompare(b.display, "es"));
  return estadoHubsCache;
}

export function getEstadoHub(slug: string): EstadoHub | undefined {
  return getEstadoHubs().find((hub) => hub.slug === slug);
}

export function getMunicipioHubs(estadoSlugValue?: string): MunicipioHub[] {
  if (!municipioHubsCache) {
    const grouped = new Map<string, Sede[]>();
    for (const sede of SEDES) {
      const key = `${sede.estadoSlug}/${sede.municipioSlug}`;
      const list = grouped.get(key) ?? [];
      list.push(sede);
      grouped.set(key, list);
    }

    const hubs: MunicipioHub[] = [];
    for (const list of grouped.values()) {
      const first = list[0];
      const tipos = countTipos(list);
      hubs.push({
        nombre: first.municipio,
        display: first.municipioDisplay,
        slug: first.municipioSlug,
        path: first.municipioPath,
        estado: first.estado,
        estadoSlug: first.estadoSlug,
        estadoDisplay: first.estadoDisplay,
        count: list.length,
        ...tipos,
      });
    }
    municipioHubsCache = hubs.sort((a, b) => a.display.localeCompare(b.display, "es"));
  }

  if (estadoSlugValue) {
    return municipioHubsCache.filter((hub) => hub.estadoSlug === estadoSlugValue);
  }
  return municipioHubsCache;
}

export function getStats() {
  const tipos = countTipos(SEDES);
  return {
    sedes: SEDES.length,
    estados: getEstadoHubs().length,
    municipios: getMunicipioHubs().length,
    ...tipos,
  };
}

export function getSearchIndex(): SearchHit[] {
  return SEDES.map((sede) => ({
    slug: sede.slug,
    path: sede.path,
    nombre: sede.nombreDisplay,
    tipo: sede.tipo,
    municipio: sede.municipioDisplay,
    estado: sede.estadoDisplay,
    estadoSlug: sede.estadoSlug,
    municipioSlug: sede.municipioSlug,
    direccion: sede.direccionLimpia.streetAddress,
    direccionOriginal: sede.direccionOriginal,
    cp: sede.cp,
  }));
}

export function resolveEstadoParam(slug: string): string | undefined {
  return estadoFromSlug(slug);
}

export { countTipos };
