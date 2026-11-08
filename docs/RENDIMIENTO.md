# Rendimiento

> Generado por `pnpm bench` (`scripts/bench`). No editar a mano. La comparación de stacks que eligió esta app está congelada en [`docs/lab/COMPARACION.md`](lab/COMPARACION.md).

Fecha: 2026-11-08 · Máquina: Intel(R) Core(TM) Ultra 5 125H × 18 · Chromium 156.0.8078.47 Arch Linux

## Criterios del handoff

| App | Accesibilidad ≥ 95 | JS inicial < 80 kB gzip | E2E |
|---|---|---|---|
| preact-vite | sí (100) | sí (16.3 kB) | ver `pnpm e2e` |

## Peso (kB)

JS inicial = scripts del HTML más todo lo que importan estáticamente. Los `import()` diferidos (costa y expedición) quedan fuera.

| App | JS inicial raw | gzip | brotli | JS total raw | gzip | brotli | CSS raw | gzip | brotli |
|---|---|---|---|---|---|---|---|---|---|
| preact-vite | 42.7 | 16.3 | 14.8 | 98.3 | 36.6 | 31.4 | 20.4 | 4.8 | 4.3 |

## Build y red

| App | Build (s) | Requests en la carga |
|---|---|---|
| preact-vite | 1.0 | 11 |

## Lighthouse (mobile, throttling por defecto, mediana de 3)

| App | Performance | Accesibilidad | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|
| preact-vite | 98 | 100 | 2105 | 100 | 0.001 |

## Interacción con CPU 4x (390 px, táctil)

Formato: tareas largas (tiempo total) · frames > 50 ms / frames medidos · p95 del frame.

| App | Pan | Pinch | Bajada a la expedición |
|---|---|---|---|
| preact-vite | 0 (0 ms) · 0/104 · p95 17 ms | 0 (0 ms) · 0/102 · p95 17 ms | 1 (54 ms) · 1/176 · p95 17 ms |

## Zoom con GPU real (1440 px)

GPU: ANGLE (Intel, Mesa Intel(R) Arc(tm) Graphics (MTL), OpenGL ES 3.2). Trabajo del proceso de GPU mientras se hace zoom: es donde aparecían las trabas (los filtros SVG se re-rasterizan fuera del hilo principal y no se ven en las métricas de arriba). Formato: total · tarea más larga · tareas > 16 ms.

| App | Botones + (3 zooms animados) | Rueda (10 pasos) |
|---|---|---|
| preact-vite | 172 ms · máx 23 ms · 3 | 125 ms · máx 15 ms · 0 |

## Capturas

En `docs/rendimiento/capturas/<app>/`: `mapa`, `ficha`, `lista`, `excavacion` y `conclusion`, a 390 y 1440 px.
