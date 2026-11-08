<script module lang="ts">
  export type Phase = 'idle' | 'dive' | 'fade' | 'ret';
</script>

<script lang="ts">
  import { onDestroy, onMount, tick, untrack } from 'svelte';
  import {
    DRAG_THRESHOLD, EXPEDITION_POINT, HOME, MAP_OCEAN, ZOOM_MS,
    buildMarkers, diveView, geometry, keyView, layerTransform, loadMapLand, panBy, zoomAround, zoomCenter,
    type MapPoint, type Marker, type Size, type View,
  } from '@antartida/core';
  import { html } from '../actions.ts';
  import Icon from '../Icon.svelte';
  import ExplorationLog from './ExplorationLog.svelte';
  import Legend from './Legend.svelte';
  import ListView from './ListView.svelte';
  import PointSheet from './PointSheet.svelte';

  let { phase, explored, toast, legend, focusExpedition, onToggleLegend, onStart }: {
    phase: Phase;
    explored: boolean;
    toast: string;
    legend: boolean;
    focusExpedition: boolean;
    onToggleLegend: () => void;
    onStart: () => void;
  } = $props();

  const TRANSITION = { '': 'none', zoom: 'transform .45s cubic-bezier(.3,.6,.3,1)', dive: 'transform 1.5s cubic-bezier(.55,0,.3,1)' };

  let vp: HTMLDivElement;
  let size = $state<Size>({ vw: 390, vh: 844 });
  let view = $state.raw<View>(HOME);
  let anim = $state<'' | 'zoom' | 'dive'>('');
  let touched = $state(false);
  let sheet = $state.raw<MapPoint | null>(null);
  let list = $state(false);
  let land = $state('');
  let zoomTimer: ReturnType<typeof setTimeout> | undefined;

  const ptrs = new Map<number, { x: number; y: number }>();
  let dragged = false;
  let pan: { x: number; y: number; px: number; py: number } | null = null;
  let pinch: (View & { d: number }) | null = null;

  const geo = $derived(geometry(size));
  const markers = $derived(buildMarkers(size, view, explored));

  onMount(() => {
    const measure = () => {
      const r = vp.getBoundingClientRect();
      if (r.width > 0 && (Math.abs(r.width - size.vw) > 1 || Math.abs(r.height - size.vh) > 1)) size = { vw: r.width, vh: r.height };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    let alive = true;
    loadMapLand().then((h) => alive && (land = h));
    if (focusExpedition) tick().then(() => vp.querySelector<HTMLElement>('.mk.ta, .mk.has-a')?.focus());
    return () => {
      alive = false;
      ro.disconnect();
    };
  });
  onDestroy(() => clearTimeout(zoomTimer));

  $effect(() => {
    if (phase !== 'dive' && phase !== 'fade') return;
    untrack(() => {
      sheet = null;
      list = false;
      if (phase === 'fade') return;
      anim = 'dive';
      view = diveView(size, EXPEDITION_POINT.x, EXPEDITION_POINT.y);
    });
  });

  function animateTo(next: View) {
    view = next;
    anim = 'zoom';
    touched = true;
    clearTimeout(zoomTimer);
    zoomTimer = setTimeout(() => (anim = ''), ZOOM_MS);
  }

  const rel = (e: { clientX: number; clientY: number }) => {
    const r = vp.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function setLive(next: View) {
    view = next;
    anim = '';
    touched = true;
  }

  function onDown(e: PointerEvent) {
    if (phase !== 'idle') return;
    const p = rel(e);
    ptrs.set(e.pointerId, p);
    if (ptrs.size === 1) {
      dragged = false;
      pan = { ...p, px: view.px, py: view.py };
    } else if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), ...view };
      dragged = true;
    }
  }

  function onMove(e: PointerEvent) {
    if (!ptrs.has(e.pointerId)) return;
    const p = rel(e);
    ptrs.set(e.pointerId, p);
    if (ptrs.size >= 2 && pinch) {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      setLive(zoomAround(size, pinch, (a.x + b.x) / 2, (a.y + b.y) / 2, pinch.k * (d / Math.max(1, pinch.d))));
      return;
    }
    if (!pan) return;
    const dx = p.x - pan.x, dy = p.y - pan.y;
    if (!dragged && Math.hypot(dx, dy) > DRAG_THRESHOLD) dragged = true;
    if (dragged) setLive(panBy(size, { k: view.k, px: pan.px, py: pan.py }, dx, dy));
  }

  function onUp(e: PointerEvent) {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (ptrs.size === 1) {
      const [p] = [...ptrs.values()];
      pan = { ...p, px: view.px, py: view.py };
    }
    if (ptrs.size === 0) pan = null;
  }

  function onWheel(e: WheelEvent) {
    if (phase !== 'idle') return;
    const p = rel(e);
    setLive(zoomAround(size, view, p.x, p.y, view.k * (e.deltaY < 0 ? 1.18 : 1 / 1.18)));
  }

  function onKey(e: KeyboardEvent) {
    if (e.target !== vp) return;
    const next = keyView(size, view, e.key);
    if (next) {
      e.preventDefault();
      animateTo(next);
    }
  }

  function openPoint(p: MapPoint) {
    if (p.tier === 'A') onStart();
    else {
      sheet = p;
      touched = true;
    }
  }

  function onPick(m: Marker) {
    if (dragged) return;
    if (m.kind === 'cluster') animateTo(m.target);
    else openPoint(m.point);
  }

  async function pickFromList(p: MapPoint) {
    list = false;
    // Let the list return focus before the sheet takes it.
    await tick();
    openPoint(p);
  }

  const stageCls = $derived('stage' + (phase === 'dive' ? ' dive' : phase === 'fade' ? ' fade' : phase === 'ret' ? ' ret' : ''));
</script>

<div class="stagewrap">
  <div class={stageCls}>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions (focusable role="application" map, as in the handoff) -->
    <div
      class="vp"
      bind:this={vp}
      tabindex="0"
      role="application"
      aria-label="Mapa de la Antártida. Arrastrá para mover, usá las flechas para desplazarte y las teclas más y menos para acercar."
      onpointerdown={onDown}
      onpointermove={onMove}
      onpointerup={onUp}
      onpointercancel={onUp}
      onpointerleave={onUp}
      onwheel={onWheel}
      onkeydown={onKey}
    >
      <div class="layer" style:width="{geo.S}px" style:height="{geo.S}px" style:transform={layerTransform(geo, view)} style:transition={TRANSITION[anim]}>
        <svg viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
          <g use:html={MAP_OCEAN}></g>
          <g use:html={land}></g>
        </svg>
      </div>
      <div class="ov" class:zooming={anim === 'zoom'} class:hide={phase === 'dive'}>
        {#each markers as m (m.key)}
          <button type="button" class={m.cls} style:left="{m.left}px" style:top="{m.top}px" onclick={() => onPick(m)} aria-label={m.aria}>
            <span class="dot">
              {#if m.kind === 'cluster'}{m.count}{/if}
              {#if m.kind === 'point' && m.pulse}<span class="pulse"></span>{/if}
              {#if m.kind === 'point' && m.check}<Icon name="check" />{/if}
            </span>
            {#if m.kind === 'point' && m.label}
              <span class="mlabel"><strong>{m.label.title}</strong><span>{m.label.sub}</span></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <svg class="grain" aria-hidden="true" focusable="false"><rect width="100%" height="100%" filter="url(#paperf)" /></svg>

    <header class="top">
      <div class="brand">
        <h1>Antártida por descubrir</h1>
        <p>cuaderno de campo · desde Ushuaia</p>
      </div>
      <ExplorationLog {explored} />
    </header>

    {#if !touched && phase === 'idle'}<div class="hint">arrastrá para mover · pellizcá para acercar</div>{/if}
    {#if toast}<div class="toast" role="status">{toast}</div>{/if}

    <div class="bottom">
      <div class="leftcol">
        <Legend open={legend} onToggle={onToggleLegend} />
        <button type="button" class="btn" onclick={() => { sheet = null; list = true; }}>
          <Icon name="list" cls="ico" />
          Ver como lista
        </button>
      </div>
      <div class="zoom">
        <button type="button" class="iconbtn" onclick={() => animateTo(zoomCenter(size, view, 1.6))} aria-label="Acercar"><Icon name="plus" /></button>
        <button type="button" class="iconbtn" onclick={() => animateTo(zoomCenter(size, view, 1 / 1.6))} aria-label="Alejar"><Icon name="minus" /></button>
        <button type="button" class="iconbtn" onclick={() => animateTo(HOME)} aria-label="Ver todo el continente"><Icon name="reset" /></button>
      </div>
    </div>

    {#if sheet}
      <PointSheet point={sheet} onClose={() => (sheet = null)} fallbackFocus={() => vp} />
    {/if}
    {#if list}
      <ListView {explored} onClose={() => (list = false)} onPick={pickFromList} />
    {/if}
  </div>
  <div class="veil" class:on={phase === 'dive'}></div>
</div>
