# Comparación de stacks

> Generado por `pnpm bench` (`scripts/bench`). No editar a mano: los textos de cada stack salen de `scripts/bench/src/notes.ts`.

Fecha: 2026-11-08 · Máquina: Intel(R) Core(TM) Ultra 5 125H × 18 · Chromium 156.0.8078.47 Arch Linux

## Criterios del handoff

| App | Accesibilidad ≥ 95 | JS inicial < 80 kB gzip | E2E |
|---|---|---|---|
| react-vite | sí (100) | sí (74.5 kB) | ver `pnpm e2e` |
| astro-react | sí (100) | sí (78.5 kB) | ver `pnpm e2e` |

## Peso (kB)

JS inicial = scripts del HTML (y de las islas de Astro) más todo lo que importan estáticamente. Los `import()` diferidos (costa, expedición, 3D) quedan fuera.

| App | JS inicial raw | gzip | brotli | JS total raw | gzip | brotli | CSS raw | gzip | brotli |
|---|---|---|---|---|---|---|---|---|---|
| react-vite | 238.4 | 74.5 | 64.1 | 296.2 | 95.1 | 81.0 | 20.2 | 4.8 | 4.3 |
| astro-react | 245.5 | 78.5 | 68.1 | 298.4 | 97.2 | 83.3 | 20.2 | 4.8 | 4.3 |

## Build y red

| App | Build (s) | Requests en la carga |
|---|---|---|
| react-vite | 1.1 | 9 |
| astro-react | 2.1 | 12 |

## Lighthouse (mobile, throttling por defecto, mediana de 3)

| App | Performance | Accesibilidad | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|
| react-vite | 98 | 100 | 1572 | 123 | 0.001 |
| astro-react | 99 | 100 | 756 | 133 | 0.002 |

## Interacción con CPU 4x (390 px, táctil)

Formato: tareas largas (tiempo total) · frames > 50 ms / frames medidos · p95 del frame.

| App | Pan | Pinch | Bajada a la expedición |
|---|---|---|---|
| react-vite | 0 (0 ms) · 0/106 · p95 17 ms | 0 (0 ms) · 0/104 · p95 17 ms | 1 (77 ms) · 1/176 · p95 17 ms |
| astro-react | 0 (0 ms) · 0/105 · p95 17 ms | 0 (0 ms) · 0/104 · p95 17 ms | 1 (85 ms) · 1/175 · p95 17 ms |

## Capturas

En `docs/capturas/<app>/`: `mapa`, `ficha`, `lista`, `excavacion` y `conclusion`, a 390 y 1440 px.

## Ventajas y desventajas

### react-vite

**Ventajas.** Es la base más directa: el prototipo ya estaba pensado como componente React de clase, así que la traducción a hooks fue casi mecánica. Vite 8 compila en menos de un segundo y el HMR es instantáneo. Con `React.lazy` + `import()` la expedición y la costa (unos 13 kB gzip de datos) salen del bundle inicial sin esfuerzo.

**Desventajas.** React DOM es la parte más pesada del bundle inicial (cerca del 80 % del JS inicial). Sin el code splitting, la app pasaba los 95 kB gzip y no cumplía el límite de 80 kB. El pan y el pinch hacen un re-render por evento de puntero (estado en React); funciona, pero cada frame recalcula marcadores y etiquetas.

**Experiencia de desarrollo.** Sin sorpresas. TypeScript, el reducer puro de `core` y `useReducer` encajan bien. Lo único fino fue la gestión de foco (devolverlo al disparador al cerrar diálogos) y separar los handlers de gestos con refs para no leer estado viejo.

### astro-react

**Ventajas.** Los mismos componentes, sin cambios, salen prerenderizados en el HTML del build (SSG): el mapa, la leyenda y los botones están en la página antes de que llegue el JS, y la isla los hidrata. Para un deploy estático (lo que pide el handoff) es lo más natural, y deja espacio para sumar páginas de contenido (créditos, fuentes, Content Collections) sin JS.

**Desventajas.** Como toda la app es una sola isla interactiva, Astro no ahorra JS: suma su runtime de islas y la hidratación queda algo por encima de la referencia. El build tarda más que Vite solo. Hay que cuidar que nada del primer render dependa de `window` (la persistencia de `explored` se lee recién en un efecto, para no romper la hidratación).

**Experiencia de desarrollo.** Integración con React sin fricción: una página `.astro` de 20 líneas. La sorpresa fue el CLI: `astro preview` detecta que lo corre un agente y se va a segundo plano, lo que rompe a Playwright; se resolvió con `--ignore-lock`.
