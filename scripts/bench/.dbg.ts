import { chromium } from '@playwright/test';
for (const headless of [true]) for (const exe of ['/usr/bin/chromium', undefined]) {
  try {
  const b = await chromium.launch({ executablePath: exe, headless });
  const p = await b.newPage();
  await p.goto('http://localhost:5101/');
  const n = await p.evaluate(() => new Promise((r) => { let n = 0; const t = () => { n++; requestAnimationFrame(t); }; requestAnimationFrame(t); setTimeout(() => r(n), 1000); }));
  console.log(exe, b.version(), 'raf/s', n);
  await b.close();
  } catch (e) { console.log(exe, 'ERR', String(e).slice(0, 80)); }
}
