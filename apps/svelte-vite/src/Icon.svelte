<script lang="ts">
  import { html } from './actions.ts';
  import { ICONS } from './icons.ts';
  let { name, cls }: { name: keyof typeof ICONS; cls?: string } = $props();
</script>

<svg class={cls} viewBox={name === 'check' ? '0 0 14 14' : '0 0 24 24'} aria-hidden="true" use:html={ICONS[name]}></svg>
