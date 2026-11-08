# Antártida por descubrir — laboratorio de stacks

Equipo **DOT ENV**, hackatón SoberaníaTech (Ushuaia, 2026).

*Antártida por descubrir* es un mapa pintado de la Antártida con una expedición educativa: los fósiles de Isla Marambio (pregunta, excavación, comparación, conclusión y regreso). El diseño y el comportamiento están en [`docs/handoff/`](docs/handoff/HANDOFF.md).

Este repo **no es el producto final**. Es un laboratorio que implementa la misma app con cinco stacks para compararlos en diseño, rendimiento, peso y experiencia de desarrollo. El stack ganador se pasa después al repo oficial.

- Resultados: [`docs/COMPARACION.md`](docs/COMPARACION.md)
- Diferencias entre stacks y respecto del prototipo: [`docs/DECISIONES.md`](docs/DECISIONES.md)
- Capturas a 390 y 1440 px: [`docs/capturas/`](docs/capturas/)

## Estructura

```
packages/
  core/        TS puro: contenido (PTS, EV, OPTS, KNOW), proyección, clustering, etiquetas,
               viewport, máquina de estados de la expedición, persistencia, CSS y SVG pintados
  react-ui/    componentes React compartidos por las apps 1, 2, 3 y 5
  e2e/         spec de Playwright compartido (el mismo flujo para todas las apps)
apps/
  react-vite/  1. referencia: Vite + React            → :5101
  astro-react/ 2. Astro + isla React (client:load)    → :5102
  preact-vite/ 3. mismos componentes con preact/compat → :5103
  svelte-vite/ 4. reescritura en Svelte 5 (runes)      → :5104
  r3f-3d/      5. experimental: mapa 3D con R3F        → :5105
scripts/bench/ benchmark comparativo
```

## Requisitos

Node 22 LTS o superior y pnpm 11. Para los E2E y el benchmark hace falta Chromium. Se usa el del sistema (`/usr/bin/chromium`) o el de la variable `CHROMIUM_PATH`. Si no hay ninguno: `pnpm exec playwright install chromium`.

## Uso

```sh
pnpm install

# una app (dev y preview usan el mismo puerto fijo)
pnpm --filter @antartida/react-vite dev
pnpm --filter @antartida/react-vite build
pnpm --filter @antartida/react-vite preview

# las cinco apps a la vez (compilar antes con pnpm build) y verlas lado a lado:
# abrí scripts/comparar.html en el navegador (vista mobile o desktop)
pnpm preview:all

# verificación
pnpm test        # Vitest de core: proyección, clustering, viewport, expedición, storage
pnpm typecheck   # tsc y svelte-check en todos los paquetes
pnpm e2e         # Playwright en las cinco apps (390 px y 1440 px)

# benchmark: build, tamaños, Lighthouse ×3, interacción con CPU 4x y capturas
pnpm bench                       # todas las apps
pnpm bench react-vite svelte-vite --runs=1 --skip-shots
```

`pnpm bench` guarda los datos en `docs/bench/results.json` y regenera `docs/COMPARACION.md`. Los reportes completos de Lighthouse quedan en `scripts/bench/out/` (fuera de git).

Para regenerar la costa: `pnpm coastline`. Descarga Natural Earth en `packages/core/.cache/` y reescribe `packages/core/src/coastline.ts`.

## Fuentes y licencias

- **Costa y barreras de hielo:** [Natural Earth](https://www.naturalearthdata.com/) (`ne_50m_land`, `ne_50m_antarctic_ice_shelves_polys`), dominio público.
- **Tipografías** (vía `@fontsource`, SIL Open Font License 1.1): Fraunces, Atkinson Hyperlegible y Caveat.
- El contenido científico es provisional y está marcado como `[Contenido provisional]` / `[Fuente a definir]`.

## Declaración de uso de IA

Como exigen las bases de la hackatón: **el diseño se generó con Claude Design** (prototipo en `docs/handoff/design/Main.dc.html`) y **el código de este repositorio se escribió con Claude Code**, con revisión del equipo.
