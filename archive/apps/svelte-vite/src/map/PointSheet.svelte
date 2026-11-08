<script lang="ts">
  import { TIER, type MapPoint } from '@antartida/core';
  import { focusReturn } from '../actions.ts';
  import Icon from '../Icon.svelte';
  let { point, onClose, fallbackFocus }: { point: MapPoint; onClose: () => void; fallbackFocus: () => HTMLElement | null } = $props();
</script>

<div class="scrim" onclick={onClose} role="presentation"></div>
<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role (dialog markup from the handoff) -->
<section
  class="sheet"
  role="dialog"
  aria-modal="true"
  aria-labelledby="sheet-title"
  tabindex="-1"
  use:focusReturn={{ fallback: fallbackFocus }}
  onkeydown={(e) => e.key === 'Escape' && onClose()}
>
  <div class="grab"></div>
  <div class="row" style="justify-content: space-between; align-items: center;">
    <span class="tag t{point.tier.toLowerCase()}">{TIER[point.tier]}</span>
    <button type="button" class="iconbtn" onclick={onClose} aria-label="Cerrar ficha"><Icon name="close" /></button>
  </div>
  <h2 id="sheet-title">{point.title}</h2>
  <p class="place">{point.place}</p>
  <div class="q">
    <p>{point.q}</p>
    <small>[Pregunta provisional] · [Contenido provisional]</small>
  </div>
  <p class="anno">Esta expedición todavía no está disponible. Se suma en una próxima etapa.</p>
  <div class="row" style="margin-top: 12px;">
    <button type="button" class="btn" onclick={onClose}>Volver al mapa</button>
  </div>
</section>
