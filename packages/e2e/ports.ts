/** Fixed dev/preview port per app. */
export const APPS = {
  'react-vite': 5101,
  'astro-react': 5102,
  'preact-vite': 5103,
  'svelte-vite': 5104,
  'r3f-3d': 5105,
} as const;

export type AppName = keyof typeof APPS;
