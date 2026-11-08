# astro-react

Astro 7 como shell estático; `AntarcticaApp` de `@antartida/react-ui` va como isla `client:load`. El HTML del mapa se renderiza en el build (SSG) y la isla lo hidrata.

```sh
pnpm dev       # http://localhost:5102
pnpm build && pnpm preview   # http://localhost:5102
pnpm e2e
```
