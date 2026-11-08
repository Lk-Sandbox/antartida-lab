import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: { port: 5104, strictPort: true },
  preview: { port: 5104, strictPort: true },
});
