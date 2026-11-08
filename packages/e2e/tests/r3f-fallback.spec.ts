import { expect, test } from '@playwright/test';

test.skip(!process.cwd().endsWith('r3f-3d'), 'only the 3D app has a WebGL fallback');

test('without WebGL the list is the whole interface and the flow still works', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      return /webgl/.test(type) ? null : (original as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof original;
  });
  await page.goto('/');
  const list = page.getByRole('dialog', { name: 'Todos los puntos' });
  await expect(list).toBeVisible();
  await expect(list.getByRole('button', { name: 'Ver mapa' })).toHaveCount(0);
  await expect(page.locator('canvas')).toHaveCount(0);
  await list.getByRole('button', { name: /Fósiles/ }).click();
  await expect(page.getByRole('heading', { name: '¿Cómo era la Antártida antes del hielo?' })).toBeVisible();
});
