<script lang="ts">
  import { SCENE_ROCK, SCENE_SEA, SCENE_SKY } from '@antartida/core';
  import { html } from '../actions.ts';
  let { nx, ny }: { nx: number; ny: number } = $props();
</script>

<div class="scene" aria-hidden="true">
  <div class="pl" style:transform="translate3d({-nx * 4}px, {-ny * 3}px, 0)">
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" use:html={SCENE_SKY}></svg>
  </div>
  <div class="pl" style:transform="translate3d({-nx * 9}px, {-ny * 5}px, 0)">
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" use:html={SCENE_SEA}></svg>
  </div>
  <div class="pl" style:transform="translate3d({-nx * 15}px, {-ny * 7}px, 0)">
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" use:html={SCENE_ROCK}></svg>
  </div>
  <svg class="grain" aria-hidden="true" focusable="false"><rect width="100%" height="100%" filter="url(#fibers)" opacity="0.6" /></svg>
</div>
