import { test, expect, only } from './fixtures.js';
import { PRODUCTS } from '../src/content.js';

const PAGES = [
  ['home', './', '#board'],
  ['work page', `work/${PRODUCTS[0].slug}/`, '#main'],
  ['read', 'read/', '#main'],
  ['comic', 'comic/', '#main'],
];

test.describe('accessibility smoke', () => {
  test('home: the skip link is the first focusable element', async ({ page }) => {
    await page.goto('./', { waitUntil: 'load' });
    const first = await page.evaluate(() => {
      const sel = 'a[href], button, input, select, textarea, [tabindex]';
      const el = [...document.querySelectorAll(sel)].find((e) => e.tabIndex >= 0 && !e.disabled && !e.closest('[inert]'));
      return el ? { cls: el.className, href: el.getAttribute('href') } : null;
    });
    expect(first).toEqual({ cls: 'skip-link', href: '#board' });
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => ({ cls: document.activeElement?.className, text: document.activeElement?.textContent?.trim() }));
    expect(active.cls).toBe('skip-link');
    expect(active.text).toBeTruthy();
    await expect(page.locator('.skip-link')).toBeInViewport();
  });

  test('home: following the skip link moves keyboard focus to the work', async ({ page }) => {
    await page.goto('./', { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1200);
    // Focus moves with the scroll: the board itself, then its first row.
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('board');
    await expect(page.locator('#board')).toBeInViewport();
    await page.keyboard.press('Tab');
    const where = await page.evaluate(() => {
      const a = document.activeElement;
      const board = document.getElementById('board');
      return {
        inBoard: !!a?.closest('#board'),
        afterBoard: !!(board && a && board.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING),
        active: a ? `${a.tagName.toLowerCase()}.${a.className} ${a.getAttribute('href') || ''}` : null,
      };
    });
    expect(where.inBoard || where.afterBoard, `focus after skip link + Tab landed on ${where.active}`).toBe(true);
  });

  for (const [name, path, target] of PAGES.slice(1)) {
    test(`${name}: the skip link is the first focusable element`, async ({ page }, testInfo) => {
      only(testInfo, 'desktop');
      await page.goto(path, { waitUntil: 'load' });
      await page.keyboard.press('Tab');
      const active = await page.evaluate(() => ({ cls: document.activeElement?.className, href: document.activeElement?.getAttribute('href') }));
      expect(active).toEqual({ cls: 'skip-link', href: target });
      await expect(page.locator(target)).toHaveCount(1);
    });
  }

  for (const [name, path] of PAGES) {
    test(`${name}: images have alt, links and buttons have names, ids are unique`, async ({ page }, testInfo) => {
      only(testInfo, 'desktop');
      test.setTimeout(90_000);
      await page.goto(path, { waitUntil: 'load' });

      const noAlt = await page.$$eval('img:not([alt])', (els) => els.map((e) => e.outerHTML.slice(0, 160)));
      expect(noAlt, `images without alt on ${name}`).toEqual([]);

      const controls = [...(await page.getByRole('link').all()), ...(await page.getByRole('button').all())];
      expect(controls.length).toBeGreaterThan(3);
      const unnamed = [];
      for (const c of controls) {
        try {
          await expect(c).toHaveAccessibleName(/\S/, { timeout: 1000 });
        } catch {
          unnamed.push(await c.evaluate((e) => e.outerHTML.slice(0, 200)));
        }
      }
      expect(unnamed, `links/buttons without an accessible name on ${name}`).toEqual([]);

      const refs = await page.evaluate(() => {
        const missing = [];
        for (const el of document.querySelectorAll('[aria-labelledby], [aria-describedby]')) {
          for (const attr of ['aria-labelledby', 'aria-describedby']) {
            for (const id of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) {
              if (!document.getElementById(id)) missing.push(`${attr}="${id}"`);
            }
          }
        }
        const seen = new Map();
        for (const el of document.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) || 0) + 1);
        const dupes = [...seen].filter(([, n]) => n > 1).map(([id, n]) => `#${id} x${n}`);
        return { missing, dupes };
      });
      expect(refs.missing, `dangling aria references on ${name}`).toEqual([]);
      expect(refs.dupes, `duplicate ids on ${name}`).toEqual([]);
    });
  }

  test('home: the notify input is labelled', async ({ page }, testInfo) => {
    only(testInfo, 'desktop');
    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#notify-email')).toHaveAccessibleName('Email address');
    await expect(page.locator('#notify-submit')).toHaveAccessibleName(/Notify me/);
  });

  test('home: HUD stops are labelled and the HUD is inert while hidden', async ({ page }, testInfo) => {
    only(testInfo, 'desktop');
    await page.goto('./', { waitUntil: 'load' });
    const labels = await page.$$eval('#hud .hud-stop', (els) => els.map((a) => a.getAttribute('aria-label')));
    expect(labels).toEqual(['Jump to BOM 2012', 'Jump to IXW 2022', 'Jump to MAA 2023', 'Jump to BOM 2025', 'Jump to 2026']);
    // Hidden at the hero: out of the tab order and the accessibility tree.
    await expect(page.locator('#hud')).not.toHaveClass(/\bis-on\b/);
    expect(await page.locator('#hud').evaluate((el) => el.inert)).toBe(true);
    // Playwright's role engine ignores `inert`, so check the behaviour: an
    // inert link cannot take focus.
    const focusable = await page.$$eval('#hud a', (as) =>
      as.map((a) => {
        a.focus();
        return document.activeElement === a;
      })
    );
    expect(focusable).toEqual([false, false, false, false, false]);
  });
});
