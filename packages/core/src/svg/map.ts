import { SVG_DEFS } from './filters.ts';

/**
 * Map art, copied from the prototype (injected as innerHTML in every stack).
 * The ocean and graticule ship with the page; the coastline (~30 kB) is loaded on demand.
 */

/** Ocean, graticule and Greenwich arrow: first layer of the map <svg viewBox="0 0 1000 1000">. */
export const MAP_OCEAN = `<circle cx="500" cy="500" r="600" fill="#2B5276" opacity="0.18" filter="url(#bleed)"></circle>
<circle cx="500" cy="505" r="548" fill="url(#ocean)" filter="url(#wc)" opacity="0.94"></circle>
<circle cx="490" cy="490" r="470" fill="#6C98B9" opacity="0.22" filter="url(#bleed)"></circle>
<g fill="none" stroke="#DCE7EE" stroke-width="1.1" opacity="0.5" filter="url(#ink)">
<circle cx="500" cy="500" r="426" stroke-dasharray="4 7"></circle>
<circle cx="500" cy="500" r="280" stroke-dasharray="4 7"></circle>
<circle cx="500" cy="500" r="139" stroke-dasharray="4 7"></circle>
<path d="M500,500 L500,-40 M500,500 L1040,500 M500,500 L500,1040 M500,500 L-40,500 M500,500 L120,120 M500,500 L880,120 M500,500 L880,880 M500,500 L120,880"></path>
</g>
<g font-family="Caveat, cursive" font-size="17" fill="#E6EEF3" opacity="0.85">
<text x="508" y="70">0° Greenwich</text>
<text x="74" y="78" transform="rotate(-45 74 78)">60° S</text>
</g>
<path d="M500,58 L500,22 M492,34 L500,20 L508,34" stroke="#F7FAFB" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#ink)"></path>`;

/** Natural Earth coastline plus sea and region labels, drawn over MAP_OCEAN. */
export const loadMapLand = (): Promise<string> => import('./land.ts').then((m) => m.MAP_LAND);

/** Standalone SVG document of the map, with `pad` map units of margin (for rasterizing to a texture). */
export const mapSvgDocument = async (size = 2048, pad = 0) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${1000 + 2 * pad} ${1000 + 2 * pad}"><defs>${SVG_DEFS}</defs>${MAP_OCEAN}${await loadMapLand()}</svg>`;
