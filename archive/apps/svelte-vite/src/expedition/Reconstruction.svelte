<script lang="ts">
  import { RECONSTRUCTION_SVG } from '@antartida/core';
  import { html } from '../actions.ts';
  import Chip from '../Chip.svelte';
</script>

<div class="page">
  <h2 tabindex="-1" data-step-focus>Conclusión</h2>
  <p class="small">Así podría haber sido este lugar. Cada parte tiene una etiqueta para saber de dónde sale.</p>
  <div class="recon">
    <svg viewBox="0 0 400 240" role="img" aria-label="Reconstrucción artística: costa templada con bosque, playa y mar poco profundo" use:html={RECONSTRUCTION_SVG}></svg>
    <span class="stamp chip art">Reconstrucción artística</span>
    <span class="pin" style="left: 24%; top: 84%;" aria-hidden="true">A</span>
    <span class="pin" style="left: 64%; top: 34%;" aria-hidden="true">B</span>
    <span class="pin" style="left: 48%; top: 70%;" aria-hidden="true">C</span>
  </div>
  <div class="layers">
    <div class="lyr ev">
      <div class="lh">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="#A4471F" stroke-width="2.2" fill="none" /><path d="M16 16l4.5 4.5" stroke="#A4471F" stroke-width="2.4" stroke-linecap="round" /></svg>
        <b>Evidencia</b>
      </div>
      <p>Lo que se encontró: los restos A (espiral), B (hoja) y C (hueso). Están marcados con su letra en la imagen.</p>
      <div class="chips" style="margin-top: 6px;"><Chip kind="real">Dato real · a completar</Chip></div>
    </div>
    <div class="lyr in">
      <div class="lh">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" stroke="#1E3E5C" stroke-width="2" fill="none" stroke-linejoin="round" /></svg>
        <b>Interpretación</b>
      </div>
      <p>[Contenido provisional] Si aparecen juntos restos de mar y de plantas, la zona pudo tener costa, vegetación y un clima sin hielo permanente.</p>
    </div>
    <div class="lyr ar">
      <div class="lh">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20c2-1 3-3 3-5l9-9 3 3-9 9c-2 0-4 1-5 2z" stroke="#8A5A14" stroke-width="2" fill="none" stroke-linejoin="round" /></svg>
        <b>Reconstrucción artística</b>
      </div>
      <p>La ilustración es una forma de imaginar el lugar. Colores, plantas y paisaje son una propuesta, no una foto del pasado.</p>
    </div>
  </div>
  <p class="small" style="margin-top: 10px;">Fuentes: [Fuente a definir]</p>
</div>
