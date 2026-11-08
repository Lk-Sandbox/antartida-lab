<script lang="ts">
  import type { Snippet } from 'svelte';
  let { kind, children }: { kind: 'real' | 'sim' | 'art' | 'prov'; children: Snippet } = $props();
</script>

<span class="chip {kind}">{@render children()}</span>
