export function cleanNombre(nombre: string): string {
  return nombre.replace(/\s+/g, " ").replace(/\s+\.$/, "").replace(/\.$/, "").trim();
}

export function padCp(cp: number | string): string {
  return String(cp).padStart(5, "0");
}

export function parseCoord(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) && n !== 0 ? n : null;
}

export function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-") return [];
  return trimmed
    .split(/[,;|/]+/)
    .map((part) => part.trim())
    .filter((part) => part && part !== "-");
}

export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

export function formatPhone(raw: string): string {
  const digits = digitsOnly(raw);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 12 && digits.startsWith("52")) {
    return `+52 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return raw.trim();
}

export function telHref(raw: string): string {
  const digits = digitsOnly(raw);
  if (digits.length === 10) return `tel:+52${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  if (digits.length === 12 && digits.startsWith("52")) return `tel:+${digits}`;
  if (digits.length >= 8) return `tel:+52${digits}`;
  return `tel:${raw.trim()}`;
}

export function mapsSearchUrl(lat: number, lng: number, query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}&query_place_id=&q=${encodeURIComponent(query)}`;
}

export function mapsDirUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function osmEmbedUrl(lat: number, lng: number, delta = 0.012): string {
  const minLng = lng - delta;
  const minLat = lat - delta;
  const maxLng = lng + delta;
  const maxLat = lat + delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function osmViewUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

export function truncate(text: string, max = 160): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max - 1).trimEnd()}…`;
}
