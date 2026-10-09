import { test, expect, only, overflow, scrollThrough } from './fixtures.js';

const PAGES = [
  ['home', './'],
  ['work page', 'work/plan-karo-chalo/'],
  ['read', 'read/'],
];

async function expectNoOverflow(page, label) {
  const top = await overflow(page);
  expect(top.scrollWidth, `${label} at load: ${JSON.stringify(top)}`).toBeLessThanOrEqual(top.innerWidth);
  await scrollThrough(page, 60);
  await page.waitForTimeout(500);
  const end = await overflow(page);
  expect(end.scrollWidth, `${label} after scrolling: ${JSON.stringify(end)}`).toBeLessThanOrEqual(end.innerWidth);
}

test.describe('layout', () => {
  for (const [name, path] of PAGES) {
    test(`${name}: no horizontal overflow at the project viewport`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      const vw = page.viewportSize().width;
      await expectNoOverflow(page, `${name} @${vw}px`);
    });
  }

  test('no horizontal overflow at 360 px wide', async ({ page }, testInfo) => {
    only(testInfo, 'mobile');
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 360, height: 740 });
    for (const [name, path] of PAGES) {
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      await expectNoOverflow(page, `${name} @360px`);
    }
  });
});

test.describe('2D fallback tiers', () => {
  test('reduced motion gets the static route map and no 3D', async ({ page }, testInfo) => {
    only(testInfo, 'reduced');
    await page.goto('./', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-tier', 'static');
    await expect(page.locator('.route-map')).toHaveCount(1, { timeout: 10_000 });
    await expect(page.locator('.route-map')).toHaveClass(/\broute-map--static\b/);
    await page.waitForTimeout(2000);
    await expect(page.locator('html')).not.toHaveClass(/\bhas-3d\b/);
    expect(await page.evaluate(() => typeof window.__flight)).toBe('undefined');
  });

  test('reduced motion lays every card out in normal flow, all visible without scrolling', async ({ page }, testInfo) => {
    only(testInfo, 'reduced');
    await page.goto('./', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-tier', 'static');
    const items = await page.$$eval('#journey .seg--stop .card, #journey .leg-caption, #journey .thesis .line', (els) =>
      els.map((el) => {
        const cs = getComputedStyle(el);
        return { id: el.closest('.seg')?.id, opacity: Number(cs.opacity), position: cs.position };
      })
    );
    expect(items.length).toBeGreaterThanOrEqual(11);
    const hidden = items.filter((i) => i.opacity < 1);
    expect(hidden, 'cards still hidden in the static tier').toEqual([]);
    const sticky = items.filter((i) => i.position === 'sticky');
    expect(sticky, 'cards still sticky (scroll theatre) in the static tier').toEqual([]);
  });

  test('?tier=lite on desktop gets the animated route map and no 3D', async ({ page, errors }, testInfo) => {
    only(testInfo, 'desktop');
    await page.goto('./?tier=lite', { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveAttribute('data-tier', 'lite');
    await expect(page.locator('.route-map')).toHaveCount(1, { timeout: 10_000 });
    await expect(page.locator('.route-map')).not.toHaveClass(/\broute-map--static\b/);
    await page.waitForTimeout(3000);
    await expect(page.locator('html')).not.toHaveClass(/\bhas-3d\b/);
    expect(await page.evaluate(() => typeof window.__flight)).toBe('undefined');
    // The journey layer still works without 3D.
    await page.locator('#jamshedpur').evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect.poll(() => page.locator('#hud-year').getAttribute('data-value'), { timeout: 4000 }).toBe('2022');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
