import { defineConfig } from 'vite';

// react-ui runs untouched on Preact: every React import is aliased to preact/compat.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^react-dom\/client$/, replacement: 'preact/compat/client' },
      { find: /^react\/jsx-runtime$/, replacement: 'preact/jsx-runtime' },
      { find: /^react\/jsx-dev-runtime$/, replacement: 'preact/jsx-dev-runtime' },
      { find: /^react(-dom)?$/, replacement: 'preact/compat' },
    ],
    dedupe: ['preact'],
  },
  oxc: { jsx: { runtime: 'automatic', importSource: 'react' } },
  server: { port: 5103, strictPort: true },
  preview: { port: 5103, strictPort: true },
});
