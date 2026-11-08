# Antártida por descubrir

Equipo **DOT ENV**, hackatón SoberaníaTech (Ushuaia, 2026).

*Antártida por descubrir* es un mapa pintado de la Antártida con una expedición educativa: los fósiles de Isla Marambio (pregunta, excavación, comparación, conclusión y regreso). El diseño y el comportamiento están en [`docs/handoff/`](docs/handoff/HANDOFF.md).

La app es **`apps/preact-vite`**: Vite + Preact 11, con los componentes de `packages/react-ui` sobre `preact/compat`. Se eligió después de comparar cinco stacks: era la más liviana (16 kB de JS inicial) y la más rápida. La comparación está congelada en [`docs/lab/COMPARACION.md`](docs/lab/COMPARACION.md) y las otras apps quedaron en [`archive/`](archive/README.md).

## Estructura

```
apps/preact-vite/   la app (Vite + Preact, puerto 5103)
packages/
  core/             TS puro: contenido (PTS, EV, OPTS, KNOW), proyección, clustering, etiquetas,
                    viewport, máquina de estados de la expedición, persistencia, CSS y arte del mapa
  react-ui/         componentes de la interfaz (React API, corren sobre preact/compat)
  e2e/              tests de flujo con Playwright
scripts/bench/      benchmark de rendimiento → docs/RENDIMIENTO.md
archive/            apps del laboratorio de stacks (congeladas, fuera del workspace)
docs/
  handoff/          especificación de diseño y prototipo
  DECISIONES.md     diferencias con el prototipo y por qué
  RENDIMIENTO.md    resultado del último benchmark
  lab/              comparación de stacks (congelada) y sus capturas
```

Dónde se toca cada cosa:

- **Textos y contenido:** `packages/core/src/content/`.
- **Lógica sin interfaz** (mapa, expedición, persistencia): `packages/core/src/`, con tests en `packages/core/test/`.
- **Componentes:** `packages/react-ui/src/`.
- **Estilos:** `packages/core/src/styles/`.
- **Arranque de la app y alias a Preact:** `apps/preact-vite/`.

## Requisitos

Node 22 LTS o superior y pnpm 11. Para los E2E y el benchmark hace falta Chromium. Se usa el del sistema (`/usr/bin/chromium`) o el de la variable `CHROMIUM_PATH`. Si no hay ninguno: `pnpm exec playwright install chromium`.

## Uso

```sh
pnpm install
pnpm dev          # http://localhost:5103
pnpm build
pnpm preview      # build de producción en http://localhost:5103

pnpm test         # Vitest de core: proyección, clustering, viewport, expedición, storage
pnpm typecheck
pnpm e2e          # flujo completo con Playwright a 390 y 1440 px, también solo con teclado
pnpm bench        # build, peso, Lighthouse ×3, interacción con CPU 4x, zoom con GPU y capturas
```

`pnpm bench` regenera `docs/RENDIMIENTO.md` y las capturas en `docs/rendimiento/capturas/`. Los reportes completos de Lighthouse quedan en `scripts/bench/out/`, fuera de git.

### Mapa

- `pnpm coastline` descarga Natural Earth en `packages/core/.cache/` y reescribe `packages/core/src/coastline.ts`.
- La acuarela del mapa se hornea a WebP (768, 2048 y 4096 px) para que el zoom sea fluido. Después de cambiar la costa o el arte del mapa (`packages/core/src/svg/paint.ts`), corré `pnpm map-raster`. Detalles en [`docs/DECISIONES.md`](docs/DECISIONES.md#zoom-fluido-mapa-horneado-a-imagen).

## Fuentes y licencias

- **Costa y barreras de hielo:** [Natural Earth](https://www.naturalearthdata.com/) (`ne_50m_land`, `ne_50m_antarctic_ice_shelves_polys`), dominio público.
- **Tipografías** (vía `@fontsource`, SIL Open Font License 1.1): Fraunces, Atkinson Hyperlegible y Caveat.
- El contenido científico es provisional y está marcado como `[Contenido provisional]` / `[Fuente a definir]`.

## Declaración de uso de IA

Como exigen las bases de la hackatón: se dibujo un boceto con todas las posibles ideas y luego **el diseño se generó con Claude Design** (prototipo en `docs/handoff/design/Main.dc.html`) y **el código de este repositorio se escribió con Claude Code**, con multiples revisiones del equipo.
