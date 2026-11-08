<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { DIVE_MS, FADE_MS, RETURN_MS, RETURN_TOAST, SVG_DEFS, TOAST_MS, loadExplored, prefersReducedMotion, saveExplored } from '@antartida/core';
  import { html } from './actions.ts';
  import MapView, { type Phase } from './map/MapView.svelte';

  let screen = $state<'map' | 'exp'>('map');
  let phase = $state<Phase>('idle');
  let explored = $state(false);
  let toast = $state('');
  let legend = $state(true);
  let returned = $state(false);
  let reduced = $state(false);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const later = (name: string, fn: () => void, ms: number) => {
    clearTimeout(timers.get(name));
    timers.set(name, setTimeout(fn, ms));
  };
  const loadExpedition = () => import('./expedition/Expedition.svelte');

  onMount(() => {
    explored = loadExplored();
    reduced = prefersReducedMotion();
  });
  onDestroy(() => timers.forEach(clearTimeout));

  function start() {
    if (phase !== 'idle') return;
    toast = '';
    void loadExpedition();
    phase = reduced ? 'fade' : 'dive';
    later('enter', () => {
      screen = 'exp';
      phase = 'idle';
    }, reduced ? FADE_MS : DIVE_MS);
  }

  function leave(done: boolean) {
    if (done) {
      explored = true;
      saveExplored(true);
    }
    screen = 'map';
    phase = 'ret';
    returned = true;
    toast = done ? RETURN_TOAST : '';
    later('ret', () => (phase = 'idle'), RETURN_MS);
    if (done) later('toast', () => (toast = ''), TOAST_MS);
  }
</script>

<div class="app">
  <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
    <defs use:html={SVG_DEFS}></defs>
  </svg>
  {#if screen === 'map'}
    <MapView {phase} {explored} {toast} {legend} focusExpedition={returned} onToggleLegend={() => (legend = !legend)} onStart={start} />
  {:else}
    {#await loadExpedition() then { default: Expedition }}
      <Expedition {reduced} onLeave={leave} />
    {/await}
  {/if}
</div>
