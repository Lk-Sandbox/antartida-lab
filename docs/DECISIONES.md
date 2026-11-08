# Decisiones y diferencias

Diferencias respecto del prototipo (`docs/handoff/design/Main.dc.html`) y entre stacks, y por qué.

## Comunes a todas las apps

### Costa de Natural Earth

- Fuente: `ne_50m_land` y `ne_50m_antarctic_ice_shelves_polys` (Natural Earth, dominio público). `packages/core/scripts/build-coastline.ts` los descarga, los proyecta con `d3-geo` y genera `packages/core/src/coastline.ts`. `d3-geo` es solo dependencia de desarrollo y no llega al cliente.
- Proyección: `geoStereographic().rotate([0, 90]).scale(1590).translate([500, 500])`. El script verifica que coincida con la fórmula del handoff (`r = 1590 · tan((90 − |lat|)/2)`) en cinco puntos, y los tests comprueban que Marambio, Ushuaia y Orcadas caen donde los pone `PTS`.
- Simplificación Douglas-Peucker con tolerancia de 0,9 unidades de mapa (≈ 13 kB gzip entre continente, barreras de hielo y Sudamérica).
- Natural Earth parte la Antártida y la barrera de Ross sobre el antimeridiano. El script descarta la costura del continente y tapa la de la barrera con un trazo del mismo color (`ICE_SHELF_SEAM`).
- Se agregan las barreras de hielo (Ross, Ronne-Filchner, etc.) con un celeste más claro que el continente. El prototipo no las distinguía.
- La silueta de Sudamérica y las tres islas dibujadas a mano del prototipo se reemplazan por las reales.
- Con la costa real, algunas etiquetas decorativas quedaban sobre tierra o tapadas. Se movieron: «Pasaje de Drake» (62,384 → 50,404), «Mar de Weddell» (330,282 → 252,258) y «Antártida Occidental» (sube 20 unidades). También se acortó un trazo de glaciar que salía del continente.
- Las tres capas del prototipo (halo `#bleed`, relleno `#wcs` y contorno `#ink`) se conservan. Los paths se definen una sola vez y se reutilizan con `<use>`.

### Peso y carga

- **El JS inicial de la referencia tiene que quedar por debajo de 80 kB gzip.** Con todo en un bundle, React superaba los 95 kB. La costa (`loadMapLand()`, ~13 kB gzip) y la expedición se cargan con `import()`: la costa al montar el mapa y la expedición al tocar Fósiles (se precarga durante la transición).
- **Sin Tailwind.** El handoff lo sugiere para el layout, pero el CSS del prototipo ya resuelve todo. Sumarlo a cinco apps solo agrega ruido al benchmark. El CSS está en `core/src/styles/` (`tokens.css`, `painted.css`, `fonts.css`).
- **Tipografías con `@fontsource`** (subconjunto latino, solo los pesos que se usan), para no depender de Google Fonts.
- **Acento fijo `#C0862F`.** La prop `accent` del prototipo es un control del canvas de diseño, no del producto.

### Correcciones al prototipo

- **Cepillado con puntero.** En el prototipo, `.ebody` (z-index 2) tapa la roca (`.dig`, z-index 1), y en navegadores reales el puntero nunca llega a la roca. Se agregó `.ebody{pointer-events:none}` y se lo devolvió (`auto`) a sus bloques de contenido.
- **Panel «Saber más» en mobile.** El bottom sheet tapaba el botón principal. Como el handoff pide que no corte el recorrido, en pantallas angostas se ubica por encima de la barra de acciones.
- **Escape cierra el panel** desde cualquier lugar de la expedición, no solo con el foco dentro. Si la tarjeta de evidencia está abierta, Escape cierra la tarjeta.
- **Foco.** Los diálogos (ficha, lista, tarjeta) devuelven el foco a su disparador al cerrarse. Si el disparador ya no existe, lo devuelven al mapa. Al cambiar de paso, el foco va al título del paso (o a la primera zona de excavación, o al botón final en el paso 5), así se puede recorrer todo con teclado.
- **Persistencia** de `explored` en `localStorage` con try/catch (`core/src/storage.ts`). Se lee después del primer render para no romper la hidratación de Astro.
- **Colisión de etiquetas** (`core/src/labels.ts`). Las etiquetas se ubican en orden. Cada una prueba su lado preferido y después el opuesto. Si no entra en ninguno, se oculta. La de la expedición disponible se muestra siempre.
- **Altura** `100dvh` además de `100vh`, para que las barras del navegador mobile no tapen los controles.
- **Favicon** SVG inline, para evitar el 404 que los tests cuentan como error de consola.

### Herramientas

- **TypeScript 6.0.3**, no 7.0. `svelte-check` 4.7.8 todavía pide TypeScript ^5 o ^6, y se usa la misma versión en todo el repo.
- **Un solo spec de Playwright** (`packages/e2e`) para todas las apps, con roles y textos del handoff como selectores. Además del flujo, falla ante cualquier error de consola (hidratación, excepciones, 404).

## Por stack

### astro-react

- `astro preview` detecta que lo ejecuta un agente y se pasa a segundo plano. Playwright y el benchmark lo interpretan como un servidor caído. El script usa `astro preview --ignore-lock`, que lo deja en primer plano.
- La isla se prerenderiza en el build (SSG) y se hidrata con `client:load`. Toda la app es una isla, porque el mapa y la expedición comparten estado.

### preact-vite

- Sin `@preact/preset-vite`, que exige Babel. Alcanza con alias de `react`, `react-dom`, `react-dom/client` y `react/jsx-runtime` a `preact/compat` y el runtime JSX automático de Vite.
- Preact ejecuta los efectos después del paint, y el foco llega un frame más tarde que en React. Los tests de teclado esperan el foco (`expect.poll`) en vez de leerlo una sola vez.

### svelte-vite

- `{@html}` dentro de `<svg>` no es confiable para inyectar el SVG del mapa. Se usa una acción `use:html` que asigna `innerHTML`.
- El linter de accesibilidad de Svelte marca patrones que pide el handoff: `<section role="dialog">`, el mapa enfocable con `role="application"` y el Escape a nivel de la expedición. Se silencian puntualmente con `svelte-ignore` y la regla correspondiente.
- Los diálogos tienen `tabindex="-1"` (Svelte lo pide para elementos con `role="dialog"` y teclado). No cambia el orden de tabulación.

### r3f-3d

- **El mapa es una textura.** El SVG pintado completo (filtros incluidos) se rasteriza una vez a un canvas de 2048 px (4096 en escritorio) con 250 unidades de margen para incluir Tierra del Fuego. Una imagen SVG no puede cargar fuentes externas, así que el texto del mapa usa las genéricas `serif` y `cursive` en vez de Fraunces y Caveat. Con zoom alto la textura se ve más blanda que el SVG vectorial.
- **Cámara.** En modo mapa es cenital, y su altura y centro salen del mismo estado `{k, px, py}` que usa el 2D. Así los marcadores, el clustering, las etiquetas y los gestos de `core` coinciden píxel a píxel. La bajada es un tween de 1,5 s hacia una pose baja e inclinada al sur de Marambio. El `rotateX` de CSS del prototipo se reemplaza por un fundido al final (`r3f.css`).
- **Marcadores** con `Html` de drei, montados en un `portal` propio (un `.ov` hermano del canvas). Con el contenedor por defecto, al desmontar el mapa se producía un error `removeChild`.
- **Sin WebGL** no se carga three.js: `MapView` recibe `forceList` y la lista pasa a ser la vista principal, sin botón «Ver mapa». Lo cubre `packages/e2e/tests/r3f-fallback.spec.ts`.
- **`prefers-reduced-motion`**: sin vuelo de cámara ni tweens de zoom. Solo el fundido, igual que en 2D.
- **Peso.** R3F registra todo el namespace de THREE, y importar solo `Html` de drei no achica el chunk (unos 250 kB gzip). Está diferido, así que no cuenta como JS inicial, pero sí como JS total.

## Benchmark

- Corre en Chromium headless sin GPU. Las cifras de frames e interacción sirven para comparar las apps entre sí, no como valores absolutos de un teléfono real.
- **JS inicial** = scripts del HTML (y `component-url`/`renderer-url` de las islas de Astro), más todo lo que importan estáticamente y los scripts inline. Los `import()` diferidos no cuentan.
- Las capturas se toman con `prefers-reduced-motion: reduce` para que no dependan del momento exacto de una animación.
