# Antártida por descubrir — laboratorio de stacks

## Contexto

Somos el equipo DOT ENV en la hackatón SoberaníaTech (Ushuaia, entrega 19/11/2026). En esta carpeta está `antartida-handoff/` con:

- `HANDOFF.md`: especificación de diseño, comportamiento, accesibilidad y criterios de aceptación.
- `design/Main.dc.html`: prototipo de referencia en formato de canvas de diseño. Es la fuente de verdad de look, textos, datos y comportamiento, pero **no se copia tal cual** (depende de un runtime `support.js` que no existe).
- `PROMPT_CLAUDE_CODE.md`: un prompt anterior que propone un solo stack (Astro). **Este archivo lo reemplaza.** Ignoralo salvo como referencia.

El objetivo de este repo NO es el producto final: es un laboratorio para implementar la misma app con varios stacks y compararlos en diseño, rendimiento, peso y experiencia de desarrollo. El ganador se pasa después al repo oficial.

## Antes de escribir código

1. Leé `HANDOFF.md` y `design/Main.dc.html` completos, incluido el `<script type="text/x-dc">` del final (ahí están la lógica y las constantes `PTS`, `EV`, `OPTS`, `KNOW`).
2. Verificá el entorno: `node -v` (necesito Node 22 LTS o superior), `pnpm -v`, `git --version`, `gh auth status`. Si algo falta o `gh` no está autenticado, frená y decime qué falta. No instales nada global sin avisarme.
3. Armá un **plan completo** (estructura, orden, qué se comparte, cómo se mide) y **frená hasta que lo apruebe**. Después de aprobado, hacé todo el resto sin pedirme confirmaciones.

## Repositorio

- Nombre: `antartida-lab`. Crealo en mi cuenta de GitHub como **privado** con `gh repo create antartida-lab --private --source=. --remote=origin`.
- Copiá `antartida-handoff/` dentro del repo en `docs/handoff/` para que quede versionado.
- Monorepo con **pnpm workspaces**. Versiones estables actuales de cada herramienta; fijalas en los `package.json`.
- `.gitignore` adecuado (node_modules, dist, .astro, reportes pesados de Lighthouse, etc.).
- Commits en español, Conventional Commits, sin emojis. **Commit y push al terminar cada etapa**, para que si el trabajo se corta quede todo lo hecho en GitHub.

## Estructura

```
antartida-lab/
  docs/
    handoff/                 # copia del handoff
    COMPARACION.md           # resultado del benchmark (se genera)
    DECISIONES.md            # diferencias inevitables entre stacks y por qué
  packages/
    core/                    # TS puro, sin framework
    react-ui/                # componentes React compartidos
  apps/
    react-vite/              # 1. referencia
    astro-react/             # 2. Astro + isla React
    preact-vite/             # 3. mismos componentes con preact/compat
    svelte-vite/             # 4. reescritura en Svelte 5
    r3f-3d/                  # 5. experimental: mapa en 3D real
  scripts/
    bench/                   # medición comparativa
  README.md
```

### `packages/core` (se hace primero y lo usan todos)

Todo lo que no depende del framework, para que la comparación sea justa (mismos datos, misma lógica) y no se escriba cinco veces:

- `content/points.ts` y `content/fossils.ts`: `PTS`, `EV`, `OPTS`, `KNOW` extraídos **textualmente** del prototipo, tipados.
- `projection.ts`: estereográfica polar según el handoff (`r = 1590 · tan((90 − |lat|)/2)`, Greenwich arriba).
- `clustering.ts`: greedy por distancia en pantalla (< 46 px).
- `expedition.ts`: máquina de estados de los pasos 1 a 5 y de la excavación (4 pasadas por zona), como reducer puro.
- `storage.ts`: persistencia de `explored` en `localStorage` con try/catch.
- `styles/tokens.css`, `styles/painted.css` (filtros, keyframes, marcadores) y `svg/filters.ts` (los `<defs>` `#wc`, `#wcs`, `#ink`, `#bleed`, `#paperf`, `#fibers` copiados tal cual del prototipo, como string).
- `scripts/build-coastline.ts`: descarga Natural Earth (`ne_50m_land`), filtra la Antártida, la proyecta con `d3-geo` y genera `coastline.ts` con el `path` SVG estático. El resultado generado se commitea; `d3-geo` nunca llega al cliente. Anotá la fuente y la licencia (dominio público) en el README.
- Tests con Vitest: proyección (puntos conocidos), clustering (umbral y separación por zoom), máquina de estados (de 1 a 5, registro 1/1), excavación (4 pasadas abren la tarjeta).

### `packages/react-ui`

Los componentes React de la estructura del handoff (`MapView`, `Markers`, `PointSheet`, `ListView`, `Legend`, `ExplorationLog`, `Expedition`, `Scene`, `DigSite`, `EvidenceCard`, `Compare`, `Reconstruction`, `KnowledgePanel`, `Chip`, `Filters`), consumiendo `core`. Los usan las apps 1, 2, 3 y parte de la 5. Así la diferencia entre esas apps mide el shell y el runtime, no cómo se escribió cada una.

### Apps, en este orden

1. **`react-vite`** (referencia): Vite + React + TypeScript. Es la implementación principal y la que tiene que quedar más pulida. Cumple todos los criterios de aceptación del handoff, incluidos los pendientes que el prototipo no resuelve (devolver el foco al cerrar diálogos, persistencia, colisión simple de etiquetas en la Península).
2. **`astro-react`**: Astro con `react-ui` como isla (`client:load`). La página es estática; solo la isla lleva JS.
3. **`preact-vite`**: Vite + Preact usando `react-ui` mediante alias a `preact/compat`. Sin tocar los componentes.
4. **`svelte-vite`**: Vite + Svelte 5 (runes), reescribiendo los componentes en Svelte y reutilizando `core` completo. Mismo look y comportamiento que la referencia.
5. **`r3f-3d`** (experimental): React Three Fiber + drei. El continente es un plano con textura generada a partir del mismo SVG pintado (rasterizado a canvas), los marcadores son `Html` de drei y la "bajada" es una animación real de cámara en perspectiva hacia Marambio. La expedición reutiliza los componentes de `react-ui`. Tiene que respetar `prefers-reduced-motion` y conservar "Ver como lista" como alternativa sin 3D. Si WebGL no está disponible, cae a la vista de lista.

Reglas para todas las apps:

- Mismos textos, mismos datos, mismo comportamiento y mismos criterios de aceptación que el handoff. Cualquier diferencia que imponga el stack se anota en `docs/DECISIONES.md`.
- Tipografías con `@fontsource` (Fraunces, Atkinson Hyperlegible, Caveat) en todas, para que el benchmark no dependa de Google Fonts.
- Cada app con su propio puerto fijo de dev y preview (5101 a 5105), su `README.md` corto y su test de flujo (de la pregunta al regreso con registro 1/1) con Playwright.
- Nada de contenido científico inventado: lo provisional sigue marcado como `[Contenido provisional]` / `[Fuente a definir]`, con los chips **Dato real**, **Simulación educativa** y **Reconstrucción artística**.
- Código, variables y firmas en inglés, sin comentarios obvios. Documentación en español.

## Benchmark (`scripts/bench`)

Un comando en la raíz, `pnpm bench`, que:

1. Hace build de producción de cada app y levanta su preview.
2. Mide por app: JS total y JS inicial (gzip y brotli), CSS, cantidad de requests y tiempo de build.
3. Corre Lighthouse en modo mobile (con throttling por defecto) sobre el mapa: Performance, Accesibilidad, LCP, TBT, CLS. Tres corridas por app, reporta la mediana.
4. Con Playwright y CPU throttling 4x vía CDP, simula un pan y un pinch sobre el mapa y la transición a la expedición, y reporta frames largos / tareas largas, para ver cómo se comportan los filtros SVG en un celular de gama baja.
5. Toma capturas de cada app a 390 px y 1440 px: mapa, ficha abierta, lista, excavación y conclusión. Las guarda en `docs/capturas/<app>/` para comparar el diseño a ojo.
6. Genera `docs/COMPARACION.md` con una tabla por métrica, marcando quién cumple el criterio del handoff (Accesibilidad ≥ 95, JS de la isla < 80 kB gzip), y un párrafo honesto de ventajas y desventajas de cada stack, incluida la experiencia de desarrollo que viviste al implementarlo.

## README raíz (en español)

- Qué es el proyecto y para qué existe este repo.
- Cómo correr cada app y el benchmark.
- Enlace a `docs/COMPARACION.md` y a `docs/DECISIONES.md`.
- Fuentes y licencias (Natural Earth, tipografías).
- **Declaración de uso de IA**: el diseño se generó con Claude Design y el código con Claude Code (lo exigen las bases de la hackatón).

## Prioridades si el trabajo se corta

El orden de las apps es el orden de prioridad. Siempre tiene que quedar en GitHub, funcionando y con tests, al menos `core` + `react-vite`. El benchmark se puede correr con las apps que existan en ese momento. Al terminar, dame un resumen corto de lo hecho, qué quedó pendiente y el resultado del benchmark.
