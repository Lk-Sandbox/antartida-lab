# Archivo del laboratorio de stacks

Acá quedan las cuatro implementaciones que se compararon con la elegida y no siguieron:

| App | Stack | Puerto |
|---|---|---|
| `apps/react-vite` | Vite + React (referencia) | 5101 |
| `apps/astro-react` | Astro + isla React | 5102 |
| `apps/svelte-vite` | Svelte 5 (runes) | 5104 |
| `apps/r3f-3d` | React Three Fiber, mapa en 3D | 5105 |

También quedan `comparar.html` (las cinco apps lado a lado) y el test de fallback sin WebGL de r3f (`apps/r3f-3d/r3f-fallback.spec.ts`).

**Están congeladas.** No forman parte del workspace de pnpm: no se instalan, no se compilan y no se testean. `packages/core` y `packages/react-ui` siguen evolucionando solo para `apps/preact-vite`, así que el código de esta carpeta puede no compilar contra la versión actual.

## Correrlas de nuevo

El estado exacto en que funcionaban las cinco está en la etiqueta git `lab-comparacion`:

```sh
git worktree add ../antartida-lab-comparacion lab-comparacion
cd ../antartida-lab-comparacion
pnpm install && pnpm build && pnpm preview:all   # y abrir scripts/comparar.html
```

Resultados y decisiones de esa etapa: [`docs/lab/COMPARACION.md`](../docs/lab/COMPARACION.md) y [`docs/DECISIONES.md`](../docs/DECISIONES.md).
