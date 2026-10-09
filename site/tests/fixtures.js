// Shared fixtures and helpers for the e2e suite.
// Every test gets two automatic guards:
//   - `supabase`: any request to the Supabase REST API is answered locally
//     with 201, so no test can ever write to the real subscribers table.
//   - `errors`: console errors and uncaught page errors, minus the GPU and
//     WebGL noise SwiftShader produces in headless Chromium.
import { test as base, expect } from '@playwright/test';

export { expect };

export const IGNORED_CONSOLE = /webgl|gpu|swiftshader|GPU stall|ANGLE|GL_[A-Z_]+|ReadPixels|software rendering/i;

export const test = base.extend({
  supabase: [
    async ({ context }, use) => {
      const hits = [];
      await context.route('**/rest/v1/**', (route) => {
        hits.push({ method: route.request().method(), url: route.request().url(), body: route.request().postData() });
        return route.fulfill({ status: 201, body: '' });
      });
      await use(hits);
    },
    { auto: true },
  ],
  errors: [
    async ({ page }, use, testInfo) => {
      const errors = [];
      page.on('console', (m) => {
        if (m.type() !== 'error' || IGNORED_CONSOLE.test(m.text())) return;
        const loc = m.location();
        errors.push(`[console.error] ${m.text()}${loc?.url ? ` (${loc.url}:${loc.lineNumber})` : ''} on ${page.url()}`);
      });
      page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message} on ${page.url()}`));
      page.on('response', (r) => {
        const u = new URL(r.url());
        if (u.hostname === 'localhost' && r.status() >= 400) errors.push(`[http ${r.status()}] ${r.url()} on ${page.url()}`);
      });
      await use(errors);
      // Surface stray errors in the report even when a test doesn't assert on them.
      for (const e of errors) testInfo.annotations.push({ type: 'page-error', description: e });
    },
    { auto: true },
  ],
});

// Skip unless the running project is one of `names`.
export function only(testInfo, ...names) {
  test.skip(!names.includes(testInfo.project.name), `only runs in: ${names.join(', ')}`);
}

// The year the HUD odometer shows for a segment (same rule as render/segments.js).
export const yearOf = (s) => String(s.year || s.years || '').match(/\d{4}/)?.[0] || '';

// Wait until the flight layer has settled into whatever this tier draws:
// the 3D scene (has-3d) or the 2D route map. Phones only boot the flight on
// the first scroll or touch, so nudge the page by a pixel first.
export async function waitForScene(page, timeout = 30_000) {
  await page.evaluate(() => window.scrollBy({ top: 1, behavior: 'instant' }));
  await page.waitForFunction(
    () => document.documentElement.classList.contains('has-3d') || !!document.querySelector('.route-map'),
    null,
    { timeout }
  );
}

// Instantly centre an element on the viewport midline, then give the
// rAF-driven HUD a moment to catch up.
export async function centre(page, selector, settle = 600) {
  await page.locator(selector).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(settle);
}

// What each departures row currently shows. A flapified field holds one .fc
// cell per character; the top half of each cell (.fh.t, first child) carries
// the character on display. Before flapify runs, the raw text is the value.
export async function boardText(page) {
  return page.$$eval('#board a.flight', (rows) =>
    rows.map((a) => {
      const field = (k) => {
        const el = a.querySelector(`[data-flap="${k}"]`);
        if (!el) return null;
        const cells = el.querySelectorAll('.fc');
        if (!cells.length) return el.textContent.trim();
        return [...cells].map((c) => c.firstElementChild?.textContent ?? '').join('').trim();
      };
      return { slug: a.dataset.slug, code: field('code'), board: field('board'), status: field('status') };
    })
  );
}

// Scroll top to bottom in viewport-sized steps so every observer fires.
export async function scrollThrough(page, stepMs = 120) {
  await page.evaluate(async (ms) => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.9));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, ms));
    }
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  }, stepMs);
}

// Horizontal overflow probe: page widths plus the widest offenders.
export async function overflow(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1) {
        const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
        offenders.push({ el: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls ? '.' + cls : ''}`, right: Math.round(r.right) });
      }
    }
    offenders.sort((a, b) => b.right - a.right);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: vw,
      clientWidth: document.documentElement.clientWidth,
      offenders: offenders.slice(0, 6),
    };
  });
}
