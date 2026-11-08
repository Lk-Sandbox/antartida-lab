/** Fixed dev/preview port per app. */
export const APPS = {
  'preact-vite': 5103,
} as const;

export type AppName = keyof typeof APPS;
