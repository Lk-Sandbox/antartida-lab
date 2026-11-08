/** Fixed dev/preview port per app (the stack lab's other apps are archived in archive/). */
export const APPS = {
  'preact-vite': 5103,
} as const;

export type AppName = keyof typeof APPS;
