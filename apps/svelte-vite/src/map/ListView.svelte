<script lang="ts">
  import { PTS, type MapPoint, type Tier } from '@antartida/core';
  import { focusReturn } from '../actions.ts';
  let { explored, onClose, onPick }: { explored: boolean; onClose: () => void; onPick: (p: MapPoint) => void } = $props();

  const GROUPS: { tier: Tier; id: string; tag: string; label?: string; desc: string }[] = [
    { tier: 'A', id: 'g-a', tag: 'Disponible', label: 'Expediciones', desc: 'Se pueden recorrer ahora.' },
    { tier: 'B', id: 'g-b', tag: 'Ampliación prevista', desc: 'Planificadas para la próxima etapa.' },
    { tier: 'C', id: 'g-c', tag: 'Próximamente', desc: 'Ideas por explorar más adelante.' },
  ];
</script>

<div
  class="listview"
  role="dialog"
  aria-modal="true"
  aria-labelledby="list-title"
  tabindex="-1"
  use:focusReturn={undefined}
  onkeydown={(e) => e.key === 'Escape' && onClose()}
>
  <div class="inner">
    <div class="listhead">
      <h2 id="list-title">Todos los puntos</h2>
      <button type="button" class="btn" onclick={onClose}>Ver mapa</button>
    </div>
    {#each GROUPS as g (g.tier)}
      <section aria-labelledby={g.id}>
        <h3 id={g.id}><span class="tag t{g.tier.toLowerCase()}">{g.tag}</span>{g.label ? ' ' + g.label : ''}</h3>
        <p class="gdesc">{g.desc}</p>
        <ul>
          {#each PTS.filter((p) => p.tier === g.tier) as p (p.id)}
            <li>
              <button type="button" class="li" onclick={() => onPick(p)}>
                <span class="t"><strong>{p.title}</strong><span class="p">{p.place}</span></span>
                <span class="go">{g.tier === 'A' ? (explored ? 'Explorado · volver a entrar' : 'Empezar expedición') : 'Ver ficha'}</span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</div>
