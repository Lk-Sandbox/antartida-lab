# Comparación de stacks

> Generado por `pnpm bench` (`scripts/bench`). No editar a mano: los textos de cada stack salen de `scripts/bench/src/notes.ts`.

Fecha: 2026-11-08 · Máquina: Intel(R) Core(TM) Ultra 5 125H × 18 · Chromium 156.0.8078.47 Arch Linux

## Criterios del handoff

| App | Accesibilidad ≥ 95 | JS inicial < 80 kB gzip | E2E |
|---|---|---|---|
| react-vite | sí (100) | sí (74.5 kB) | ver `pnpm e2e` |
| astro-react | sí (100) | sí (78.5 kB) | ver `pnpm e2e` |
| preact-vite | **no** (—) | sí (16.0 kB) | ver `pnpm e2e` |
| svelte-vite | **no** (—) | sí (24.6 kB) | ver `pnpm e2e` |

## Peso (kB)

JS inicial = scripts del HTML (y de las islas de Astro) más todo lo que importan estáticamente. Los `import()` diferidos (costa, expedición, 3D) quedan fuera.

| App | JS inicial raw | gzip | brotli | JS total raw | gzip | brotli | CSS raw | gzip | brotli |
|---|---|---|---|---|---|---|---|---|---|
| react-vite | 238.4 | 74.5 | 64.1 | 296.2 | 95.1 | 81.0 | 20.2 | 4.8 | 4.3 |
| astro-react | 245.5 | 78.5 | 68.1 | 298.4 | 97.2 | 83.3 | 20.2 | 4.8 | 4.3 |
| preact-vite | 42.0 | 16.0 | 14.5 | 98.4 | 36.6 | 31.3 | 20.2 | 4.8 | 4.3 |
| svelte-vite | 64.3 | 24.6 | 22.1 | 124.5 | 47.0 | 40.5 | 20.2 | 4.8 | 4.3 |

## Build y red

| App | Build (s) | Requests en la carga |
|---|---|---|
| react-vite | 1.1 | 9 |
| astro-react | 2.1 | 12 |
| preact-vite | 1.0 | 9 |
| svelte-vite | 1.4 | 9 |

## Lighthouse (mobile, throttling por defecto, mediana de 3)

| App | Performance | Accesibilidad | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|
| react-vite | 98 | 100 | 1572 | 123 | 0.001 |
| astro-react | 99 | 100 | 756 | 133 | 0.002 |
| preact-vite | — | — | — | — | — |
| svelte-vite | — | — | — | — | — |

## Interacción con CPU 4x (390 px, táctil)

Formato: tareas largas (tiempo total) · frames > 50 ms / frames medidos · p95 del frame.

| App | Pan | Pinch | Bajada a la expedición |
|---|---|---|---|
| react-vite | 0 (0 ms) · 0/106 · p95 17 ms | 0 (0 ms) · 0/104 · p95 17 ms | 1 (77 ms) · 1/176 · p95 17 ms |
| astro-react | 0 (0 ms) · 0/105 · p95 17 ms | 0 (0 ms) · 0/104 · p95 17 ms | 1 (85 ms) · 1/175 · p95 17 ms |
| preact-vite | 0 (0 ms) · 0/104 · p95 17 ms | 0 (0 ms) · 0/102 · p95 17 ms | 1 (80 ms) · 1/179 · p95 17 ms |
| svelte-vite | 0 (0 ms) · 0/104 · p95 17 ms | 0 (0 ms) · 0/103 · p95 17 ms | 1 (92 ms) · 1/177 · p95 17 ms |

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

### preact-vite

**Ventajas.** Mismo código que la referencia, con cuatro líneas de alias en `vite.config.ts` y ningún cambio en los componentes. El JS inicial cae a una fracción del de React porque Preact reemplaza a React DOM. Si el equipo quiere seguir escribiendo React pero necesita peso mínimo, es la opción más barata.

**Desventajas.** `preact/compat` no es React: los efectos (`useEffect`) corren después del paint, así que el foco que se mueve en un efecto llega un frame más tarde. Los usuarios no lo notan, pero los tests de teclado que presionaban teclas inmediatamente fallaban y hubo que hacerlos esperar el foco. Las librerías del ecosistema que dependen de internals de React (como React Three Fiber) no son compatibles.

**Experiencia de desarrollo.** Sin `@preact/preset-vite` (que pide Babel); alcanzó con alias y el runtime JSX automático de Vite. El tipado se hace contra `@types/react`, así que el editor no avisa si se usa algo que compat no soporta: la red de seguridad son los E2E.

### svelte-vite

**Ventajas.** Sin runtime de framework pesado: el JS inicial queda muy cerca del de Preact, con componentes que compilan a actualizaciones de DOM directas (en el pan solo cambian el `transform` y la posición de los marcadores, sin diff de árbol virtual). Las runes (`$state`, `$derived`, `$effect`) hacen corto el código de estado y la lógica pura de `core` se reutiliza entera. Las acciones (`use:focusReturn`) resuelven el foco de los diálogos en un solo lugar.

**Desventajas.** Es una reescritura completa: 15 componentes que hay que mantener en paralelo con `react-ui`. El SVG inyectado necesitó una acción propia porque `{@html}` no es cómodo dentro de `<svg>`. El linter de accesibilidad de Svelte marca patrones que pide el handoff (`<section role="dialog">`, mapa `role="application"` enfocable) y hubo que silenciarlos puntualmente.

**Experiencia de desarrollo.** Rápida y agradable, pero con una trampa de reactividad: un `$effect` que lee `s.step` de un `$state.raw` depende del objeto entero y se volvía a ejecutar en cada acción, robándole el foco a la tarjeta de evidencia. Se resolvió con un `$derived`. Lo atrapó el test de teclado, no la revisión visual.
