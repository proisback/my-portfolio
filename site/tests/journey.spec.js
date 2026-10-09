import { test, expect, only, waitForScene, centre, yearOf } from './fixtures.js';
import { SEGMENTS } from '../src/content.js';

// Every segment that drives the HUD, in scroll order, with the year the
// odometer should read when it holds the midline.
const STOPS = SEGMENTS.map((s, i) => ({ n: i + 1, id: s.id, year: yearOf(s), leg: !!s.leg, thesis: !!s.thesis }));

const inIds = (page) => page.$$eval('#journey .seg[data-hud].is-in', (els) => els.map((e) => e.id));
const hudYear = (page) => page.locator('#hud-year').getAttribute('data-value');
const shownSelector = (s) => (s.thesis ? `#${s.id} .thesis .line >> nth=0` : s.leg ? `#${s.id} .leg-caption` : `#${s.id} .card`);
const shotName = (s, tag = '') => `stop-${String(s.n).padStart(2, '0')}-${s.id}${tag}.png`;

async function expectStop(page, s, timeout) {
  await expect.poll(() => inIds(page), { message: `only #${s.id} should be .is-in`, timeout }).toEqual([s.id]);
  await expect.poll(() => hudYear(page), { message: `HUD year at #${s.id}`, timeout }).toBe(s.year);
  await expect(page.locator('#hud'), `HUD on at #${s.id}`).toHaveClass(/\bis-on\b/, { timeout });
  expect(await page.locator('#hud').evaluate((el) => el.inert), `HUD interactive at #${s.id}`).toBe(false);
}

const hudInert = (page) => page.locator('#hud').evaluate((el) => el.inert);

test.describe('journey', () => {
  test('segments render in order with the expected years', async ({ page }) => {
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    const ids = await page.$$eval('#journey .seg[data-hud]', (els) => els.map((e) => e.id));
    expect(ids).toEqual(STOPS.map((s) => s.id));
    const years = await page.$$eval('#journey .seg[data-hud]', (els) => els.map((e) => e.dataset.year));
    expect(years).toEqual(STOPS.map((s) => s.year));
    expect([...new Set(years)]).toEqual(['2012', '2017', '2022', '2023', '2025', '2026']);
  });

  test('each stop on the midline is the only one in, the HUD year matches, the card shows', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await page.goto('./', { waitUntil: 'load' });
    await waitForScene(page);

    // At the top (hero) the HUD stays out of the way.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    await expect(page.locator('#hud')).not.toHaveClass(/\bis-on\b/);
    expect(await hudInert(page), 'hidden HUD is inert').toBe(true);

    for (const s of STOPS) {
      await centre(page, `#${s.id}`);
      await expectStop(page, s, 4000);
      // The card (or leg caption / thesis line) must actually fade in.
      const shown = shownSelector(s);
      await expect
        .poll(() => page.locator(shown).evaluate((el) => Number(getComputedStyle(el).opacity)), { message: `${shown} opacity`, timeout: 4000 })
        .toBeGreaterThan(0.95);
      await page.screenshot({ path: testInfo.outputPath(shotName(s)), timeout: 30_000 });
    }

    // Past the track (the departures board) the HUD hides again.
    await centre(page, '#board');
    await expect(page.locator('#hud')).not.toHaveClass(/\bis-on\b/, { timeout: 4000 });
    expect(await hudInert(page), 'hidden HUD is inert past the track').toBe(true);
  });

  // Real GPUs get the 3D scene; make sure the journey layer still tracks the
  // midline with it running. SwiftShader is slow, so a subset of stops.
  test('with the 3D scene forced on, key stops still drive the HUD', async ({ page }, testInfo) => {
    only(testInfo, 'desktop', 'mobile');
    test.setTimeout(240_000);
    const tier = testInfo.project.name === 'desktop' ? 'full' : 'mobile';
    await page.goto(`./?tier=${tier}`, { waitUntil: 'load' });
    await expect(page.locator('html')).toHaveClass(/\bhas-3d\b/, { timeout: 30_000 });
    for (const id of ['mumbai', 'jamshedpur', 'chennai', 'cockpit', 'thesis']) {
      const s = STOPS.find((x) => x.id === id);
      await centre(page, `#${id}`, 1000);
      await expectStop(page, s, 15_000);
      if (['mumbai', 'cockpit', 'thesis'].includes(id)) {
        await page.screenshot({ path: testInfo.outputPath(shotName(s, '-3d')), timeout: 45_000 });
      }
    }
    const end = await page.evaluate(() => ({ tier: document.documentElement.dataset.tier, has3d: document.documentElement.classList.contains('has-3d') }));
    testInfo.annotations.push({ type: 'scene-at-end', description: JSON.stringify(end) });
  });

  test('HUD stops link to their segments and deep links land on them', async ({ page }) => {
    for (const id of ['chennai', 'board']) {
      await page.goto(`./#${id}`, { waitUntil: 'load' });
      await page.waitForTimeout(800);
      const at = await page.locator(`#${id}`).evaluate((el) => ({
        top: Math.round(el.getBoundingClientRect().top),
        scrollY: Math.round(window.scrollY),
        tier: document.documentElement.dataset.tier,
      }));
      expect.soft(Math.abs(at.top), `#${id} deep link: ${JSON.stringify(at)}`).toBeLessThan(120);
    }
    const hrefs = await page.$$eval('#hud .hud-stop', (els) => els.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['#mumbai', '#jamshedpur', '#chennai', '#marsh', '#cockpit']);
  });
});
