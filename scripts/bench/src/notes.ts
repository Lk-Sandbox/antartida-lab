/** Qualitative notes per stack (Spanish), written while implementing each app. */
export const NOTES: Record<string, string> = {
  'react-vite': `
**Ventajas.** Es la base más directa: el prototipo ya estaba pensado como componente React de clase, así que la traducción a hooks fue casi mecánica. Vite 8 compila en menos de un segundo y el HMR es instantáneo. Con \`React.lazy\` + \`import()\` la expedición y la costa (unos 13 kB gzip de datos) salen del bundle inicial sin esfuerzo.

**Desventajas.** React DOM es la parte más pesada del bundle inicial (cerca del 80 % del JS inicial). Sin el code splitting, la app pasaba los 95 kB gzip y no cumplía el límite de 80 kB. El pan y el pinch hacen un re-render por evento de puntero (estado en React); funciona, pero cada frame recalcula marcadores y etiquetas.

**Experiencia de desarrollo.** Sin sorpresas. TypeScript, el reducer puro de \`core\` y \`useReducer\` encajan bien. Lo único fino fue la gestión de foco (devolverlo al disparador al cerrar diálogos) y separar los handlers de gestos con refs para no leer estado viejo.
`,
  'astro-react': `
**Ventajas.** Los mismos componentes, sin cambios, salen prerenderizados en el HTML del build (SSG): el mapa, la leyenda y los botones están en la página antes de que llegue el JS, y la isla los hidrata. Para un deploy estático (lo que pide el handoff) es lo más natural, y deja espacio para sumar páginas de contenido (créditos, fuentes, Content Collections) sin JS.

**Desventajas.** Como toda la app es una sola isla interactiva, Astro no ahorra JS: suma su runtime de islas y la hidratación queda algo por encima de la referencia. El build tarda más que Vite solo. Hay que cuidar que nada del primer render dependa de \`window\` (la persistencia de \`explored\` se lee recién en un efecto, para no romper la hidratación).

**Experiencia de desarrollo.** Integración con React sin fricción: una página \`.astro\` de 20 líneas. La sorpresa fue el CLI: \`astro preview\` detecta que lo corre un agente y se va a segundo plano, lo que rompe a Playwright; se resolvió con \`--ignore-lock\`.
`,
  'preact-vite': `
**Ventajas.** Mismo código que la referencia, con cuatro líneas de alias en \`vite.config.ts\` y ningún cambio en los componentes. El JS inicial cae a una fracción del de React porque Preact reemplaza a React DOM. Si el equipo quiere seguir escribiendo React pero necesita peso mínimo, es la opción más barata.

**Desventajas.** \`preact/compat\` no es React: los efectos (\`useEffect\`) corren después del paint, así que el foco que se mueve en un efecto llega un frame más tarde. Los usuarios no lo notan, pero los tests de teclado que presionaban teclas inmediatamente fallaban y hubo que hacerlos esperar el foco. Las librerías del ecosistema que dependen de internals de React (como React Three Fiber) no son compatibles.

**Experiencia de desarrollo.** Sin \`@preact/preset-vite\` (que pide Babel); alcanzó con alias y el runtime JSX automático de Vite. El tipado se hace contra \`@types/react\`, así que el editor no avisa si se usa algo que compat no soporta: la red de seguridad son los E2E.
`,
  'svelte-vite': `
**Ventajas.** Sin runtime de framework pesado: el JS inicial queda muy cerca del de Preact, con componentes que compilan a actualizaciones de DOM directas (en el pan solo cambian el \`transform\` y la posición de los marcadores, sin diff de árbol virtual). Las runes (\`$state\`, \`$derived\`, \`$effect\`) hacen corto el código de estado y la lógica pura de \`core\` se reutiliza entera. Las acciones (\`use:focusReturn\`) resuelven el foco de los diálogos en un solo lugar.

**Desventajas.** Es una reescritura completa: 15 componentes que hay que mantener en paralelo con \`react-ui\`. El SVG inyectado necesitó una acción propia porque \`{@html}\` no es cómodo dentro de \`<svg>\`. El linter de accesibilidad de Svelte marca patrones que pide el handoff (\`<section role="dialog">\`, mapa \`role="application"\` enfocable) y hubo que silenciarlos puntualmente.

**Experiencia de desarrollo.** Rápida y agradable, pero con una trampa de reactividad: un \`$effect\` que lee \`s.step\` de un \`$state.raw\` depende del objeto entero y se volvía a ejecutar en cada acción, robándole el foco a la tarjeta de evidencia. Se resolvió con un \`$derived\`. Lo atrapó el test de teclado, no la revisión visual.
`,
  'r3f-3d': `
**Ventajas.** La "bajada" deja de ser un truco de CSS (\`rotateX\` sobre un plano) y pasa a ser una cámara en perspectiva que vuela hasta Marambio: es la versión con más impacto visual. El pan y el zoom mueven solo la cámara sobre una textura ya rasterizada, así que los filtros SVG nunca se recalculan en el navegador. Todo lo demás (encabezado, fichas, lista, expedición) es \`react-ui\` sin cambios, y la cámara cenital encuadra el plano igual que la capa 2D, de modo que clustering, etiquetas y gestos salen de \`core\`.

**Desventajas.** Es, con diferencia, la más pesada: three.js + React Three Fiber suman unos 250 kB gzip en un chunk diferido, porque R3F registra todo el namespace de THREE y no se puede recortar importando solo \`Html\` de drei. El texto del mapa se rasteriza sin las tipografías propias (una imagen SVG no puede cargar fuentes externas) y con zoom alto la textura se ve más blanda que el SVG vectorial. Necesita WebGL: sin él cae a la vista de lista. El costo está al arrancar: three.js y la composición de la textura de 2048–4096 px pesan con CPU lenta. Desde que la acuarela viene horneada en WebP, el TBT bajó de ~3,8 s a ~1,6 s, pero sigue siendo el peor, y el pinch con CPU 4x todavía muestra tareas largas.

**Experiencia de desarrollo.** Lo más delicado fue integrar \`Html\` de drei con un shell React existente: por defecto se cuelga del contenedor del canvas y al desmontar el mapa tiraba \`removeChild\`; se resolvió con un \`portal\` propio. Mapear el estado 2D (\`k\`, \`px\`, \`py\`) a una pose de cámara fue una sola fórmula y evitó duplicar la lógica de gestos.
`,
};
