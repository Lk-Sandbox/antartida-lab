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
};
