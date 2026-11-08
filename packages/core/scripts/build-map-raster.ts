/**
 * Bakes the watercolor map layer (MAP_PAINT_SVG with the painted filters) into WebP at two sizes.
 * Run with `pnpm map-raster` after changing the map art or the coastline. The output is committed.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { SVG_DEFS } from '../src/svg/filters.ts';
import { MAP_RASTER_PAD, MAP_RASTER_SPAN } from '../src/svg/map.ts';
import { MAP_PAINT_SVG } from '../src/svg/paint.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '../src/assets');
const SIZES = [768, 2048, 4096];
const QUALITY = 0.82;

const executablePath = process.env.CHROMIUM_PATH ?? ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find(existsSync);
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();
mkdirSync(outDir, { recursive: true });

for (const size of SIZES) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-MAP_RASTER_PAD} ${-MAP_RASTER_PAD} ${MAP_RASTER_SPAN} ${MAP_RASTER_SPAN}"><defs>${SVG_DEFS}</defs>${MAP_PAINT_SVG}</svg>`;
  const dataUrl = await page.evaluate(async ({ svg, size, quality }) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    canvas.getContext('2d')!.drawImage(img, 0, 0, size, size);
    URL.revokeObjectURL(url);
    return canvas.toDataURL('image/webp', quality);
  }, { svg, size, quality: QUALITY });
  const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
  writeFileSync(join(outDir, `map-paint-${size}.webp`), buf);
  console.log(`map-paint-${size}.webp: ${(buf.length / 1024).toFixed(0)} kB`);
}
await browser.close();
