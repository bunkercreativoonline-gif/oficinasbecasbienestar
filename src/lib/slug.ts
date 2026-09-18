const SMALL_WORDS = new Set([
  "de",
  "del",
  "la",
  "las",
  "el",
  "los",
  "y",
  "e",
  "o",
  "u",
  "en",
  "a",
  "al",
  "para",
  "por",
  "con",
]);

/** INEGI official names → short SEO slugs. */
export const ESTADO_SLUG: Record<string, string> = {
  AGUASCALIENTES: "aguascalientes",
  "BAJA CALIFORNIA": "baja-california",
  "BAJA CALIFORNIA SUR": "baja-california-sur",
  CAMPECHE: "campeche",
  CHIAPAS: "chiapas",
  CHIHUAHUA: "chihuahua",
  "CIUDAD DE MÉXICO": "ciudad-de-mexico",
  "COAHUILA DE ZARAGOZA": "coahuila",
  COLIMA: "colima",
  DURANGO: "durango",
  GUANAJUATO: "guanajuato",
  GUERRERO: "guerrero",
  HIDALGO: "hidalgo",
  JALISCO: "jalisco",
  "MICHOACÁN DE OCAMPO": "michoacan",
  MORELOS: "morelos",
  MÉXICO: "estado-de-mexico",
  NAYARIT: "nayarit",
  "NUEVO LEÓN": "nuevo-leon",
  OAXACA: "oaxaca",
  PUEBLA: "puebla",
  QUERÉTARO: "queretaro",
  "QUINTANA ROO": "quintana-roo",
  "SAN LUIS POTOSÍ": "san-luis-potosi",
  SINALOA: "sinaloa",
  SONORA: "sonora",
  TABASCO: "tabasco",
  TAMAULIPAS: "tamaulipas",
  TLAXCALA: "tlaxcala",
  "VERACRUZ DE IGNACIO DE LA LLAVE": "veracruz",
  YUCATÁN: "yucatan",
  ZACATECAS: "zacatecas",
};

export const ESTADO_DISPLAY: Record<string, string> = {
  AGUASCALIENTES: "Aguascalientes",
  "BAJA CALIFORNIA": "Baja California",
  "BAJA CALIFORNIA SUR": "Baja California Sur",
  CAMPECHE: "Campeche",
  CHIAPAS: "Chiapas",
  CHIHUAHUA: "Chihuahua",
  "CIUDAD DE MÉXICO": "Ciudad de México",
  "COAHUILA DE ZARAGOZA": "Coahuila",
  COLIMA: "Colima",
  DURANGO: "Durango",
  GUANAJUATO: "Guanajuato",
  GUERRERO: "Guerrero",
  HIDALGO: "Hidalgo",
  JALISCO: "Jalisco",
  "MICHOACÁN DE OCAMPO": "Michoacán",
  MORELOS: "Morelos",
  MÉXICO: "Estado de México",
  NAYARIT: "Nayarit",
  "NUEVO LEÓN": "Nuevo León",
  OAXACA: "Oaxaca",
  PUEBLA: "Puebla",
  QUERÉTARO: "Querétaro",
  "QUINTANA ROO": "Quintana Roo",
  "SAN LUIS POTOSÍ": "San Luis Potosí",
  SINALOA: "Sinaloa",
  SONORA: "Sonora",
  TABASCO: "Tabasco",
  TAMAULIPAS: "Tamaulipas",
  TLAXCALA: "Tlaxcala",
  "VERACRUZ DE IGNACIO DE LA LLAVE": "Veracruz",
  YUCATÁN: "Yucatán",
  ZACATECAS: "Zacatecas",
};

export const ESTADO_OFICIAL: Record<string, string> = {
  "COAHUILA DE ZARAGOZA": "Coahuila de Zaragoza",
  "MICHOACÁN DE OCAMPO": "Michoacán de Ocampo",
  MÉXICO: "México",
  "VERACRUZ DE IGNACIO DE LA LLAVE": "Veracruz de Ignacio de la Llave",
};

const SLUG_TO_ESTADO = Object.fromEntries(
  Object.entries(ESTADO_SLUG).map(([name, slug]) => [slug, name]),
);

export function slugify(input: string): string {
  const slug = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "sede";
}

export function titleCaseEs(input: string): string {
  const words = input.trim().replace(/\s+/g, " ").toLowerCase().split(" ");
  return words
    .map((word, index) => {
      if (!word) return word;
      if (index > 0 && SMALL_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function estadoSlug(estado: string): string {
  return ESTADO_SLUG[estado] ?? slugify(estado);
}

export function estadoDisplay(estado: string): string {
  return ESTADO_DISPLAY[estado] ?? titleCaseEs(estado);
}

export function estadoOficial(estado: string): string {
  return ESTADO_OFICIAL[estado] ?? estadoDisplay(estado);
}

export function estadoFromSlug(slug: string): string | undefined {
  return SLUG_TO_ESTADO[slug];
}

export function sedeSlug(nombre: string, tipo: string, estado: string): string {
  if (tipo === "ORE") {
    return `representacion-estatal-${estadoSlug(estado)}`;
  }
  return slugify(nombre);
}
