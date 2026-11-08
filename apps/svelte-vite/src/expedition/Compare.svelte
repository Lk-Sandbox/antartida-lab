<script lang="ts">
  import { EV, FOSSIL_THUMB, OPTS } from '@antartida/core';
  import { html } from '../actions.ts';
  import Chip from '../Chip.svelte';
  let { answer, onPick }: { answer: number; onPick: (i: number) => void } = $props();
</script>

<div class="page">
  <div class="chips"><Chip kind="sim">Simulación educativa</Chip><Chip kind="prov">[Contenido provisional]</Chip></div>
  <h2 style="margin-top: 8px;" tabindex="-1" data-step-focus>Comparar evidencias</h2>
  <p class="small">Mirá las tres juntas. Deslizá para ver todas.</p>
  <div class="cards">
    {#each EV as e (e.kind)}
      <article class="ecard">
        <div class="art"><svg viewBox={FOSSIL_THUMB[e.kind].viewBox} aria-hidden="true" focusable="false" use:html={FOSSIL_THUMB[e.kind].body}></svg></div>
        <h3>{e.name}</h3>
        <p class="small" style="margin: 0;">{e.obs}</p>
        <div class="chips"><Chip kind="real">Dato real · a completar</Chip></div>
        <p class="small" style="margin: 0;">[Contenido provisional] · [Fuente a definir]</p>
      </article>
    {/each}
  </div>
  <h3 style="margin-top: 6px;">¿Qué pueden tener en común estos tres restos?</h3>
  <div class="opts" role="group" aria-label="Elegí una hipótesis">
    {#each OPTS as o, i}
      <button type="button" class="opt" class:sel={answer === i} aria-pressed={answer === i} onclick={() => onPick(i)}>{o.text}</button>
    {/each}
  </div>
  {#if answer >= 0}
    <div class="fb" role="status">{OPTS[answer].fb} <span class="small">[Contenido provisional]</span></div>
  {/if}
</div>
