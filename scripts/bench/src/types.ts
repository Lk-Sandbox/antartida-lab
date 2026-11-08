export interface Size {
  raw: number;
  gzip: number;
  brotli: number;
}

export interface LighthouseRun {
  performance: number;
  accessibility: number;
  lcp: number;
  tbt: number;
  cls: number;
}

export interface Interaction {
  /** Long tasks (> 50 ms) reported by PerformanceObserver. */
  longTasks: number;
  longTaskMs: number;
  /** Frames slower than 50 ms (rAF deltas). */
  longFrames: number;
  frames: number;
  /** p95 frame time in ms. */
  p95Frame: number;
}

export interface AppResult {
  app: string;
  buildMs: number;
  jsTotal: Size;
  jsInitial: Size;
  css: Size;
  requests: number;
  lighthouse: LighthouseRun;
  lighthouseRuns: LighthouseRun[];
  interaction: { pan: Interaction; pinch: Interaction; dive: Interaction };
  error?: string;
}

export interface BenchFile {
  date: string;
  machine: string;
  chromium: string;
  results: AppResult[];
}
