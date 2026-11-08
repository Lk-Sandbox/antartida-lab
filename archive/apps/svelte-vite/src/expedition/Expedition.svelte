<script lang="ts">
  import {
    EV, SEAL_SVG, STEP_NAMES, canAdvance, cardButtonLabel, expeditionReducer, foundCount, initialExpedition, primaryLabel,
    type ExpeditionAction,
  } from '@antartida/core';
  import { html } from '../actions.ts';
  import Chip from '../Chip.svelte';
  import Icon from '../Icon.svelte';
  import Compare from './Compare.svelte';
  import DigSite from './DigSite.svelte';
  import EvidenceCard from './EvidenceCard.svelte';
  import KnowledgePanel from './KnowledgePanel.svelte';
  import Reconstruction from './Reconstruction.svelte';
  import Scene from './Scene.svelte';

  let { reduced, onLeave }: { reduced: boolean; onLeave: (done: boolean) => void } = $props();

  let s = $state.raw(initialExpedition);
  const dispatch = (a: ExpeditionAction) => (s = expeditionReducer(s, a));
  let par = $state({ nx: 0, ny: 0 });
  let root: HTMLElement;
  let panelBtn: HTMLButtonElement;

  const found = $derived(foundCount(s));
  const currentStep = $derived(s.step);
  const nx = $derived(reduced ? 0 : par.nx);
  const ny = $derived(reduced ? 0 : par.ny);

  // Move focus to where each step starts, so keyboard and screen reader users follow along.
  $effect(() => {
    const step = currentStep;
    const target = step === 2
      ? root.querySelector<HTMLElement>('.spot')
      : step === 5 ? root.querySelector<HTMLElement>('.ebar .btn.primary') : root.querySelector<HTMLElement>('[data-step-focus]');
    target?.focus();
  });

  const primary = () => (s.step === 5 ? onLeave(true) : dispatch({ type: 'next' }));

  function onMove(e: PointerEvent) {
    if (reduced) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    par = { nx: ((e.clientX - r.left) / r.width - 0.5) * 2, ny: ((e.clientY - r.top) / r.height - 0.5) * 2 };
  }

  function onKey(e: KeyboardEvent) {
    // The panel is non-modal: Escape closes it wherever focus is, unless a card (which handles Escape) is open.
    if (e.key === 'Escape' && s.panel && s.card < 0) dispatch({ type: 'closePanel' });
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions (Escape closes the non-modal panel; pointer moves drive parallax) -->
<section class="exp" aria-label="Expedición Fósiles en Isla Marambio" bind:this={root} onpointermove={onMove} onkeydown={onKey}>
  <Scene {nx} {ny} />

  {#if s.step <= 2}
    <DigSite
      active={s.step === 2}
      prog={s.prog}
      paused={s.card >= 0}
      offset="translate({-nx * 15}px, {-ny * 7}px)"
      onBrush={(spot) => dispatch({ type: 'brush', spot })}
    />
  {/if}

  <header class="etop">
    <div class="r1">
      <button type="button" class="pill" onclick={() => onLeave(false)} aria-label="Volver al mapa">
        <Icon name="back" cls="ico" />
        Mapa
      </button>
      <div class="ttl"><b>Fósiles</b><span>Isla Marambio</span></div>
      <button type="button" class="pill" bind:this={panelBtn} onclick={() => dispatch({ type: 'togglePanel' })} aria-expanded={s.panel} aria-controls="kpanel">Saber más</button>
    </div>
    <div class="steps" aria-hidden="true">
      {#each [1, 2, 3, 4, 5] as n}<i class={n < s.step ? 'done' : n === s.step ? 'cur' : ''}></i>{/each}
    </div>
    <div class="steplbl" aria-live="polite">Paso {s.step} de 5 · {STEP_NAMES[s.step - 1]}</div>
  </header>

  <div class="ebody">
    <div class="wrap">
      {#if s.step === 1}
        <div class="bigq">
          <div class="kick">Pregunta inicial</div>
          <h2 tabindex="-1" data-step-focus>¿Cómo era la Antártida antes del hielo?</h2>
          <p>Las rocas de esta isla guardan pistas. Tu tarea: encontrarlas y ver qué cuentan. <span class="small">[Contenido provisional]</span></p>
        </div>
      {:else if s.step === 2}
        <div class="dighud">
          <div class="ins">Tocá o arrastrá sobre la roca para limpiar el sedimento.</div>
          <div class="counter" aria-live="polite" aria-label="Hallazgos: {found} de 3">
            {#each [0, 1, 2] as i}<span class={s.prog[i] >= 4 ? 'f' : ''}>{s.prog[i] >= 4 ? 'ABC'[i] : '?'}</span>{/each}
          </div>
          <div class="chips" style="justify-content: center; margin-top: 8px;"><Chip kind="sim">Simulación educativa</Chip></div>
        </div>
      {:else if s.step === 3}
        <Compare answer={s.answer} onPick={(option) => dispatch({ type: 'pick', option })} />
      {:else if s.step === 4}
        <Reconstruction />
      {:else}
        <div class="page done5">
          <svg class="seal" viewBox="0 0 120 120" aria-hidden="true" use:html={SEAL_SVG}></svg>
          <div class="anno">expedición registrada</div>
          <h2>Fósiles · Isla Marambio</h2>
          <p>Encontraste 3 restos, los comparaste y viste una reconstrucción posible del ambiente antes del hielo.</p>
          <p class="small">Al volver, el punto queda marcado como explorado y tu registro pasa a 1/1.</p>
        </div>
      {/if}
    </div>
  </div>

  <div class="ebar">
    {#if s.step >= 2 && s.step <= 4}
      <button type="button" class="btn ghost" onclick={() => dispatch({ type: 'back' })}>Atrás</button>
    {/if}
    <button type="button" class="btn primary" onclick={primary} disabled={s.step !== 5 && !canAdvance(s)}>{primaryLabel(s)}</button>
  </div>

  {#if s.panel}
    <KnowledgePanel
      step={s.step}
      level={s.level}
      onLevel={(level) => dispatch({ type: 'level', level })}
      onClose={() => dispatch({ type: 'closePanel' })}
      fallbackFocus={() => panelBtn}
    />
  {/if}

  {#if s.card >= 0}
    <EvidenceCard
      evidence={EV[s.card]}
      {found}
      actionLabel={cardButtonLabel(s)}
      onAction={() => dispatch({ type: 'cardAction' })}
      onClose={() => dispatch({ type: 'closeCard' })}
    />
  {/if}
</section>
