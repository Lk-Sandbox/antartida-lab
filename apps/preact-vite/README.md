# preact-vite

Vite + Preact 11. Usa `@antartida/react-ui` **sin tocar los componentes**: `react`, `react-dom` y `react/jsx-runtime` se resuelven a `preact/compat` con alias en `vite.config.ts`.

```sh
pnpm dev       # http://localhost:5103
pnpm build && pnpm preview   # http://localhost:5103
pnpm e2e
```
