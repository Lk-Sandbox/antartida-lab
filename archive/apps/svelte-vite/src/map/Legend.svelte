<script lang="ts">
  import Icon from '../Icon.svelte';
  let { open, onToggle }: { open: boolean; onToggle: () => void } = $props();
</script>

<div class="legend">
  <button type="button" class="lt" onclick={onToggle} aria-expanded={open}>
    <Icon name="legend" cls="ico" />
    Leyenda
  </button>
  {#if open}
    <ul>
      <li><span class="sw"><span class="a"></span></span><span><b>Expedición disponible</b></span></li>
      <li><span class="sw"><span class="b"></span></span><span>Ampliación prevista</span></li>
      <li><span class="sw"><span class="c"></span></span><span>Próximamente</span></li>
    </ul>
  {/if}
</div>
