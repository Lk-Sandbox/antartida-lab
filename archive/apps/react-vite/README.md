# react-vite (referencia)

Vite + React 19 + TypeScript. Monta `AntarcticaApp` de `@antartida/react-ui`; toda la lógica viene de `@antartida/core`.

```sh
pnpm dev       # http://localhost:5101
pnpm build && pnpm preview   # http://localhost:5101
pnpm e2e       # flujo completo (Playwright, 390 px y 1440 px)
```

La costa y la expedición se cargan bajo demanda (`import()`), así el JS inicial queda por debajo de 80 kB gzip.
