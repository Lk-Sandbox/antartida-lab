import type { Action } from 'svelte/action';

/** Sets innerHTML (works inside <svg>, unlike {@html} in some namespaces). */
export const html: Action<Element, string> = (node, value) => {
  node.innerHTML = value;
  return { update: (v: string) => void (node.innerHTML = v) };
};

/**
 * Focuses the first `initial` element on mount; on destroy, returns focus to whatever had it
 * before (or `fallback` if that element is gone).
 */
export const focusReturn: Action<HTMLElement, { initial?: string; fallback?: () => HTMLElement | null | undefined } | undefined> = (
  node,
  options,
) => {
  const previous = document.activeElement as HTMLElement | null;
  node.querySelector<HTMLElement>(options?.initial ?? 'button')?.focus();
  return {
    destroy() {
      const target = previous && previous !== document.body && previous.isConnected ? previous : options?.fallback?.();
      target?.focus();
    },
  };
};
