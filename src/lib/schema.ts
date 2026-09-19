import {
  SITE_NAME,
  SITE_NAME_SHORT,
  SITE_TAGLINE,
  SITE_URL,
  assetUrl,
} from "./site";
import type { Sede } from "./sedes";
import { sedeDescription } from "./seo";

export {
  blogIndexDescription,
  blogIndexH1,
  blogIndexTitle,
  blogPostDescription,
  blogPostH1,
  blogPostTitle,
  buscarDescription,
  buscarH1,
  buscarTitle,
  estadoDescription,
  estadoH1,
  estadoListName,
  estadoTitle,
  homeDescription,
  homeH1,
  homeTitle,
  municipioDescription,
  municipioH1,
  municipioListName,
  municipioTitle,
  notFoundDescription,
  notFoundH1,
  notFoundTitle,
  sedeDescription,
  sedeH1,
  sedeTitle,
  tipoDescription,
  tipoH1,
  tipoTitle,
} from "./seo";

export function canonical(path: string): string {
  const normalized = path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (normalized.endsWith("/")) return normalized;
  return `${normalized}/`;
}

/** Organización del directorio (sitio independiente, no gobierno). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: [SITE_NAME_SHORT, "Directorio de Oficinas Becas Bienestar"],
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
    alternateName: SITE_NAME_SHORT,
    url: SITE_URL,
    description: SITE_TAGLINE,
    inLanguage: "es-MX",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
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

/** Ficha informativa de una sede listada; no afirma que este sitio sea oficial. */
export function sedeJsonLd(sede: Sede) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": canonical(sede.path),
    name: sede.nombreDisplay,
    alternateName: `${sede.tipoShort} ${sede.municipioDisplay}, ${sede.estadoDisplay}`,
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

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    inLanguage: "es-MX",
    mainEntityOfPage: canonical(input.path),
    url: canonical(input.path),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (input.image) {
    const image: Record<string, unknown> = {
      "@type": "ImageObject",
      url: assetUrl(input.image),
    };
    if (input.imageWidth) image.width = input.imageWidth;
    if (input.imageHeight) image.height = input.imageHeight;
    data.image = image;
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
