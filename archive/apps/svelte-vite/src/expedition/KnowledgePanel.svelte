<script lang="ts">
  import { KNOW, KNOW_CHIPS, LEVELS, STEP_NAMES, type Step } from '@antartida/core';
  import { focusReturn } from '../actions.ts';
  import Chip from '../Chip.svelte';
  import Icon from '../Icon.svelte';
  let { step, level, onLevel, onClose, fallbackFocus }: {
    step: Step;
    level: number;
    onLevel: (level: number) => void;
    onClose: () => void;
    fallbackFocus: () => HTMLElement | null;
  } = $props();
  const chip = $derived(KNOW_CHIPS[level]);
</script>

<!-- Non-modal: Escape is handled by the expedition. -->
<aside class="kp" id="kpanel" aria-label="Saber más" use:focusReturn={{ initial: '.tab', fallback: fallbackFocus }}>
  <div class="kh">
    <b>Saber más · {STEP_NAMES[step - 1]}</b>
    <button type="button" class="iconbtn" onclick={onClose} aria-label="Cerrar panel"><Icon name="close" /></button>
  </div>
  <div class="tabs" role="group" aria-label="Nivel de detalle">
    {#each LEVELS as l, i (l.label)}
      <button type="button" class="tab" aria-pressed={level === i} onclick={() => onLevel(i)}>{l.label}<small>{l.sub}</small></button>
    {/each}
  </div>
  <div class="kb" aria-live="polite">
    <div class="chips"><span class={chip.cls}>{chip.text}</span><Chip kind="prov">[Contenido provisional]</Chip></div>
    <p>{KNOW[step - 1][level]}</p>
    {#if level === 2}
      <p class="small"><b>Referencias de etiquetas:</b></p>
      <div class="chips" style="margin-top: 4px;">
        <Chip kind="real">Dato real</Chip><Chip kind="sim">Simulación educativa</Chip><Chip kind="art">Reconstrucción artística</Chip>
      </div>
      <p class="small">Fuentes: [Fuente a definir]</p>
    {/if}
  </div>
</aside>
