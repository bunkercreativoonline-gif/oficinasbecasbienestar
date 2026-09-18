export type TipoSede = "CABB" | "SARE" | "ORE";

export const TIPOS: TipoSede[] = ["CABB", "SARE", "ORE"];

export const TIPO_META: Record<
  TipoSede,
  {
    slug: string;
    label: string;
    short: string;
    descripcion: string;
    larga: string;
  }
> = {
  CABB: {
    slug: "cabb",
    label: "Centro de Atención de Becas para el Bienestar",
    short: "CABB",
    descripcion: "Oficinas locales de atención (centros comunitarios, módulos y oficinas de Bienestar).",
    larga:
      "Los CABB (Centros de Atención de Becas para el Bienestar) son sedes locales —centros comunitarios, módulos de orientación, domos y oficinas de Bienestar— donde las familias pueden recibir orientación sobre las Becas Benito Juárez.",
  },
  SARE: {
    slug: "sare",
    label: "Sede Auxiliar de Representación Estatal",
    short: "SARE",
    descripcion: "Unidades regionales de apoyo de las Oficinas de Representación Estatal.",
    larga:
      "Las SARE (Sedes Auxiliares de Representación Estatal) son unidades de apoyo de las Oficinas de Representación. Atienden el programa en las regiones de cada entidad federativa y suelen concentrar más servicios que un CABB.",
  },
  ORE: {
    slug: "ore",
    label: "Oficina de Representación Estatal",
    short: "ORE",
    descripcion: "Representación estatal de la Coordinación Nacional de Becas Benito Juárez.",
    larga:
      "Las ORE (Oficinas de Representación Estatal) son las unidades administrativas de la Coordinación Nacional de Becas para el Bienestar Benito Juárez en cada entidad. Coordinan la operación del programa a nivel estatal.",
  },
};

export function isTipo(value: string): value is TipoSede {
  return value === "CABB" || value === "SARE" || value === "ORE";
}

export function tipoFromSlug(slug: string): TipoSede | undefined {
  const upper = slug.toUpperCase();
  return isTipo(upper) ? upper : undefined;
}
