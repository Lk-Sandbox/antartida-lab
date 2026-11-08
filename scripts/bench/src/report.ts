import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { NOTES } from './notes.ts';
import type { AppResult, BenchFile, Interaction, Size } from './types.ts';

const A11Y_MIN = 95;
const JS_MAX_GZIP = 80 * 1024;

const kb = (n: number) => (Number.isFinite(n) ? (n / 1024).toFixed(1) : '—');
const num = (n: number, unit = '') => (Number.isFinite(n) ? `${n}${unit}` : '—');
const ok = (pass: boolean) => (pass ? 'sí' : '**no**');

function table(head: string[], rows: string[][]) {
  return [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

const sizeCells = (s: Size | undefined) => (s ? [kb(s.raw), kb(s.gzip), kb(s.brotli)] : ['—', '—', '—']);
const inter = (i: Interaction | undefined) =>
  i ? `${i.longTasks} (${i.longTaskMs} ms) · ${i.longFrames}/${i.frames} · p95 ${i.p95Frame} ms` : '—';

export function renderReport(file: BenchFile): string {
  const rs: AppResult[] = file.results;
  const valid = rs.filter((r) => !r.error);
  const out: string[] = [];
  out.push('# Comparación de stacks', '');
  out.push(
    '> Generado por `pnpm bench` (`scripts/bench`). No editar a mano: los textos de cada stack salen de `scripts/bench/src/notes.ts`.',
    '',
    `Fecha: ${file.date.slice(0, 10)} · Máquina: ${file.machine} · ${file.chromium}`,
    '',
  );

  out.push('## Criterios del handoff', '');
  out.push(table(
    ['App', 'Accesibilidad ≥ 95', 'JS inicial < 80 kB gzip', 'E2E'],
    rs.map((r) => [
      r.app,
      r.error ? '—' : `${ok(r.lighthouse.accessibility >= A11Y_MIN)} (${num(r.lighthouse.accessibility)})`,
      r.error ? '—' : `${ok(r.jsInitial.gzip < JS_MAX_GZIP)} (${kb(r.jsInitial.gzip)} kB)`,
      'ver `pnpm e2e`',
    ]),
  ), '');

  out.push('## Peso (kB)', '');
  out.push('JS inicial = scripts del HTML (y de las islas de Astro) más todo lo que importan estáticamente. Los `import()` diferidos (costa, expedición, 3D) quedan fuera.', '');
  out.push(table(
    ['App', 'JS inicial raw', 'gzip', 'brotli', 'JS total raw', 'gzip', 'brotli', 'CSS raw', 'gzip', 'brotli'],
    valid.map((r) => [r.app, ...sizeCells(r.jsInitial), ...sizeCells(r.jsTotal), ...sizeCells(r.css)]),
  ), '');

  out.push('## Build y red', '');
  out.push(table(
    ['App', 'Build (s)', 'Requests en la carga'],
    valid.map((r) => [r.app, (r.buildMs / 1000).toFixed(1), num(r.requests)]),
  ), '');

  out.push('## Lighthouse (mobile, throttling por defecto, mediana de 3)', '');
  out.push(table(
    ['App', 'Performance', 'Accesibilidad', 'LCP (ms)', 'TBT (ms)', 'CLS'],
    valid.map((r) => [r.app, num(r.lighthouse.performance), num(r.lighthouse.accessibility), num(r.lighthouse.lcp), num(r.lighthouse.tbt), num(r.lighthouse.cls)]),
  ), '');

  out.push('## Interacción con CPU 4x (390 px, táctil)', '');
  out.push('Formato: tareas largas (tiempo total) · frames > 50 ms / frames medidos · p95 del frame.', '');
  out.push(table(
    ['App', 'Pan', 'Pinch', 'Bajada a la expedición'],
    valid.map((r) => [r.app, inter(r.interaction?.pan), inter(r.interaction?.pinch), inter(r.interaction?.dive)]),
  ), '');

  const failed = rs.filter((r) => r.error);
  if (failed.length) {
    out.push('## Errores del benchmark', '');
    for (const r of failed) out.push(`- **${r.app}**: \`${r.error!.split('\n')[0]}\``);
    out.push('');
  }

  out.push('## Capturas', '');
  out.push('En `docs/capturas/<app>/`: `mapa`, `ficha`, `lista`, `excavacion` y `conclusion`, a 390 y 1440 px.', '');

  out.push('## Ventajas y desventajas', '');
  for (const r of rs) {
    const note = NOTES[r.app];
    if (!note) continue;
    out.push(`### ${r.app}`, '', note.trim(), '');
  }
  return out.join('\n');
}

export function writeReport(file: BenchFile, target: string) {
  writeFileSync(target, renderReport(file));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const root = fileURLToPath(new URL('../../../', import.meta.url));
  const file: BenchFile = JSON.parse(readFileSync(join(root, 'docs/bench/results.json'), 'utf8'));
  writeReport(file, join(root, 'docs/COMPARACION.md'));
}
