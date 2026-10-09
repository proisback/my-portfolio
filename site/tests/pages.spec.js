import { test, expect, only } from './fixtures.js';
import { PRODUCTS, PROFILE, FOOTER, COMIC } from '../src/content.js';

const BASE = '/my-portfolio/';

// Every same-site URL the page references: links, images, styles, scripts.
async function internalUrls(page) {
  return page.evaluate((base) => {
    const urls = [
      ...[...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      ...[...document.querySelectorAll('img[src]')].map((i) => i.getAttribute('src')),
      ...[...document.querySelectorAll('link[href]')].map((l) => l.getAttribute('href')),
      ...[...document.querySelectorAll('script[src]')].map((s) => s.getAttribute('src')),
    ].filter((u) => u && u.startsWith(base));
    return [...new Set(urls.map((u) => u.split('#')[0]))];
  }, BASE);
}

async function expectAllOk(request, urls, from) {
  const bad = [];
  for (const u of urls) {
    const res = await request.get(u, { maxRedirects: 3 });
    if (res.status() !== 200) bad.push(`${res.status()} ${u}`);
  }
  expect(bad, `broken internal URLs on ${from}:\n${bad.join('\n')}`).toEqual([]);
}

async function expectExternalLinksSafe(page, from) {
  const ext = await page.$$eval('a[href^="http"]', (as) =>
    as.map((a) => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel') || '' }))
  );
  const bad = ext.filter((l) => l.target !== '_blank' || !/\bnoopener\b/.test(l.rel));
  expect(bad, `external links missing target=_blank / rel=noopener on ${from}`).toEqual([]);
  return ext.length;
}

test.describe('case study pages', () => {
  for (const [i, p] of PRODUCTS.entries()) {
    test(`work/${p.slug}/ loads with its boarding pass`, async ({ page, errors }) => {
      const res = await page.goto(`work/${p.slug}/`, { waitUntil: 'load' });
      expect(res.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText(p.name);
      const pass = page.locator('.wp-pass');
      await expect(pass).toBeVisible();
      await expect(pass).toContainText(p.code);
      await expect(pass).toContainText(p.status);
      await expect(page.locator('.wp-kicker')).toContainText(`Case study ${String(i + 1).padStart(2, '0')} of 07`);
      for (const s of p.sections) await expect(page.locator('.wp-sec-title', { hasText: s.h })).toHaveCount(1);
      await expect(page.locator('footer')).toContainText(FOOTER.credit);
      await page.waitForTimeout(300);
      expect(errors, errors.join('\n')).toEqual([]);
    });

    test(`work/${p.slug}/ internal links resolve and external links are safe`, async ({ page, request }, testInfo) => {
      only(testInfo, 'desktop');
      test.setTimeout(120_000);
      await page.goto(`work/${p.slug}/`, { waitUntil: 'domcontentloaded' });
      const urls = await internalUrls(page);
      expect(urls.length).toBeGreaterThan(5);
      await expectAllOk(request, urls, `work/${p.slug}/`);
      const n = await expectExternalLinksSafe(page, `work/${p.slug}/`);
      testInfo.annotations.push({ type: 'links', description: `${urls.length} internal, ${n} external` });
    });
  }
});

test.describe('read page', () => {
  test('loads with every product and the thesis', async ({ page, errors }) => {
    const res = await page.goto('read/', { waitUntil: 'load' });
    expect(res.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(PROFILE.name);
    const main = page.locator('main');
    for (const p of PRODUCTS) await expect(main.locator('.rp-product h3', { hasText: p.name })).toHaveCount(1);
    for (const line of PROFILE.thesis) await expect(page.locator('#thesis')).toContainText(line);
    await expect(page.locator('#thesis-title')).toContainText('Stop fixing systems. Start building them.');
    await expect(page.locator('footer')).toContainText(FOOTER.credit);
    await page.waitForTimeout(300);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('comic page', () => {
  test('9 pages with ordered alt text, all images load', async ({ page, request, errors }) => {
    const res = await page.goto('comic/', { waitUntil: 'load' });
    expect(res.status()).toBe(200);
    const imgs = page.locator('.cp-pages img');
    await expect(imgs).toHaveCount(9);
    expect(COMIC.pages).toHaveLength(9);
    for (let n = 1; n <= 9; n++) {
      const img = imgs.nth(n - 1);
      const alt = await img.getAttribute('alt');
      expect(alt, `alt of comic image ${n}`).toMatch(new RegExp(`^Comic page ${n} of 9`));
      const src = await img.getAttribute('src');
      expect((await request.get(src)).status(), src).toBe(200);
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth), { timeout: 8000 }).toBeGreaterThan(0);
    }
    await expect(page.locator('footer')).toContainText(FOOTER.credit);
    expect(errors, errors.join('\n')).toEqual([]);
  });
});

test.describe('internal links on home, read and comic', () => {
  for (const path of ['', 'read/', 'comic/']) {
    test(`${path || 'home'}: internal URLs resolve, external links are safe`, async ({ page, request }, testInfo) => {
      only(testInfo, 'desktop');
      test.setTimeout(120_000);
      await page.goto(path || './', { waitUntil: 'domcontentloaded' });
      const urls = await internalUrls(page);
      await expectAllOk(request, urls, path || 'home');
      await expectExternalLinksSafe(page, path || 'home');
    });
  }
});

test.describe('legacy assets keep their URLs', () => {
  const assets = [
    ['PRDs/04_plankarochalo_prd.html', /text\/html/],
    ['field-guides/', /text\/html/],
    ['Prateek-Mehta-AI-PM-Resume.pdf', /application\/pdf/],
    ['rethink-buildathon-2nd-place.pdf', /application\/pdf/],
  ];
  test('og image is og.jpg and is served', async ({ page, request }, testInfo) => {
    only(testInfo, 'desktop');
    for (const path of ['./', `work/${PRODUCTS[0].slug}/`, 'read/']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://proisback.github.io/my-portfolio/og.jpg');
    }
    const res = await request.get('og.jpg');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type'] || '').toMatch(/image\/jpeg/);
  });

  for (const [path, type] of assets) {
    test(`${path} returns 200`, async ({ request }, testInfo) => {
      only(testInfo, 'desktop');
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type'] || '').toMatch(type);
    });
  }
});
