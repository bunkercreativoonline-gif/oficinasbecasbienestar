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
    descripcion:
      "Oficinas y sedes locales de atención (centros comunitarios, módulos y oficinas de Bienestar).",
    larga:
      "Los CABB (Centros de Atención de Becas para el Bienestar) son oficinas y sedes locales —centros comunitarios, módulos de orientación, domos y oficinas de Bienestar— de las Oficinas de Becas para el Bienestar Benito Juárez donde las familias pueden recibir orientación.",
  },
  SARE: {
    slug: "sare",
    label: "Sede Auxiliar de Representación Estatal",
    short: "SARE",
    descripcion:
      "Sedes auxiliares regionales de las Oficinas de Representación Estatal (ORE).",
    larga:
      "Las SARE (Sedes Auxiliares de Representación Estatal) apoyan a las Oficinas de Becas para el Bienestar Benito Juárez en cada región. Atienden el programa en las entidades federativas y suelen concentrar más servicios que un CABB.",
  },
  ORE: {
    slug: "ore",
    label: "Oficina de Representación Estatal",
    short: "ORE",
    descripcion:
      "Oficina de Representación Estatal del programa Becas para el Bienestar Benito Juárez.",
    larga:
      "Las ORE (Oficinas de Representación Estatal) coordinan en cada entidad las Oficinas de Becas para el Bienestar Benito Juárez. Son la representación estatal de la Coordinación Nacional y articulan CABB y SARE del estado.",
  },
};

export function isTipo(value: string): value is TipoSede {
  return value === "CABB" || value === "SARE" || value === "ORE";
}

export function tipoFromSlug(slug: string): TipoSede | undefined {
  const upper = slug.toUpperCase();
  return isTipo(upper) ? upper : undefined;
}
