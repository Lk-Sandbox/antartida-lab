<script lang="ts">
  import { BRUSH_INTERVAL, DIG_ROCK, DIG_ZONES, MAX_PUFFS, PASSES_PER_SPOT, PUFF_INTERVAL, SPOTS, spotAt } from '@antartida/core';
  import { html } from '../actions.ts';

  let { active, prog, paused, offset, onBrush }: {
    active: boolean;
    prog: readonly number[];
    paused: boolean;
    offset: string;
    onBrush: (spot: number) => void;
  } = $props();

  let el: HTMLDivElement;
  let puffs = $state<{ id: number; left: number; top: number }[]>([]);
  let brushing = false;
  let lastPuff = 0, puffId = 0;
  const lastSpot = [0, 0, 0];

  function brushAt(e: PointerEvent) {
    if (!active || paused) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const now = Date.now();
    if (now - lastPuff > PUFF_INTERVAL) {
      lastPuff = now;
      puffs = [...puffs, { id: ++puffId, left: x, top: y }].slice(-MAX_PUFFS);
    }
    const hit = spotAt(x, y, r.width, r.height, prog);
    if (hit >= 0 && now - lastSpot[hit] > BRUSH_INTERVAL) {
      lastSpot[hit] = now;
      if (prog[hit] + 1 >= PASSES_PER_SPOT) brushing = false;
      onBrush(hit);
    }
  }

  const found = (i: number) => prog[i] >= PASSES_PER_SPOT;
  const cover = (i: number) => Math.max(0, 1 - prog[i] / PASSES_PER_SPOT);
  const stop = () => (brushing = false);
</script>

<div
  class="dig"
  class:on={active}
  bind:this={el}
  style:transform="translateX(-50%) {offset}"
  role="presentation"
  onpointerdown={(e) => { if (!active) return; brushing = true; brushAt(e); }}
  onpointermove={(e) => { if (brushing) brushAt(e); }}
  onpointerup={stop}
  onpointercancel={stop}
  onpointerleave={stop}
>
  <svg class="rock" viewBox="0 0 400 300" role="img" aria-label="Afloramiento rocoso con capas de sedimento">
    <g use:html={DIG_ROCK}></g>
    <g filter="url(#wc)" fill="#B89466">
      {#each DIG_ZONES as z, i}<ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} opacity={cover(i)} />{/each}
    </g>
    <g fill="#8F6C45" opacity="0.5">
      {#each DIG_ZONES as z, i}{#each z.dots as [cx, cy, r]}<circle {cx} {cy} {r} opacity={cover(i)} />{/each}{/each}
    </g>
    <g fill="none" stroke="#1F2A36" stroke-width="1.4" stroke-dasharray="3 5" filter="url(#ink)">
      {#each DIG_ZONES as z, i}<ellipse cx={z.cx} cy={z.cy} rx={z.hx} ry={z.hy} opacity={active && !found(i) ? 0.75 : 0} />{/each}
    </g>
    <g fill="none" stroke="#C0862F" stroke-width="3" filter="url(#ink)">
      {#each DIG_ZONES as z, i}<ellipse cx={z.cx} cy={z.cy} rx={z.hx} ry={z.hy} opacity={found(i) ? 1 : 0} />{/each}
    </g>
    <g font-family="Caveat, cursive" font-size="16" fill="#1F2A36">
      {#each DIG_ZONES as z, i}<text x={z.label.x} y={z.label.y} opacity={found(i) ? 1 : 0}>{z.label.text}</text>{/each}
    </g>
  </svg>
  {#each puffs as p (p.id)}<span class="puff" style:left="{p.left}px" style:top="{p.top}px"></span>{/each}
  {#if active}
    {#each SPOTS as s, i}
      <button
        type="button"
        class="spot"
        style:left="{s.x * 100}%"
        style:top="{s.y * 100}%"
        aria-label={'Zona de excavación ' + (i + 1) + (found(i) ? ': resto encontrado' : ': limpiar sedimento, ' + prog[i] + ' de 4 pasadas')}
        onclick={(e) => { if (e.detail === 0) onBrush(i); }}
      ></button>
    {/each}
  {/if}
</div>
