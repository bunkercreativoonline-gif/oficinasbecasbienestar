import { estadoDisplay, titleCaseEs } from "./slug";

export type EstadoLimpieza = "OK" | "REVISAR";
export type EtiquetaColonia = "Col." | "Fracc." | "Barrio" | "U.H.";

export interface DireccionInput {
  direccion: string;
  asentamiento: string;
  localidad: string;
  municipio: string;
  estado: string;
  cp: string | number;
}

/** Dirección limpia de una sede. `direccionOriginal` conserva el texto fuente. */
export interface DireccionLimpia {
  direccionOriginal: string;
  calleNumero: string;
  colonia: string;
  etiquetaColonia: EtiquetaColonia;
  coloniaMostrada: string;
  coloniaLinea: string;
  lugarLinea: string;
  referencia: string;
  lineas: string[];
  unaLinea: string;
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressRegion: string;
  estadoLimpieza: EstadoLimpieza;
  motivoRevision: string;
}

const SMALL = new Set(["de", "del", "la", "las", "los", "el", "y", "e", "en", "a", "con", "por"]);

/** Acentos inequívocos de la especificación. Rioverde se deja sin acento. */
const ACCENT: Record<string, string> = {
  juarez: "Juárez",
  rayon: "Rayón",
  cardenas: "Cárdenas",
  obregon: "Obregón",
  alvaro: "Álvaro",
  jose: "José",
  maria: "María",
  jesus: "Jesús",
  martin: "Martín",
  ramon: "Ramón",
  nezahualcoyotl: "Nezahualcóyotl",
  cuauhtemoc: "Cuauhtémoc",
  revolucion: "Revolución",
  constitucion: "Constitución",
  educacion: "Educación",
  heroes: "Héroes",
  martires: "Mártires",
  ejercito: "Ejército",
  publica: "Pública",
  publico: "Público",
  jardin: "Jardín",
  rio: "Río",
  seccion: "Sección",
  civica: "Cívica",
  zuniga: "Zúñiga",
  tehuacan: "Tehuacán",
  teziutlan: "Teziutlán",
  acatlan: "Acatlán",
  minatitlan: "Minatitlán",
  panuco: "Pánuco",
  escarcega: "Escárcega",
  zitacuaro: "Zitácuaro",
  maravatio: "Maravatío",
  tlaltizapan: "Tlaltizapán",
  tepatitlan: "Tepatitlán",
  tonala: "Tonalá",
  tecoman: "Tecomán",
  culiacan: "Culiacán",
  mazatlan: "Mazatlán",
  merida: "Mérida",
  leon: "León",
  queretaro: "Querétaro",
  michoacan: "Michoacán",
  yucatan: "Yucatán",
  potosi: "Potosí",
  tlahuac: "Tláhuac",
  coyoacan: "Coyoacán",
  mexico: "México",
  perez: "Pérez",
  gonzalez: "González",
  hernandez: "Hernández",
  martinez: "Martínez",
  ramirez: "Ramírez",
  sanchez: "Sánchez",
  gomez: "Gómez",
  diaz: "Díaz",
  rodriguez: "Rodríguez",
  lopez: "López",
  garcia: "García",
  fernandez: "Fernández",
  alvarez: "Álvarez",
  jimenez: "Jiménez",
  gutierrez: "Gutiérrez",
  dominguez: "Domínguez",
  vazquez: "Vázquez",
  suarez: "Suárez",
  nunez: "Núñez",
  rioverde: "Rioverde",
};

const TOKEN_ABBREV: Record<string, string> = {
  AV: "Av.",
  AVE: "Av.",
  AVENIDA: "Av.",
  BLVD: "Blvd.",
  BOULEVARD: "Blvd.",
  BULEVAR: "Blvd.",
  CALZ: "Calz.",
  CALZADA: "Calz.",
  CARR: "Carr.",
  CARRETERA: "Carr.",
  PRIV: "Priv.",
  PRIVADA: "Priv.",
  PROL: "Prol.",
  PROLONGACION: "Prol.",
  AND: "And.",
  ANDADOR: "And.",
  CDA: "Cda.",
  CERRADA: "Cda.",
  FRACC: "Fracc.",
  FRACCIONAMIENTO: "Fracc.",
  INT: "Int.",
  INTERIOR: "Int.",
  ESQ: "esq.",
  ESQU: "esq.",
  ESQUINA: "esq.",
  KM: "Km",
  KILOMETRO: "Km",
  KILOMETROS: "Km",
  BO: "Barrio",
  UH: "U.H.",
};

const KEEP = new Set([
  "Av.",
  "Blvd.",
  "Calz.",
  "Carr.",
  "Priv.",
  "Prol.",
  "And.",
  "Cda.",
  "Fracc.",
  "Int.",
  "Km",
  "U.H.",
  "esq.",
  "Barrio",
  "S/N",
  "Col.",
  "Mz.",
  "Lt.",
]);

/** Abreviatura solo en la línea única. El resto conserva el nombre de estado. */
const LINEA_ABREV: Record<string, string> = {
  "CIUDAD DE MÉXICO": "CDMX",
  MÉXICO: "Edomex",
  "NUEVO LEÓN": "NL",
  "SAN LUIS POTOSÍ": "SLP",
  "BAJA CALIFORNIA": "BC",
  "BAJA CALIFORNIA SUR": "BCS",
  QUERÉTARO: "Qro.",
  "MICHOACÁN DE OCAMPO": "Mich.",
  "VERACRUZ DE IGNACIO DE LA LLAVE": "Ver.",
  JALISCO: "Jal.",
  TAMAULIPAS: "Tamps.",
};

const STATE_ABBREV_TO_KEY: Record<string, string> = {
  CDMX: "CIUDAD DE MÉXICO",
  DF: "CIUDAD DE MÉXICO",
  EDOMEX: "MÉXICO",
  NL: "NUEVO LEÓN",
  SLP: "SAN LUIS POTOSÍ",
  BC: "BAJA CALIFORNIA",
  BCS: "BAJA CALIFORNIA SUR",
  QRO: "QUERÉTARO",
  MICH: "MICHOACÁN DE OCAMPO",
  VER: "VERACRUZ DE IGNACIO DE LA LLAVE",
  JAL: "JALISCO",
  TAMPS: "TAMAULIPAS",
  TAM: "TAMAULIPAS",
  CHIS: "CHIAPAS",
  OAX: "OAXACA",
  GRO: "GUERRERO",
  PUE: "PUEBLA",
  HGO: "HIDALGO",
  MOR: "MORELOS",
  COAH: "COAHUILA DE ZARAGOZA",
  SIN: "SINALOA",
  SON: "SONORA",
  CHIH: "CHIHUAHUA",
  DGO: "DURANGO",
  GTO: "GUANAJUATO",
  NAY: "NAYARIT",
  TAB: "TABASCO",
  TLAX: "TLAXCALA",
  YUC: "YUCATÁN",
  ZAC: "ZACATECAS",
  CAMP: "CAMPECHE",
  COL: "COLIMA",
  AGS: "AGUASCALIENTES",
  QROO: "QUINTANA ROO",
  QR: "QUINTANA ROO",
};

const REF_SPLIT =
  /\b(?:ENTRE|FRENTE(?:\s+A(?:L)?)?|DENTRO\s+DE|A\s+UN\s+(?:LADO|COSTADO)(?:\s+DE(?:L)?)?|ATR[AÁ]S\s+DE(?:L)?|A\s+ESPALDAS\s+DE(?:L)?|REFERENCIA\s*:)\b/i;

const ESQ_SPLIT = /\b(?:EN\s+ESQUINA|ESQUINA|ESQU\.?|ESQ\.?)(?:\s+CON)?\b/i;

const KM_RE = /\b(?:KM|K\.M\.|KILOMETROS?|KIL[OÓ]METROS?)\.?\s*(\d+(?:\.\d+)?)\b/i;

const COL_RE =
  /\b(COLONIA|COL\.|COL(?=\s)|FRACCIONAMIENTO|FRACC\.?|BARRIO|UNIDAD HABITACIONAL|U\.\s*H\.?)\s*(.+)$/i;

const MZ_LT =
  /\b(?:MZ|MZA|MANZANA)\.?\s+([A-Z0-9]{1,4})\s+(?:LT|LOTE)\.?\s+(\d+[A-Z]?)\b/i;
const MZ_AMBIG = /\b(?:MZ|MZA|MANZANA)\.?\s+([A-Z0-9]{1,4})\s+(\d+[A-Z]?)\b/i;
const MZ_ONLY = /\b(?:MZ|MZA|MANZANA)\.?\s+([A-Z0-9]{1,4})\b/i;
const LT_ONLY = /\b(?:LT|LOTE)\.?\s+(\d+[A-Z]?)\b/i;

const SIN_NUMERO =
  /^(?:S\/?\s*N|SN|SIN\s+N[UÚ]MERO|0+|N\/T|N\/A|N\.?\s*A\.?|#|S\.?\s*N\.?)$/i;

interface NumeroCampo {
  exterior: string | null;
  interior: string | null;
  manzana: string | null;
  lote: string | null;
  loteAmbiguo: boolean;
  referencias: string[];
  noClaro: boolean;
}

interface CalleExtra {
  street: string;
  exterior: string | null;
  manzana: string | null;
  lote: string | null;
  loteAmbiguo: boolean;
  km: string | null;
  esquina: string | null;
  coloniaEtiqueta: EtiquetaColonia | null;
  coloniaNombre: string | null;
  coloniaContradice: boolean;
  referencias: string[];
  ambiguos: string[];
}

function normKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function accentKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function isRoman(value: string): boolean {
  return /^(?:II|III|IV|VI|VII|VIII|IX|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI|XXII|XXIII|XXIV|XXV)$/i.test(
    value,
  );
}

function splitPunct(token: string): [string, string, string] {
  const match = token.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
  if (!match) return ["", token, ""];
  return [match[1], match[2], match[3]];
}

function titleCore(core: string, index: number): string {
  if (!core) return core;
  if (/^\d+$/.test(core)) return core;
  if (/^\d+-[a-zA-Z]$/.test(core)) {
    const [num, letter] = core.split("-");
    return `${num}-${letter.toUpperCase()}`;
  }
  if (isRoman(core)) return core.toUpperCase();
  const key = accentKey(core);
  if (index > 0 && SMALL.has(key)) return key;
  if (/^[\p{L}]$/u.test(core)) return core.toUpperCase();
  if (ACCENT[key]) return ACCENT[key];
  return core.charAt(0).toLocaleUpperCase("es-MX") + core.slice(1).toLocaleLowerCase("es-MX");
}

function titleToken(token: string, index: number): string {
  if (KEEP.has(token)) return token;
  if (token.includes("-")) {
    return token
      .split("-")
      .map((part, partIndex) => titleToken(part, index + partIndex))
      .join("-");
  }
  const [pre, core, post] = splitPunct(token);
  if (!core) return token;
  return `${pre}${titleCore(core, index)}${post}`;
}

function titleCaseAddress(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((token, index) => titleToken(token, index))
    .join(" ");
}

function titlePlace(value: string): string {
  return titleCaseEs(value)
    .split("-")
    .map((part, index) => {
      if (index === 0) return part;
      return part.charAt(0).toLocaleUpperCase("es-MX") + part.slice(1);
    })
    .join("-");
}

function applyAbbrevs(input: string): string {
  let text = input.replace(/\s+/g, " ").trim();
  text = text.replace(/\bU\.\s*H\.\b/gi, "U.H.");
  text = text.replace(/\bUNIDAD HABITACIONAL\b/gi, "U.H.");
  text = text.replace(/\bN\.\s*E\.\b/gi, " ");
  text = text.replace(/\bN\.\s*I\.\b/gi, " ");
  text = text.replace(/\bA\.\s*H\.\b/gi, " ");
  text = text.replace(/\bC\.\s*P\.\b/gi, " ");
  text = text.replace(/\bK\.\s*M\.\b/gi, "Km");
  text = text
    .split(" ")
    .map((token) => {
      const [, core] = splitPunct(token);
      const lookup = accentKey(core).toUpperCase().replace(/\./g, "");
      return TOKEN_ABBREV[lookup] ?? token;
    })
    .join(" ");
  text = text.replace(/\b(?:NO|NUM)\.?\s+(?=\d)/gi, "");
  text = text.replace(/(?:#|N[°º])\s*(?=\d)/g, "");
  return text.replace(/\s+/g, " ").trim();
}

export function formatLibre(input: string): string {
  let text = input.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  text = text.replace(/[.,;\s]+$/g, "").replace(/^[.,;\s]+/g, "");
  text = text.replace(/-\./g, "-").replace(/\.-/g, "-");
  text = text.replace(/\bS\s*\/\s*N\b/gi, " ").replace(/\bSN\b/gi, " ");
  text = applyAbbrevs(text);
  text = titleCaseAddress(text);
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,{2,}/g, ",")
    .replace(/^[,\s]+|[,\s]+$/g, "")
    .trim();
}

function padPostal(cp: string | number): { postalCode: string; faltante: boolean } {
  const digits = String(cp ?? "").replace(/\D/g, "");
  if (digits.length === 5) return { postalCode: digits, faltante: false };
  if (digits.length === 4) return { postalCode: digits.padStart(5, "0"), faltante: false };
  return { postalCode: "", faltante: true };
}

function cpIgual(a: string, b: string): boolean {
  const norm = (value: string) => (value.length === 4 ? value.padStart(5, "0") : value);
  return norm(a) === norm(b);
}

function isSinNumero(value: string): boolean {
  return SIN_NUMERO.test(value.trim());
}

function formatCodigo(value: string): string {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  return trimmed.toUpperCase();
}

function formatExterior(value: string): string {
  return value.trim().replace(/\s*-\s*/g, "-").replace(/\s+/g, " ").toUpperCase();
}

function coloniaComparable(value: string): string {
  return normKey(value)
    .replace(/\b(COLONIA|COL|FRACCIONAMIENTO|FRACC|BARRIO|UNIDAD HABITACIONAL|U H|RESIDENCIAL)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mismaColonia(a: string, b: string): boolean {
  const left = coloniaComparable(a);
  const right = coloniaComparable(b);
  return Boolean(left) && left === right;
}

function etiquetaDe(label: string, name: string): EtiquetaColonia {
  const blob = normKey(`${label} ${name}`);
  if (/\bU H\b/.test(blob) || /\bUNIDAD HABITACIONAL\b/.test(blob)) return "U.H.";
  if (/\bFRACC\b/.test(blob) || /\bFRACCIONAMIENTO\b/.test(blob)) return "Fracc.";
  if (/\bBARRIO\b/.test(blob)) return "Barrio";
  return "Col.";
}

function etiquetaAsentamiento(nombre: string): EtiquetaColonia | null {
  const key = normKey(nombre);
  if (/\bU H\b/.test(key) || /\bUNIDAD HABITACIONAL\b/.test(key)) return "U.H.";
  if (/\bFRACC\b/.test(key) || /\bFRACCIONAMIENTO\b/.test(key)) return "Fracc.";
  if (/\bBARRIO\b/.test(key)) return "Barrio";
  return null;
}

function formatColonia(nombre: string, etiqueta: EtiquetaColonia): string {
  const titled = titleCaseEs(nombre);
  const key = normKey(titled);
  if (etiqueta === "Barrio" && key.includes("BARRIO")) return titled;
  if (etiqueta === "Fracc." && (key.includes("FRACC") || key.includes("FRACCIONAMIENTO"))) {
    return titled.replace(/^Fracc(?:ionamiento)?\.?\s+/i, "Fracc. ");
  }
  if (etiqueta === "U.H." && (key.startsWith("U H") || key.includes("UNIDAD HABITACIONAL"))) {
    return titled.replace(/^(?:U\.?\s*H\.?|Unidad Habitacional)\s+/i, "U.H. ");
  }
  if (etiqueta === "Col." && (key.startsWith("COLONIA") || key.startsWith("COL "))) {
    return `Col. ${titled.replace(/^(?:Colonia|Col\.?)\s+/i, "")}`;
  }
  return `${etiqueta} ${titled}`;
}

function takeManzanaLote(input: string): {
  text: string;
  manzana: string | null;
  lote: string | null;
  loteAmbiguo: boolean;
} {
  let text = input;
  let manzana: string | null = null;
  let lote: string | null = null;
  let loteAmbiguo = false;

  const withLote = text.match(MZ_LT);
  if (withLote) {
    manzana = withLote[1];
    lote = withLote[2];
    text = text.replace(withLote[0], " ");
  } else {
    const ambiguo = text.match(MZ_AMBIG);
    if (ambiguo) {
      manzana = ambiguo[1];
      lote = ambiguo[2];
      loteAmbiguo = true;
      text = text.replace(ambiguo[0], " ");
    } else {
      const only = text.match(MZ_ONLY);
      if (only) {
        manzana = only[1];
        text = text.replace(only[0], " ");
      }
    }
  }

  const loteOnly = text.match(LT_ONLY);
  if (loteOnly) {
    if (lote && formatCodigo(lote) !== formatCodigo(loteOnly[1])) {
      loteAmbiguo = true;
    }
    lote = lote ?? loteOnly[1];
    text = text.replace(loteOnly[0], " ");
  }

  return {
    text: text.replace(/\s+/g, " ").trim(),
    manzana,
    lote,
    loteAmbiguo,
  };
}

function takeColonia(input: string): { text: string; etiqueta: EtiquetaColonia | null; nombre: string | null } {
  const match = input.match(COL_RE);
  if (!match) return { text: input, etiqueta: null, nombre: null };
  return {
    text: input.replace(match[0], " ").replace(/\s+/g, " ").trim(),
    etiqueta: etiquetaDe(match[1], match[2]),
    nombre: match[2].replace(/[.,;\s]+$/g, "").trim(),
  };
}

function takeKm(input: string): { text: string; km: string | null } {
  const match = input.match(KM_RE);
  if (!match) return { text: input, km: null };
  return {
    text: input.replace(match[0], " ").replace(/\s+/g, " ").trim(),
    km: match[1],
  };
}

function stripSinNumero(input: string): string {
  return input
    .replace(/\bSIN\s+N[UÚ]MERO\b/gi, " ")
    .replace(/\bS\s*\/\s*N\b/gi, " ")
    .replace(/\bSN\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function takeTrailingNumber(input: string): { text: string; numero: string | null } {
  const match = input.match(
    /^(.*\S)\s+(?:(?:NO|NUM)\.?\s+|(?:#|N[°º])\s*)?(\d+[A-Z]?(?:\s+[A-Z])?|\d+\s*-\s*[A-Z0-9]+)$/i,
  );
  if (!match) return { text: input, numero: null };
  return { text: match[1].trim(), numero: formatExterior(match[2]) };
}

function takeExplicitNumber(input: string): { text: string; numero: string | null } {
  const match = input.match(/\b(?:NO|NUM)\.?\s+(\d+[A-Z]?(?:\s*-\s*[A-Z0-9]+)?)\b|#\s*(\d+[A-Z]?(?:\s*-\s*[A-Z0-9]+)?)|N[°º]\s*(\d+[A-Z]?)/i);
  if (!match) return { text: input, numero: null };
  const numero = formatExterior(match[1] || match[2] || match[3]);
  return {
    text: input.replace(match[0], " ").replace(/\s+/g, " ").trim(),
    numero,
  };
}

function isReferencia(part: string): boolean {
  return (
    /^(?:ENTRE|FRENTE|DENTRO|ATR[AÁ]S|DETR[AÁ]S|A\s+UN\s+(?:LADO|COSTADO)|A\s+ESPALDAS|PALACIO|EDIFICIO|PLAZA|LOCAL\b|PISO\b|PLANTA|COMISAR[IÍ]A|AYUNTAMIENTO|REFERENCIA|INTERIOR\b|INT\.?\b|M[OÓ]DULO|INSTALACIONES|OFICINA|SEGUNDO|PRIMER|TERCER|CUARTO|ALTOS|NAVE\b|SE\s+ENCUENTRA|CERCA\s+DE|EN\s+LAS|EN\s+EL|EN\s+UN|CALLE\b|AV\.?|AVENIDA|BLVD\.?|BOULEVARD|BULEVAR|CARRETERA|CARR\.?|PRIV\.?|PRIVADA|CALLEJ[OÓ]N|CAMINO|PROL\.?|PROLONGACI[OÓ]N|ANDADOR|CERRADA|CALZADA|\d+\s*(?:ER|DO|TO|RO|°)?\s*PISO)\b/i.test(
      part.trim(),
    ) ||
    /\b(?:FRENTE\s+A|DENTRO\s+DE|A\s+UN\s+COSTADO|A\s+ESPALDAS|PLANTA\s+(?:BAJA|ALTA)|SEGUNDO\s+PISO|PRIMER\s+PISO|INTERIOR\s+DE|REFERENCIA\s*:|SE\s+ENCUENTRA|ENTRE|EDIFICIO|ENSEGUIDA|INSTALACIONES)\b/i.test(
      part,
    )
  );
}

function splitCommas(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")" && depth > 0) depth -= 1;
    if (char === "," && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function geoAlias(value: string): string {
  return normKey(value)
    .replace(/\bCDAD\b/g, "CIUDAD")
    .replace(/\bGRAL\b/g, "GENERAL")
    .replace(/\bDR\b/g, "DOCTOR")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumeroCampo(raw: string | null, rol: "exterior" | "interior"): NumeroCampo {
  const empty: NumeroCampo = {
    exterior: null,
    interior: null,
    manzana: null,
    lote: null,
    loteAmbiguo: false,
    referencias: [],
    noClaro: false,
  };
  if (!raw) return empty;
  const partes = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const result = { ...empty, referencias: [] as string[] };

  for (const parte of partes) {
    const mz = takeManzanaLote(parte);
    if (mz.manzana || mz.lote || mz.text !== parte.trim()) {
      if (mz.manzana) result.manzana = mz.manzana;
      if (mz.lote) result.lote = mz.lote;
      if (mz.loteAmbiguo) result.loteAmbiguo = true;
      if (!mz.text) continue;
    }

    const texto = (mz.manzana || mz.lote ? mz.text : parte).trim();
    if (!texto) continue;
    if (isSinNumero(texto)) continue;

    const piso = texto.match(/^(?:S\/?\s*N|SN)\s+(.+)$/i);
    if (piso) {
      result.referencias.push(piso[1]);
      continue;
    }

    const interiorEnExterior = texto.match(/^(\d+[A-Z]?(?:\s+[A-Z])?|\d+-\s*[A-Z0-9]+)\s+(?:INT\.?|INTERIOR)\s+(.+)$/i);
    if (interiorEnExterior) {
      result.exterior = formatExterior(interiorEnExterior[1]);
      result.interior = interiorEnExterior[2].trim();
      continue;
    }

    if (/^\d+[A-Z]?$/.test(texto) || /^\d+\s+[A-Z]$/.test(texto) || /^\d+\s*-\s*[A-Z0-9]+$/.test(texto)) {
      const numero = formatExterior(texto);
      if (rol === "interior" || result.exterior) result.interior = result.interior ?? numero;
      else result.exterior = numero;
      continue;
    }

    const hash = texto.match(/^[#N°º]\s*(\d+[A-Z]?(?:-[A-Z0-9]+)?)$/);
    if (hash) {
      result.exterior = formatExterior(hash[1]);
      continue;
    }

    if (/^[A-Z]$/i.test(texto) && rol === "interior") {
      result.interior = texto.toUpperCase();
      continue;
    }

    if (/PLANTA|PISO|LOCAL|ALTOS/i.test(texto)) {
      result.referencias.push(texto);
      continue;
    }

    result.noClaro = true;
    result.referencias.push(texto);
  }

  return result;
}

function parseCalle(blob: string, asentamiento: string): CalleExtra {
  let street = blob.trim();
  const referencias: string[] = [];
  const ambiguos: string[] = [];
  let coloniaEtiqueta: EtiquetaColonia | null = null;
  let coloniaNombre: string | null = null;
  let coloniaContradice = false;
  let esquina: string | null = null;

  const paren = street.match(/\(([^)]*)\)/);
  if (paren) {
    const nota = paren[1].trim();
    if (nota) referencias.push(nota);
    street = street.replace(paren[0], " ").replace(/\s+/g, " ").trim();
  }

  const refMatch = street.match(REF_SPLIT);
  if (refMatch && refMatch.index !== undefined) {
    const resto = street.slice(refMatch.index).trim();
    street = street.slice(0, refMatch.index).trim();
    const colEnRef = takeColonia(resto);
    if (colEnRef.nombre) {
      if (mismaColonia(colEnRef.nombre, asentamiento)) {
        coloniaEtiqueta = colEnRef.etiqueta;
        coloniaNombre = colEnRef.nombre;
      } else {
        coloniaContradice = true;
      }
    }
    const refLimpia = colEnRef.text.replace(/[,\s]+$/g, "").trim();
    if (refLimpia) referencias.push(refLimpia);
  }

  const esqMatch = street.match(ESQ_SPLIT);
  if (esqMatch && esqMatch.index !== undefined) {
    esquina = street.slice(esqMatch.index + esqMatch[0].length).trim();
    street = street.slice(0, esqMatch.index).trim();
  }

  const kmTake = takeKm(street);
  street = kmTake.text;
  const mzTake = takeManzanaLote(street);
  street = mzTake.text;
  const colTake = takeColonia(street);
  street = colTake.text;
  if (colTake.nombre) {
    if (mismaColonia(colTake.nombre, asentamiento)) {
      coloniaEtiqueta = colTake.etiqueta;
      coloniaNombre = colTake.nombre;
    } else {
      coloniaContradice = true;
    }
  }

  street = stripSinNumero(street);
  const explicit = takeExplicitNumber(street);
  street = explicit.text;
  const trailing = takeTrailingNumber(street);
  street = trailing.text.replace(/[,\s]+$/g, "").trim();

  return {
    street,
    exterior: explicit.numero ?? trailing.numero,
    manzana: mzTake.manzana,
    lote: mzTake.lote,
    loteAmbiguo: mzTake.loteAmbiguo,
    km: kmTake.km,
    esquina: esquina || null,
    coloniaEtiqueta,
    coloniaNombre,
    coloniaContradice,
    referencias,
    ambiguos,
  };
}

function splitSistema(direccion: string): {
  prefix: string;
  ni: string | null;
  ne: string;
  ah: string;
  tail: string[];
} {
  const text = direccion.replace(/\s+/g, " ").trim();
  const ah = text.match(/\bA\.\s*H\.\s*/i);
  const ne = text.match(/\bN\.\s*E\.\s*/i);
  const ni = text.match(/\bN\.\s*I\.\s*/i);
  if (!ah || ah.index === undefined || !ne || ne.index === undefined) {
    return { prefix: text, ni: null, ne: "", ah: "", tail: [] };
  }

  let prefixEnd = ne.index;
  let niValue: string | null = null;
  if (ni && ni.index !== undefined && ni.index < ne.index) {
    niValue = text.slice(ni.index + ni[0].length, ne.index).replace(/^[\s,]+|[\s,]+$/g, "");
    prefixEnd = ni.index;
  }

  const prefix = text.slice(0, prefixEnd).replace(/^[\s,]+|[\s,]+$/g, "");
  const neValue = text.slice(ne.index + ne[0].length, ah.index).replace(/^[\s,]+|[\s,]+$/g, "");
  const after = text.slice(ah.index + ah[0].length);
  const rawTail = after.split(",").map((part) => part.trim());
  const ahValue = rawTail.shift() ?? "";
  return { prefix, ni: niValue, ne: neValue, ah: ahValue, tail: rawTail.filter(Boolean) };
}

function motivoAmbiguo(nombres: string[]): string {
  if (nombres.length === 1) return `"${nombres[0]}" podría ser colonia o referencia`;
  if (nombres.length === 2) {
    return `"${nombres[0]}" y "${nombres[1]}" podrían ser colonia o referencia`;
  }
  const last = nombres[nombres.length - 1];
  const head = nombres
    .slice(0, -1)
    .map((nombre) => `"${nombre}"`)
    .join(", ");
  return `${head} y "${last}" podrían ser colonia o referencia`;
}

function preferir(
  primario: string | null,
  secundario: string | null,
  distintos: () => void,
): string | null {
  if (primario && secundario && formatCodigo(primario) !== formatCodigo(secundario)) {
    distintos();
    return primario;
  }
  return primario ?? secundario;
}

export function limpiarDireccion(input: DireccionInput): DireccionLimpia {
  const original = input.direccion;
  const sistema = splitSistema(original);
  const partes = splitCommas(sistema.prefix);
  const calleBlob = partes[0] ?? "";
  const extras = partes.slice(1);
  const calle = parseCalle(calleBlob, input.asentamiento);
  const ne = parseNumeroCampo(sistema.ne, "exterior");
  const ni = parseNumeroCampo(sistema.ni, "interior");

  const motivos: string[] = [];
  const referencias: string[] = [];
  const ambiguos: string[] = [];
  let coloniaContradice = calle.coloniaContradice;
  let etiquetaLibre: EtiquetaColonia | null = calle.coloniaEtiqueta;
  let km = calle.km;
  let esquina = calle.esquina;
  let loteAmbiguo = calle.loteAmbiguo || ne.loteAmbiguo || ni.loteAmbiguo;

  const postal = padPostal(input.cp);
  if (postal.faltante) motivos.push("CP faltante");

  if (sistema.ah && !mismaColonia(sistema.ah, input.asentamiento)) {
    coloniaContradice = true;
  }

  const pushRef = (texto: string) => {
    const limpio = formatLibre(texto.replace(/^\s*REFERENCIA\s*:\s*/i, ""));
    if (!limpio) return;
    if (referencias.some((item) => normKey(item) === normKey(limpio))) return;
    referencias.push(limpio);
  };

  const pushAmbiguo = (texto: string) => {
    const limpio = formatLibre(texto);
    if (!limpio) return;
    if (ambiguos.some((item) => normKey(item) === normKey(limpio))) return;
    if (normKey(limpio) === normKey(calle.street)) return;
    ambiguos.push(limpio);
  };

  for (const ref of [...calle.referencias, ...ne.referencias, ...ni.referencias]) {
    pushRef(ref);
  }

  let manzana = preferir(ne.manzana ?? ni.manzana, calle.manzana, () => {
    motivos.push("manzana contradictoria");
  });
  let lote = preferir(ne.lote ?? ni.lote, calle.lote, () => {
    motivos.push("lote contradictorio");
    loteAmbiguo = true;
  });
  if ((ne.loteAmbiguo || ni.loteAmbiguo) && (ne.lote || ni.lote)) loteAmbiguo = true;

  let numeroNoClaro = ne.noClaro;
  const exterior = preferir(ne.exterior, calle.exterior, () => {
    motivos.push("número contradictorio");
  });
  const interior = preferir(ni.interior, ne.interior, () => {
    motivos.push("número contradictorio");
  });

  const geoPropios = new Set(
    [input.localidad, input.municipio, input.estado, estadoDisplay(input.estado), input.asentamiento]
      .flatMap((value) => [normKey(value), geoAlias(value)])
      .filter(Boolean),
  );
  geoPropios.add(normKey(`ALCALDIA ${input.municipio}`));
  geoPropios.add(normKey(`ALCALDIA ${input.localidad}`));
  geoPropios.add(normKey(`DELEGACION ${input.municipio}`));
  if (normKey(input.estado) === "CIUDAD DE MEXICO") {
    geoPropios.add("CDMX");
    geoPropios.add("DISTRITO FEDERAL");
  }
  geoPropios.add("MEXICO");

  const estadoKey = normKey(input.estado);

  const clasificarGeo = (part: string): "match" | "contradict" | "no" => {
    const key = normKey(part);
    const alias = geoAlias(part);
    if (!key) return "match";
    if (geoPropios.has(key) || geoPropios.has(alias)) return "match";
    const lugar = geoAlias(input.municipio);
    const loc = geoAlias(input.localidad);
    const asentamiento = geoAlias(input.asentamiento);
    if (
      alias.length >= 6 &&
      alias !== "CENTRO" &&
      [lugar, loc, asentamiento].some(
        (place) => place.startsWith(`${alias} `) || place.endsWith(` ${alias}`),
      )
    ) {
      return "match";
    }
    const abbrev = STATE_ABBREV_TO_KEY[key.replace(/\s+/g, "")];
    if (abbrev) return normKey(abbrev) === estadoKey ? "match" : "contradict";
    const displayKey = normKey(estadoDisplay(input.estado));
    if (key === displayKey || key === estadoKey) return "match";
    return "no";
  };

  const consumirParte = (parte: string) => {
    let text = parte.trim();
    if (!text) return;

    const kmSolo = text.match(
      /^(?:KM|K\.?\s*M\.?|KILOMETROS?|KIL[OÓ]METROS?)\.?\s*(\d+(?:\.\d+)?)(?:\s+(.+))?$/i,
    );
    if (kmSolo) {
      km = km ?? kmSolo[1];
      if (kmSolo[2]?.trim()) pushRef(kmSolo[2]);
      return;
    }

    if (/^\(.*\)$/.test(text)) {
      pushRef(text.replace(/^\(|\)$/g, ""));
      return;
    }

    const parentesis = text.match(/\(([^)]*)\)/);
    if (parentesis) {
      if (parentesis[1].trim()) pushRef(parentesis[1]);
      text = text.replace(parentesis[0], " ").replace(/\s+/g, " ").trim();
      if (!text) return;
    }

    const corteRef = text.search(/\b(?:REFERENCIA\s*:|FRENTE\s+A|SE\s+ENCUENTRA)/i);
    if (corteRef > 0) {
      consumirParte(text.slice(0, corteRef));
      const resto = text.slice(corteRef).replace(/^REFERENCIA\s*:\s*/i, "");
      if (resto.trim()) pushRef(resto);
      return;
    }

    const cpEtiqueta = text.match(/\bC\.?\s*P\.?\s*(\d{4,5})\b/i);
    if (cpEtiqueta && !/^(?:C\.?\s*P\.?|\d)/i.test(text)) {
      if (postal.postalCode && !cpIgual(cpEtiqueta[1], postal.postalCode)) {
        if (!motivos.includes("CP contradictorio")) motivos.push("CP contradictorio");
      }
      text = text.replace(cpEtiqueta[0], " ").replace(/\s+/g, " ").trim();
      if (!text) return;
    }

    const cpMatch = text.match(/^(?:C\.?\s*P\.?\s*)?(\d{4,5})\s*[.,]?\s*(.*)$/i);
    if (cpMatch && /^(?:C\.?\s*P\.?|\d{4,5}\b)/i.test(text)) {
      if (postal.postalCode && !cpIgual(cpMatch[1], postal.postalCode)) {
        if (!motivos.includes("CP contradictorio")) motivos.push("CP contradictorio");
      }
      text = cpMatch[2].replace(/[.,\s]+$/g, "").trim();
      if (!text) return;
    }

    const geo = clasificarGeo(text);
    if (geo === "match") return;
    if (geo === "contradict") {
      if (!motivos.includes("estado contradictorio")) motivos.push("estado contradictorio");
      return;
    }

    const alcaldia = text.match(/^(?:ALCALD[IÍ]A|DELEGACI[OÓ]N)\s+(.+)$/i);
    if (alcaldia && clasificarGeo(alcaldia[1]) === "match") return;

    const col = takeColonia(text);
    if (col.nombre && col.text.trim() === "") {
      if (mismaColonia(col.nombre, input.asentamiento)) {
        etiquetaLibre = etiquetaLibre ?? col.etiqueta;
      } else {
        coloniaContradice = true;
      }
      return;
    }

    const mz = takeManzanaLote(text);
    if ((mz.manzana || mz.lote) && !mz.text) {
      manzana = preferir(manzana, mz.manzana, () => motivos.push("manzana contradictoria"));
      lote = preferir(lote, mz.lote, () => {
        motivos.push("lote contradictorio");
        loteAmbiguo = true;
      });
      if (mz.loteAmbiguo) loteAmbiguo = true;
      if (!km) {
        const kmParte = takeKm(text);
        if (kmParte.km) km = kmParte.km;
      }
      return;
    }

    if (ESQ_SPLIT.test(text) && text.match(ESQ_SPLIT)?.index === 0) {
      const cruz = text.replace(ESQ_SPLIT, "").trim();
      if (cruz && !esquina) esquina = cruz;
      else if (cruz) pushRef(text);
      return;
    }

    if (isReferencia(text)) {
      pushRef(text);
      return;
    }

    pushAmbiguo(text);
  };

  for (const extra of extras) consumirParte(extra);

  for (const parte of sistema.tail) {
    const geo = clasificarGeo(parte);
    if (geo === "no") {
      const alcaldia = parte.match(/^(?:ALCALD[IÍ]A|DELEGACI[OÓ]N)\s+(.+)$/i);
      if (!(alcaldia && clasificarGeo(alcaldia[1]) === "match")) {
        if (!motivos.includes("dato de ubicación contradictorio")) {
          motivos.push("dato de ubicación contradictorio");
        }
      }
    } else if (geo === "contradict") {
      if (!motivos.includes("estado contradictorio")) motivos.push("estado contradictorio");
    }
  }

  if (coloniaContradice && !motivos.includes("colonia contradictoria")) {
    motivos.push("colonia contradictoria");
  }
  if (numeroNoClaro && !motivos.includes("número exterior no claro")) {
    motivos.push("número exterior no claro");
  }

  const municipioDisplay = titlePlace(input.municipio);
  const localidadDisplay = titlePlace(input.localidad);
  const estadoNombre = estadoDisplay(input.estado);
  const etiqueta = etiquetaLibre ?? etiquetaAsentamiento(input.asentamiento) ?? "Col.";
  const coloniaMostrada = input.asentamiento.trim()
    ? formatColonia(input.asentamiento, etiqueta)
    : "";

  const calleTexto = formatLibre(calle.street);
  const bits: string[] = [];
  if (calleTexto) bits.push(calleTexto);
  if (exterior) bits.push(formatExterior(exterior));
  if (interior && !isSinNumero(interior)) bits.push(`Int. ${formatLibre(interior)}`);
  if (manzana) bits.push(`Mz. ${formatCodigo(manzana)}`);
  if (lote) bits.push(`Lt. ${formatCodigo(lote)}`);
  if (!exterior && !manzana && !lote) bits.push("S/N");
  if (km) bits.push(`Km ${km}`);
  if (esquina) bits.push(`esq. ${formatLibre(esquina)}`);
  let calleNumero = bits.join(" ").replace(/\s+/g, " ").trim();
  if (!calleTexto && !exterior && !manzana && !lote) {
    if (!motivos.includes("calle faltante")) motivos.push("calle faltante");
  }

  if (ambiguos.length) motivos.push(motivoAmbiguo(ambiguos));
  if (loteAmbiguo && lote) motivos.push(`confirmar que ${formatCodigo(lote)} es el lote`);
  if (!lote && /\bL\d+\b/i.test(calle.street)) motivos.push("lote no confirmado");

  for (const nombre of ambiguos) pushRef(nombre);

  const isCdmx = normKey(input.estado) === "CIUDAD DE MEXICO";
  const mismaLocalidad = normKey(input.localidad) === normKey(input.municipio);
  const lugarLinea = isCdmx
    ? `Alcaldía ${municipioDisplay}, ${estadoNombre}`
    : mismaLocalidad
      ? `${municipioDisplay}, ${estadoNombre}`
      : `${localidadDisplay}, ${municipioDisplay}, ${estadoNombre}`;

  const coloniaLinea = coloniaMostrada
    ? postal.postalCode
      ? `${coloniaMostrada}, C.P. ${postal.postalCode}`
      : coloniaMostrada
    : postal.postalCode
      ? `C.P. ${postal.postalCode}`
      : "";

  const referencia = referencias.join("; ");
  const lineas = [calleNumero, coloniaLinea, lugarLinea].filter(Boolean);
  if (referencia) lineas.push(`Referencia: ${referencia}`);

  const estadoCorto = LINEA_ABREV[input.estado] ?? estadoNombre;
  const unaPartes = [calleNumero];
  if (coloniaMostrada) unaPartes.push(coloniaMostrada);
  unaPartes.push(postal.postalCode ? `${postal.postalCode} ${municipioDisplay}` : municipioDisplay);
  unaPartes.push(estadoCorto);

  const streetAddress = coloniaMostrada ? `${calleNumero}, ${coloniaMostrada}` : calleNumero;
  const motivosUnicos = [...new Set(motivos.map((motivo) => motivo.trim()).filter(Boolean))];
  const fijos = [
    "colonia contradictoria",
    "CP contradictorio",
    "CP faltante",
    "número contradictorio",
    "número exterior no claro",
    "manzana contradictoria",
    "lote contradictorio",
    "estado contradictorio",
    "dato de ubicación contradictorio",
    "calle faltante",
  ];
  motivosUnicos.sort((a, b) => {
    const ia = fijos.indexOf(a);
    const ib = fijos.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return {
    direccionOriginal: original,
    calleNumero,
    colonia: titleCaseEs(input.asentamiento),
    etiquetaColonia: etiqueta,
    coloniaMostrada,
    coloniaLinea,
    lugarLinea,
    referencia,
    lineas,
    unaLinea: unaPartes.filter(Boolean).join(", "),
    streetAddress,
    postalCode: postal.postalCode,
    addressLocality: municipioDisplay,
    addressRegion: estadoNombre,
    estadoLimpieza: motivosUnicos.length ? "REVISAR" : "OK",
    motivoRevision: motivosUnicos.join("; "),
  };
}
