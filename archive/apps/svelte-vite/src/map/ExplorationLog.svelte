<script lang="ts">
  let { explored }: { explored: boolean } = $props();
  const text = $derived(explored ? '1/1' : '0/1');
</script>

<div class="reg" role="status" aria-label="Registro de exploración: {text} expediciones disponibles">
  <small>Registro de exploración</small>
  <b>{text} expediciones</b>
  <div class="bar"><i style:width={explored ? '100%' : '0%'}></i></div>
</div>
