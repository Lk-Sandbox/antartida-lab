# r3f-3d (experimental)

React Three Fiber + drei. El mapa pintado se rasteriza una vez a un canvas y se usa como textura de un plano. Los marcadores son `Html` de drei y la "bajada" a Marambio es una animación real de cámara en perspectiva. El resto de la interfaz (encabezado, leyenda, fichas, lista y expedición) sale de `@antartida/react-ui`.

- La cámara cenital encuadra el plano igual que la capa SVG en 2D, así que el clustering, las etiquetas y los gestos de `core` se reutilizan sin cambios.
- Con `prefers-reduced-motion: reduce` no hay vuelo de cámara: solo el fundido.
- Sin WebGL, la app muestra directamente la vista de lista.

```sh
pnpm dev       # http://localhost:5105
pnpm build && pnpm preview   # http://localhost:5105
pnpm e2e
```
