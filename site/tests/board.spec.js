import { test, expect, only, boardText } from './fixtures.js';
import { PRODUCTS } from '../src/content.js';

// The board sets itself up lazily as it nears the viewport (flap cells, then
// the boarding-pass click handler). Wait for that before clicking a row.
async function boardReady(page) {
  await page.waitForFunction(() => document.querySelector('#board [data-flap].is-flap'), null, { timeout: 15_000 });
  await page.waitForTimeout(200);
}

test.describe('departures board', () => {
  test('7 rows in product order with links and spoken labels', async ({ page }) => {
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    const rows = page.locator('#board a.flight');
    await expect(rows).toHaveCount(7);
    expect(PRODUCTS).toHaveLength(7);
    for (const [i, p] of PRODUCTS.entries()) {
      const a = rows.nth(i);
      await expect(a).toHaveAttribute('data-slug', p.slug);
      await expect(a).toHaveAttribute('href', `/my-portfolio/work/${p.slug}/`);
      const label = await a.getAttribute('aria-label');
      expect(label, `aria-label of row ${i + 1}`).toContain(p.name);
      expect(label).toContain(p.code);
      await expect(a).toHaveAccessibleName(new RegExp(p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('flaps settle on each row\'s code, destination and status', async ({ page }) => {
    await page.goto('./', { waitUntil: 'load' });
    await page.locator('#board .board').evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const expected = PRODUCTS.map((p) => ({ slug: p.slug, code: p.code, board: p.board, status: p.status }));
    // Rows clatter in over ~2-3 s; ambient re-flips may briefly scramble one
    // field, so poll until a fully settled frame is seen.
    await expect.poll(() => boardText(page), { timeout: 8000, intervals: [250] }).toEqual(expected);

    // The settled fields are actually on screen at this viewport.
    const first = page.locator('#board a.flight').first();
    for (const k of ['code', 'board', 'status']) await expect(first.locator(`[data-flap="${k}"]`)).toBeVisible();
  });

  test('a second click during boarding is ignored', async ({ page }, testInfo) => {
    only(testInfo, 'desktop', 'mobile');
    test.setTimeout(90_000);
    await page.goto('./', { waitUntil: 'load' });
    const overlays = [];
    await page.exposeFunction('__e2eOverlay', () => overlays.push(Date.now()));
    await page.evaluate(() => {
      new MutationObserver((muts) => {
        for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1 && n.matches('.bp-overlay')) window.__e2eOverlay();
      }).observe(document.body, { childList: true });
    });
    const [first, second] = [PRODUCTS[0], PRODUCTS[1]];
    const row = page.locator(`#board a.flight[data-slug="${first.slug}"]`);
    await row.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await boardReady(page);
    // All three clicks in one task, so the 900 ms boarding window can't
    // expire between them on a slow machine: the row, the same row again,
    // then a different row (the overlay covers the board, so dispatch directly).
    const ignored = await page.evaluate(([a, b]) => {
      const out = [];
      for (const slug of [a, a, b]) {
        const el = document.querySelector(`#board a.flight[data-slug="${slug}"]`);
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
        el.dispatchEvent(ev);
        out.push(ev.defaultPrevented);
      }
      return out;
    }, [first.slug, second.slug]);
    // The first click starts boarding (default prevented, navigation deferred);
    // the next two must be swallowed too rather than navigating.
    expect(ignored, 'every click should be defaultPrevented').toEqual([true, true, true]);
    await page.waitForURL(`**/my-portfolio/work/${first.slug}/`, { waitUntil: 'domcontentloaded', timeout: 40_000 });
    await expect(page.locator('h1')).toContainText(first.name);
    expect(overlays).toHaveLength(1);
  });

  for (const p of PRODUCTS) {
    test(`clicking ${p.code} ${p.name} boards and lands on its case study`, async ({ page, errors }, testInfo) => {
      test.setTimeout(90_000);
      await page.goto('./', { waitUntil: 'load' });

      // The pass overlay only lives ~900 ms before navigation, so record it
      // from inside the page the moment it is inserted, not by polling.
      const overlays = [];
      await page.exposeFunction('__e2eOverlay', (name) => overlays.push(name));
      await page.evaluate(() => {
        new MutationObserver((muts) => {
          for (const m of muts)
            for (const n of m.addedNodes)
              if (n.nodeType === 1 && n.matches('.bp-overlay')) window.__e2eOverlay(n.querySelector('.bp [data-k="name"]')?.textContent || '');
        }).observe(document.body, { childList: true });
      });

      const row = page.locator(`#board a.flight[data-slug="${p.slug}"]`);
      await row.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await boardReady(page);
      await row.click();
      await page.waitForURL(`**/my-portfolio/work/${p.slug}/`, { waitUntil: 'domcontentloaded', timeout: 40_000 });

      // With motion allowed, the boarding pass for this flight played first;
      // with reduced motion the row navigates straight away.
      expect(overlays).toEqual(testInfo.project.name === 'reduced' ? [] : [p.name]);
      await expect(page.locator('h1')).toContainText(p.name);
      await page.waitForLoadState('load', { timeout: 30_000 });
      await page.waitForTimeout(500);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});
