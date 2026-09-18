import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./site";
import type { Sede } from "./sedes";
import { truncate } from "./format";
import { TIPO_META } from "./tipos";

export function canonical(path: string): string {
  const normalized = path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (normalized.endsWith("/")) return normalized;
  return `${normalized}/`;
}

export function homeTitle(): string {
  return "Oficinas de Becas Bienestar Benito Juárez | Directorio de sedes de atención";
}

export function homeDescription(stats: {
  sedes: number;
  estados: number;
  cabb: number;
  sare: number;
  ore: number;
}): string {
  return truncate(
    `Encuentra las ${stats.sedes} sedes de atención de Becas para el Bienestar Benito Juárez en México: ${stats.cabb} CABB, ${stats.sare} SARE y ${stats.ore} ORE en ${stats.estados} estados. Direcciones, teléfonos y mapas.`,
  );
}

export function estadoTitle(display: string, count: number): string {
  return `Sedes de Becas Bienestar en ${display} (${count} oficinas)`;
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
  return truncate(
    `Consulta las ${input.count} sedes de atención de Becas Benito Juárez en ${input.display}${oficial}: ${input.cabb} CABB, ${input.sare} SARE y ${input.ore} ORE en ${input.municipios} municipios. Dirección, contacto y mapa.`,
  );
}

export function municipioTitle(municipio: string, estado: string, count: number): string {
  const n = count === 1 ? "oficina" : "oficinas";
  return `Becas Bienestar en ${municipio}, ${estado} (${count} ${n})`;
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
  const n = input.count === 1 ? "sede" : "sedes";
  return truncate(
    `Ubicación de ${input.count} ${n} de atención de Becas para el Bienestar Benito Juárez en ${input.municipio}, ${input.estado}.${mix} Verifica datos en el buscador oficial antes de acudir.`,
  );
}

export function sedeTitle(sede: Sede): string {
  return `${sede.nombreDisplay} | ${sede.municipioDisplay}, ${sede.estadoDisplay}`;
}

export function sedeDescription(sede: Sede): string {
  const contact = sede.telefonos.length
    ? ` Tel. ${sede.telefonos[0]}.`
    : sede.correos.length
      ? ` Correo ${sede.correos[0]}.`
      : "";
  return truncate(
    `${sede.tipoLabel} (${sede.tipo}) de Becas Bienestar Benito Juárez en ${sede.asentamientoDisplay}, ${sede.municipioDisplay}, ${sede.estadoDisplay}. Dirección: ${sede.direccion}. C.P. ${sede.cp}.${contact}`,
  );
}

export function tipoTitle(tipo: keyof typeof TIPO_META, count: number): string {
  const meta = TIPO_META[tipo];
  return `Sedes ${meta.short} de Becas Bienestar en México (${count})`;
}

export function tipoDescription(tipo: keyof typeof TIPO_META, count: number): string {
  const meta = TIPO_META[tipo];
  return truncate(
    `Directorio de ${count} ${meta.label} (${meta.short}) de Becas para el Bienestar Benito Juárez en México. ${meta.descripcion} Direcciones, municipios y mapas.`,
  );
}

export function buscarTitle(): string {
  return "Buscar sedes de atención | Oficinas Becas Bienestar";
}

export function buscarDescription(): string {
  return "Filtra las 711 sedes de atención de Becas Bienestar Benito Juárez por estado, municipio, tipo de oficina (CABB, SARE u ORE) o palabra clave.";
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    inLanguage: "es-MX",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-MX",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/buscar/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

export function sedeJsonLd(sede: Sede) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["GovernmentOffice", "LocalBusiness"],
    "@id": canonical(sede.path),
    name: sede.nombreDisplay,
    alternateName: `${sede.tipoShort} ${sede.municipioDisplay}`,
    description: sedeDescription(sede),
    url: canonical(sede.path),
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.direccion,
      addressLocality: sede.municipioDisplay,
      addressRegion: sede.estadoDisplay,
      postalCode: sede.cp,
      addressCountry: "MX",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${sede.municipioDisplay}, ${sede.estadoDisplay}`,
    },
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "Coordinación Nacional de Becas para el Bienestar Benito Juárez",
      url: "https://www.gob.mx/becasbenitojuarez",
    },
  };

  if (sede.lat !== null && sede.lng !== null) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: sede.lat,
      longitude: sede.lng,
    };
    data.hasMap = `https://www.google.com/maps/search/?api=1&query=${sede.lat},${sede.lng}`;
  }

  if (sede.telefonos.length) {
    data.telephone = sede.telefonos.map((phone) => {
      const digits = phone.replace(/\D+/g, "");
      return digits.length === 10 ? `+52${digits}` : phone;
    });
  }

  if (sede.correos.length) {
    data.email = sede.correos.length === 1 ? sede.correos[0] : sede.correos;
  }

  return data;
}

export function itemListJsonLd(
  name: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: canonical(path),
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: canonical(item.path),
    })),
  };
}
