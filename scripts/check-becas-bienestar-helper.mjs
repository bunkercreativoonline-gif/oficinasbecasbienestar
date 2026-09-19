import {
  hasBecasBienestarOutboundLink,
  linkFirstBecasBienestar,
  BECAS_BIENESTAR_URL,
} from "../src/lib/becasBienestar.ts";

const href = `href="${BECAS_BIENESTAR_URL}"`;
const cases = [];

function assert(name, condition, detail) {
  if (!condition) {
    throw new Error(`${name}${detail ? `: ${detail}` : ""}`);
  }
}

cases.push({
  name: "wraps the first plain-text match and preserves casing",
  run() {
    const { html, linked } = linkFirstBecasBienestar(
      "Guía de Becas Bienestar y otra mención de Becas Bienestar.",
    );
    assert("linked", linked);
    assert("once", html.split(href).length === 2);
    assert("first wrap", html.includes(`<a ${href}>Becas Bienestar</a> y otra`));
  },
});

cases.push({
  name: "wraps lowercase variant",
  run() {
    const { html, linked } = linkFirstBecasBienestar("info de becas bienestar aquí");
    assert("linked", linked);
    assert("casing", html.includes(`<a ${href}>becas bienestar</a>`));
  },
});

cases.push({
  name: "skips matches already inside an anchor",
  run() {
    const input = `Lee <a href="/blog/x/">Becas Bienestar</a> en el artículo.`;
    const { html, linked } = linkFirstBecasBienestar(input);
    assert("not linked outbound", !linked);
    assert("unchanged", html === input);
  },
});

cases.push({
  name: "does not add a second link if the URL is already present",
  run() {
    const input = `Ya hay <a ${href}>Becas Bienestar</a> y otra Becas Bienestar.`;
    const { html, linked } = linkFirstBecasBienestar(input);
    assert("already linked", linked);
    assert("unchanged", html === input);
  },
});

cases.push({
  name: "does not split Oficinas Becas Bienestar branding",
  run() {
    const input = "Directorio de Oficinas Becas Bienestar en México.";
    const { html, linked } = linkFirstBecasBienestar(input);
    assert("not linked", !linked);
    assert("unchanged", html === input);
  },
});

cases.push({
  name: "does not wrap the official long program name",
  run() {
    const input = "Oficinas de Becas para el Bienestar Benito Juárez en Puebla.";
    const { html, linked } = linkFirstBecasBienestar(input);
    assert("not linked", !linked);
    assert("unchanged", html === input);
  },
});

cases.push({
  name: "detects existing outbound href",
  run() {
    assert("match", hasBecasBienestarOutboundLink(`<a ${href}>x</a>`));
    assert("no match", !hasBecasBienestarOutboundLink("<a href='/blog/x/'>Becas Bienestar</a>"));
  },
});

let failed = 0;
for (const test of cases) {
  try {
    test.run();
    console.log(`ok  ${test.name}`);
  } catch (error) {
    failed += 1;
    console.error(`fail  ${test.name}`);
    console.error(error);
  }
}

if (failed) {
  process.exit(1);
}
console.log(`\n${cases.length} helper checks passed`);
