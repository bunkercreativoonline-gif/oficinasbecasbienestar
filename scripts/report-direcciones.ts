import rawSedes from "../src/data/sedes.json";
import { limpiarDireccion } from "../src/lib/direccion";
import { sedeH1, municipioH1 } from "../src/lib/seo";
import type { Sede } from "../src/lib/sedes";

const sedes = rawSedes as Array<{
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  asentamiento: string;
  localidad: string;
  municipio: string;
  estado: string;
  cp: number | string;
}>;

const cleaned = sedes.map((sede) => ({
  sede,
  limpia: limpiarDireccion(sede),
}));

const ok = cleaned.filter((item) => item.limpia.estadoLimpieza === "OK");
const revisar = cleaned.filter((item) => item.limpia.estadoLimpieza === "REVISAR");
const motivos = new Map<string, number>();
for (const item of revisar) {
  for (const motivo of item.limpia.motivoRevision.split("; ")) {
    motivos.set(motivo, (motivos.get(motivo) ?? 0) + 1);
  }
}

function assertEqual(label: string, actual: string, expected: string) {
  if (actual !== expected) {
    console.error(`FAIL ${label}\n  actual:   ${actual}\n  expected: ${expected}`);
    process.exitCode = 1;
  } else {
    console.log(`OK ${label}`);
  }
}

const rayo = cleaned.find((item) => item.sede.direccion.startsWith("HERMANOS RAYON MZ C 7"));
if (!rayo) {
  console.error("No se encontró el ejemplo Hermanos Rayón");
  process.exitCode = 1;
} else {
  assertEqual(
    "bloque Rayón",
    rayo.limpia.lineas.join("\n"),
    [
      "Hermanos Rayón Mz. C Lt. 7",
      "Col. Ermita Zaragoza, C.P. 09180",
      "Alcaldía Iztapalapa, Ciudad de México",
      "Referencia: La Colmena",
    ].join("\n"),
  );
  assertEqual(
    "línea Rayón",
    rayo.limpia.unaLinea,
    "Hermanos Rayón Mz. C Lt. 7, Col. Ermita Zaragoza, 09180 Iztapalapa, CDMX",
  );
  assertEqual(
    "schema Rayón",
    JSON.stringify({
      streetAddress: rayo.limpia.streetAddress,
      postalCode: rayo.limpia.postalCode,
      addressLocality: rayo.limpia.addressLocality,
      addressRegion: rayo.limpia.addressRegion,
    }),
    JSON.stringify({
      streetAddress: "Hermanos Rayón Mz. C Lt. 7, Col. Ermita Zaragoza",
      postalCode: "09180",
      addressLocality: "Iztapalapa",
      addressRegion: "Ciudad de México",
    }),
  );
  assertEqual("estado Rayón", rayo.limpia.estadoLimpieza, "REVISAR");
  assertEqual(
    "motivo Rayón",
    rayo.limpia.motivoRevision,
    `"La Colmena" podría ser colonia o referencia; confirmar que 7 es el lote`,
  );
}

const virrey = cleaned.find((item) => item.sede.id === 308);
if (virrey) {
  assertEqual(
    "bloque Virrey",
    virrey.limpia.lineas.join("\n"),
    ["Virrey de Mendoza 218", "Col. La Estación, C.P. 20259", "Aguascalientes, Aguascalientes"].join(
      "\n",
    ),
  );
  assertEqual("estado Virrey", virrey.limpia.estadoLimpieza, "OK");
}

assertEqual(
  "H1 municipio",
  municipioH1("Tampico"),
  "Oficinas de Becas para el Bienestar Benito Juárez en Tampico",
);
assertEqual(
  "H1 Tampico",
  sedeH1({
    nombreDisplay: "2806062 - OFICINA DE BIENESTAR -  TAMPICO",
    tipoShort: "CABB",
    municipioDisplay: "Tampico",
  } as Sede),
  "Oficina de Becas Bienestar - 2806062 - Tampico",
);
assertEqual(
  "H1 ORE",
  sedeH1({
    nombreDisplay: "REPRESENTACIÓN ESTATAL DE LA COORDINACIÓN NACIONAL",
    tipoShort: "ORE",
    municipioDisplay: "Aguascalientes",
  } as Sede),
  "Oficina de Becas Bienestar - ORE - Aguascalientes",
);
assertEqual(
  "H1 CCT",
  sedeH1({
    nombreDisplay: "09DIT0005O -  INSTITUTO TECNOLÓGICO DE IZTAPALAPA II",
    tipoShort: "CABB",
    municipioDisplay: "Iztapalapa",
  } as Sede),
  "Oficina de Becas Bienestar - 09DIT0005O - Iztapalapa",
);

console.log(`\nSedes: ${cleaned.length}`);
console.log(`OK: ${ok.length}`);
console.log(`REVISAR: ${revisar.length}`);
console.log("\nMotivos:");
for (const [motivo, count] of [...motivos.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${count}\t${motivo}`);
}

console.log("\n--- ejemplos OK ---");
for (const item of ok.slice(0, 5)) {
  console.log(`\n# ${item.sede.id} ${item.sede.municipio}`);
  console.log(item.sede.direccion);
  console.log("---");
  console.log(item.limpia.lineas.join("\n"));
  console.log(item.limpia.unaLinea);
}

console.log("\n--- ejemplos REVISAR ---");
for (const item of revisar.slice(0, 12)) {
  console.log(`\n# ${item.sede.id} ${item.sede.municipio} | ${item.limpia.motivoRevision}`);
  console.log(item.sede.direccion);
  console.log("---");
  console.log(item.limpia.lineas.join("\n"));
}

const vacias = cleaned.filter((item) => !item.limpia.calleNumero || item.limpia.calleNumero === "S/N");
console.log(`\nSin calle: ${vacias.length}`);
for (const item of vacias.slice(0, 8)) {
  console.log(item.sede.id, item.sede.direccion.slice(0, 140), "=>", item.limpia.calleNumero);
}
