# Oficinas de Becas para el Bienestar Benito Juárez

Directorio estático SEO de las **711 oficinas y sedes de atención** de Becas para el Bienestar Benito Juárez en México.

Sitio: [https://oficinasbecasbienestar.com.mx](https://oficinasbecasbienestar.com.mx)

Este proyecto **no es un sitio oficial de gobierno**. Los datos se tomaron del [buscador oficial de sedes de atención](https://buscador.becasbenitojuarez.gob.mx/sedes-atencion/) y deben verificarse ahí antes de acudir.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Buscador, estadísticas y listado de estados |
| `/estado/[estado]/` | Hub estatal y municipios |
| `/estado/[estado]/[municipio]/` | Oficinas del municipio |
| `/sede/[slug]/` | Ficha de cada oficina (711) |
| `/buscar/` | Filtro en el cliente |
| `/blog/` | Índice de noticias y guías |
| `/blog/[slug]/` | Artículo (colecciones de contenido en `src/content/blog/`) |
| `/tipo/cabb/`, `/tipo/sare/`, `/tipo/ore/` | Listados por tipo de sede |
| `/robots.txt`, `/sitemap-index.xml`, `/sitemap.xml` | SEO técnico (`/sitemap.xml` es alias del índice) |
| `404` | Página no encontrada |

Tipos de sede:

- **CABB** — Centro de Atención de Becas para el Bienestar
- **SARE** — Sede Auxiliar de Representación Estatal
- **ORE** — Oficina de Representación Estatal

## Requisitos

- Node.js 20 o superior (recomendado 22)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321).

Otras tareas:

```bash
npm run build      # genera dist/
npm run preview    # sirve la carpeta dist
npm run check      # opcional, chequeo de tipos Astro
```

## Datos

La fuente de verdad es `src/data/sedes.json` (711 registros). Campos: `id`, `nombre`, `tipo`, `direccion`, `asentamiento`, `localidad`, `municipio`, `estado`, `estadoId`, `municipioId`, `cp`, `telefonos`, `correos`, `lat`, `lng`, `gps`.

Metadatos de la extracción: `src/data/meta.json`.

Para actualizar el directorio, sustituye `src/data/sedes.json` con un JSON del mismo esquema y vuelve a construir el sitio.

## Cloudflare Pages

1. Conecta este repositorio a Cloudflare Pages.
2. Configura el proyecto:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `22` (o añade `NODE_VERSION=22` en las variables de entorno)
3. Tras el primer deploy, asigna el dominio personalizado **oficinasbecasbienestar.com.mx**.
4. En el DNS del dominio apunta a Cloudflare (registros que indique Pages) y espera el certificado SSL.

El sitio es 100% estático: no hace falta adapter de servidor. `public/_headers` define cabeceras de caché y seguridad para Pages.

Canonical y sitemap usan `https://oficinasbecasbienestar.com.mx`.

## Stack

- [Astro](https://astro.build) + TypeScript
- Salida estática (`output: 'static'`)
- Colecciones de contenido (`src/content.config.ts`) y `@astrojs/mdx` para el blog
- `@astrojs/sitemap`

## Licencia de datos

Los registros provienen de un sitio gubernamental mexicano. Este directorio los republica con fines informativos y pide verificarlos en la fuente oficial.
