<script lang="ts">
  import { FOSSIL_CARD, type Evidence } from '@antartida/core';
  import { focusReturn, html } from '../actions.ts';
  import Chip from '../Chip.svelte';
  let { evidence, found, actionLabel, onAction, onClose }: {
    evidence: Evidence;
    found: number;
    actionLabel: string;
    onAction: () => void;
    onClose: () => void;
  } = $props();
  const art = $derived(FOSSIL_CARD[evidence.kind]);
</script>

<div class="modal">
  <div class="scrim" onclick={onClose} role="presentation"></div>
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role (dialog markup from the handoff) -->
  <section
    class="mcard"
    role="dialog"
    aria-modal="true"
    aria-labelledby="card-title"
    tabindex="-1"
    use:focusReturn={undefined}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div class="row" style="justify-content: space-between; align-items: center;">
      <span class="anno">hallazgo {found} de 3</span>
      <Chip kind="sim">Simulación educativa</Chip>
    </div>
    <div class="art"><svg viewBox={art.viewBox} aria-hidden="true" focusable="false" use:html={art.body}></svg></div>
    <h2 id="card-title">{evidence.name}</h2>
    <div class="blk">
      <div class="chips"><Chip kind="sim">Lo que observás</Chip></div>
      <p>{evidence.obs}</p>
    </div>
    <div class="blk">
      <div class="chips"><Chip kind="real">Dato real · a completar</Chip></div>
      <p>[Contenido provisional] Qué es este resto, qué edad tiene y en qué capa de roca se encontró se completa cuando se elija el hallazgo real.</p>
      <p class="small" style="margin-top: 4px;">Fuente: [Fuente a definir]</p>
    </div>
    <div class="row" style="margin-top: 14px;">
      <button type="button" class="btn primary" style="flex: 1;" onclick={onAction}>{actionLabel}</button>
    </div>
  </section>
</div>
