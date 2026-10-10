import { test, expect, only, waitForScene, scrollThrough } from './fixtures.js';
import { SITE, PROFILE, STATS, FOOTER } from '../src/content.js';

const HERO_STATS = STATS.filter((s) => s.hero);

test.describe('home', () => {
  test('hero name, claim within 1.5 s, stats and footer credit', async ({ page }) => {
    const t0 = Date.now();
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    const dcl = Date.now();

    // The claim must be readable within 1.5 s of DOMContentLoaded, long before
    // the 3D chunk is fetched on idle: visible, and at least half faded in
    // (the CSS rise animation ends ~0.95 s after the js class lands).
    const claim = page.locator('.hero-claim');
    await expect(claim).toBeVisible({ timeout: 1500 });
    await expect(claim).toContainText('builds with AI', { timeout: 1500 });
    const opacity = () => claim.evaluate((el) => Number(getComputedStyle(el).opacity));
    const budget = Math.max(100, 1500 - (Date.now() - dcl));
    await expect.poll(opacity, { timeout: budget, intervals: [50] }).toBeGreaterThan(0.5);
    const legibleAt = Date.now() - dcl;
    const has3dThen = await page.evaluate(() => document.documentElement.classList.contains('has-3d'));
    expect(has3dThen, 'the claim should be readable before any 3D starts').toBe(false);
    await expect.poll(opacity, { timeout: 5000, intervals: [50] }).toBeGreaterThan(0.95);
    test.info().annotations.push({
      type: 'timing',
      description: `claim >50% opacity ${legibleAt} ms after DCL, fully in ${Date.now() - dcl} ms (goto took ${dcl - t0} ms)`,
    });

    await expect(page).toHaveTitle(SITE.title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(PROFILE.name);

    // The hero opens with two stats; all four land on the cockpit gauges.
    const values = page.locator('.stats .stat-value');
    await expect(values).toHaveCount(HERO_STATS.length);
    await expect(values).toHaveText(HERO_STATS.map((s) => s.value));
    for (const v of ['8+', '7']) await expect(values.filter({ hasText: v }).first()).toBeVisible();
    await expect(page.locator('#cockpit .gauge-value')).toHaveText(STATS.map((s) => s.value));

    await expect(page.locator('footer.footer')).toContainText(FOOTER.credit);
    await expect(page.locator('footer.footer')).toContainText('Designed and built by Prateek with Claude Code.');

    // The page ends on the intro call; personal notes and the duplicate text-version link stay out.
    const footer = page.locator('footer.footer');
    await expect(footer.locator(`a.btn[href="${PROFILE.calendly}"]`)).toHaveCount(1);
    await expect(footer.locator('a', { hasText: FOOTER.comic.label })).toHaveCount(1);
    await expect(footer.locator('a[href*="field-guides"], a[href$="read/"]')).toHaveCount(0);
    await expect(page.locator('#nav .nav-read')).toHaveText('Quick read');
  });

  // Default detection, plus the forced 3D tier real GPUs get (headless
  // Chromium only has SwiftShader, which the app routes to the 2D map).
  const VARIANTS = { desktop: ['', '?tier=full'], mobile: ['', '?tier=mobile'], reduced: [''] };
  for (const query of ['', '?tier=full', '?tier=mobile']) {
    test(`no console errors while loading and scrolling the whole page${query ? ` (${query})` : ''}`, async ({ page, errors }, testInfo) => {
      test.skip(!VARIANTS[testInfo.project.name].includes(query), 'variant not used in this project');
      test.setTimeout(180_000);
      await page.goto(`./${query}`, { waitUntil: 'load' });
      await waitForScene(page);
      await scrollThrough(page, query ? 400 : 120);
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(500);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test.describe('home without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('hero copy, stats and board are in the HTML before any script runs', async ({ page }) => {
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText(PROFILE.name);
    await expect(page.locator('.hero-claim')).toBeVisible();
    await expect(page.locator('.hero-claim')).toContainText('builds with AI');
    await expect(page.locator('.stats .stat-value')).toHaveText(HERO_STATS.map((s) => s.value));
    await expect(page.locator('#board a.flight')).toHaveCount(7);
    await expect(page.locator('footer.footer')).toContainText(FOOTER.credit);
  });
});

// Headless Chromium renders WebGL with SwiftShader, which tier.js routes to
// the 2D map, so the 3D path is exercised with a forced tier.
test.describe('3D flight', () => {
  test('desktop (?tier=full): has-3d within 20 s and window.__flight.S exists', async ({ page }, testInfo) => {
    only(testInfo, 'desktop');
    test.setTimeout(90_000);
    await page.goto('./?tier=full', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-tier', 'full');
    await expect(page.locator('html')).toHaveClass(/\bhas-3d\b/, { timeout: 20_000 });
    await expect(page.locator('#stage')).toHaveClass(/\bis-ready\b/);
    // startFlight() is async: __flight is assigned once the scene has built.
    await expect.poll(() => page.evaluate(() => typeof window.__flight?.S), { timeout: 20_000 }).toBe('object');
    const keys = await page.evaluate(() => Object.keys(window.__flight.S));
    expect(keys.length).toBeGreaterThan(0);
    await expect(page.locator('#stage')).toHaveAttribute('aria-hidden', 'true');

    // Informational: SwiftShader is slow, so the frame-time guard may later
    // hand over to the 2D map. Record it, don't fail on it.
    await page.waitForTimeout(9000);
    const later = await page.evaluate(() => ({
      tier: document.documentElement.dataset.tier,
      has3d: document.documentElement.classList.contains('has-3d'),
      map: !!document.querySelector('.route-map'),
    }));
    testInfo.annotations.push({ type: 'scene-after-9s', description: JSON.stringify(later) });
  });

  test('mobile (?tier=mobile): the lighter scene starts', async ({ page }, testInfo) => {
    only(testInfo, 'mobile');
    test.setTimeout(90_000);
    await page.goto('./?tier=mobile', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-tier', 'mobile');
    await expect(page.locator('html')).toHaveClass(/\bhas-3d\b/, { timeout: 20_000 });
    await expect.poll(() => page.evaluate(() => typeof window.__flight?.S), { timeout: 20_000 }).toBe('object');
  });

  // Without a forced tier, the renderer spots SwiftShader and hands over to
  // the 2D map. Phones only fetch the flight chunk on the first scroll/touch.
  test('software WebGL (SwiftShader) ends on the 2D map by default, not 3D', async ({ page }, testInfo) => {
    only(testInfo, 'desktop', 'mobile');
    const renderer = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      const info = gl?.getExtension('WEBGL_debug_renderer_info');
      return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : gl ? 'unknown' : 'none';
    });
    testInfo.annotations.push({ type: 'webgl-renderer', description: renderer });
    const flightChunks = [];
    page.on('request', (r) => /\/assets\/flight-[^/]*\.js/.test(r.url()) && flightChunks.push(r.url()));

    await page.goto('./', { waitUntil: 'load' });
    if (testInfo.project.name === 'mobile') {
      await expect(page.locator('html')).toHaveAttribute('data-tier', 'mobile');
      await page.waitForTimeout(2500);
      expect(flightChunks, 'phones should not fetch the flight chunk before any interaction').toEqual([]);
      await page.evaluate(() => window.scrollBy({ top: 1, behavior: 'instant' }));
    }
    await expect(page.locator('html')).toHaveAttribute('data-tier', 'lite', { timeout: 30_000 });
    await expect(page.locator('.route-map')).toHaveCount(1, { timeout: 10_000 });
    await page.waitForTimeout(1500);
    await expect(page.locator('html')).not.toHaveClass(/\bhas-3d\b/);
    expect(await page.evaluate(() => typeof window.__flight)).toBe('undefined');
  });
});
