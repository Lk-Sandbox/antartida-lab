# Laboratorio de stacks (congelado)

Antes de elegir **preact-vite** se implementó la misma app con cinco stacks: react-vite, astro-react, preact-vite, svelte-vite y r3f-3d (mapa en 3D). Los resultados están en [`COMPARACION.md`](COMPARACION.md) y [`bench/results.json`](bench/results.json). Las diferencias de cada stack, en la sección «Por stack (laboratorio)» de [`../DECISIONES.md`](../DECISIONES.md).

Las otras apps, las capturas y la página para verlas lado a lado ya no están en el repo. Se recuperan intactas desde la etiqueta git `lab-comparacion`, sin tocar tu copia de trabajo:

```sh
git worktree add ../antartida-lab-comparacion lab-comparacion
cd ../antartida-lab-comparacion
pnpm install && pnpm build && pnpm preview:all   # y abrir scripts/comparar.html
```

Para borrar ese directorio después: `git worktree remove ../antartida-lab-comparacion`.
