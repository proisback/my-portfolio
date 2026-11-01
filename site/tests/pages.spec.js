import { test, expect, only } from './fixtures.js';
import { PRODUCTS, PROFILE, FOOTER, COMIC, PODCAST } from '../src/content.js';

const BASE = '/my-portfolio/';

// Every same-site URL the page references: links, images, audio, styles, scripts.
async function internalUrls(page) {
  return page.evaluate((base) => {
    const urls = [
      ...[...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      ...[...document.querySelectorAll('img[src]')].map((i) => i.getAttribute('src')),
      ...[...document.querySelectorAll('audio[src]')].map((a) => a.getAttribute('src')),
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
      // The 3-line opener carries the case; the old self-assessment section is gone.
      const opener = page.locator('.wp-opener dd');
      await expect(opener).toHaveText([p.opener.problem, p.opener.did, p.opener.result]);
      await expect(page.locator('.wp-sec-title', { hasText: 'What This Demonstrates' })).toHaveCount(0);
      await expect(page.locator('footer')).toContainText(FOOTER.credit);
      await expect(page.locator(`footer a[href="${PROFILE.calendly}"]`)).toHaveCount(1);
      await expect(page.locator('footer a[href*="field-guides"]')).toHaveCount(0);
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
    for (const p of PRODUCTS) {
      const entry = main.locator('.rp-product', { has: page.locator('h3', { hasText: p.name }) });
      await expect(entry).toHaveCount(1);
      await expect(entry.locator('.rp-opener dd')).toHaveText([p.opener.problem, p.opener.did, p.opener.result]);
    }
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

test.describe('podcast page', () => {
  const blockText = (b) => (typeof b === 'string' ? b : b.key || b.route);
  const stepsOf = (route) => route.replace(/\.$/, '').split(' → ');

  test('episode, full transcript and the written story are in the HTML', async ({ page, request, errors }) => {
    const res = await page.goto('podcast/', { waitUntil: 'load' });
    expect(res.status()).toBe(200);
    await expect(page).toHaveTitle(`${PODCAST.title} | ${PROFILE.name}`);
    await expect(page.locator('h1')).toHaveText(PODCAST.title);
    // The page doesn't name the tool or describe the voices.
    await expect(page.locator('body')).not.toContainText(/Speechify|AI hosts|AI voices/i);

    // The episode only downloads on play, and the file it points at is served as MP3.
    const audio = page.locator('.pod-audio');
    await expect(audio).toHaveAttribute('preload', 'none');
    const mp3 = await request.get(await audio.getAttribute('src'));
    expect(mp3.status()).toBe(200);
    expect(mp3.headers()['content-type'] || '').toMatch(/audio\/mpeg/);

    // Every turn of the transcript, in order, with the note on the one cited report.
    const turns = page.locator('.pod-lines > p');
    await expect(turns).toHaveCount(PODCAST.transcript.length);
    for (const [i, t] of PODCAST.transcript.entries()) {
      await expect(turns.nth(i).locator('.pod-who')).toHaveText(t.who);
      await expect(turns.nth(i)).toContainText(t.text);
    }
    await expect(page.locator('.pod-note')).toHaveCount(1);
    await expect(page.locator('.pod-note')).toHaveText(/2026 CPO Insights Report from Products That Count/);

    // Every block in order. A flow keeps its sentence for screen readers and
    // draws each step: around a wheel (a closing 'repeat' moves to the hub),
    // or as the straight line with a broken arrow.
    const blocks = page.locator('.pod-story-body > *');
    await expect(blocks).toHaveCount(PODCAST.story.body.length);
    for (const [i, b] of PODCAST.story.body.entries()) {
      if (!b.route) {
        await expect(blocks.nth(i)).toHaveText(blockText(b));
        continue;
      }
      await expect(blocks.nth(i).locator('.visually-hidden')).toHaveText(b.route);
      const steps = stepsOf(b.route);
      if (b.broken) {
        await expect(blocks.nth(i)).toHaveClass(/pod-flow--broken/);
        await expect(blocks.nth(i).locator('.pod-break')).toHaveCount(steps.length - 1);
        await expect(blocks.nth(i).locator('.pod-step')).toHaveText(steps);
      } else {
        const hub = steps.at(-1) === 'repeat' ? steps.pop() : '';
        await expect(blocks.nth(i).locator('.pod-steps li')).toHaveText(steps);
        await expect(blocks.nth(i).locator('.pod-rim path')).toHaveCount(steps.length);
        await expect(blocks.nth(i).locator('.pod-hub')).toHaveText(hub);
      }
    }
    await expect(page.locator('.pod-key')).toHaveCount(PODCAST.story.body.filter((b) => b.key).length);
    await expect(page.locator('.pod-flow')).toHaveCount(PODCAST.story.body.filter((b) => b.route).length);

    await expect(page.locator('footer a', { hasText: FOOTER.podcast.label })).toHaveAttribute('aria-current', 'page');
    await page.waitForTimeout(300);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('player: play, seek, speed and pause', async ({ page, errors }) => {
    await page.goto('podcast/', { waitUntil: 'load' });
    const player = page.locator('.pod-player');
    const audio = player.locator('.pod-audio');
    const play = player.locator('.pod-play');

    // The styled controls replace the native bar once the module runs.
    await expect(player.locator('.pod-controls')).toBeVisible();
    expect(await audio.evaluate((a) => a.controls)).toBe(false);
    await expect(play).toHaveAccessibleName('Play');

    await play.click();
    await expect(play).toHaveAccessibleName('Pause');
    await expect.poll(() => audio.evaluate((a) => !a.paused && a.currentTime > 0), { timeout: 20_000 }).toBe(true);

    await player.locator('.pod-seek').fill('300');
    await expect.poll(() => audio.evaluate((a) => a.currentTime), { timeout: 10_000 }).toBeGreaterThanOrEqual(300);
    await expect(player.locator('.pod-now')).toHaveText(/^5:0\d$/);
    await expect(player.locator('.pod-seek')).toHaveAttribute('aria-valuetext', /^5:0\d of 10:04$/);

    const speed = player.locator('.pod-speed');
    await speed.click();
    expect(await audio.evaluate((a) => a.playbackRate)).toBe(1.25);
    await expect(speed).toHaveAccessibleName('Playback speed 1.25×');
    await speed.click();
    await speed.click();
    expect(await audio.evaluate((a) => a.playbackRate)).toBe(1);

    await play.click();
    await expect(play).toHaveAccessibleName('Play');
    expect(await audio.evaluate((a) => a.paused)).toBe(true);
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('a file that fails to load shows the message, not dead controls', async ({ page }) => {
    await page.route('**/audio/*.mp3', (route) => route.fulfill({ status: 404, body: '' }));
    await page.goto('podcast/', { waitUntil: 'load' });
    const player = page.locator('.pod-player');
    await player.locator('.pod-play').click();
    await expect(player.locator('.pod-error')).toBeVisible();
    await expect(player.locator('.pod-error')).toHaveText(PODCAST.audio.error);
    await expect(player.locator('.pod-controls')).toBeHidden();
  });

});

test.describe('podcast page without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the native audio controls stay, the styled ones stay hidden', async ({ page }) => {
    await page.goto('podcast/', { waitUntil: 'load' });
    await expect(page.locator('.pod-audio')).toHaveAttribute('controls', '');
    await expect(page.locator('.pod-audio')).toBeVisible();
    await expect(page.locator('.pod-controls')).toBeHidden();
    await expect(page.locator('.pod-lines > p')).toHaveCount(PODCAST.transcript.length);
  });
});

test.describe('internal links on home, read, comic and podcast', () => {
  for (const path of ['', 'read/', 'comic/', 'podcast/']) {
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

  test('old resume URLs serve the current resume, not an outdated one', async ({ request }, testInfo) => {
    only(testInfo, 'desktop');
    const current = await (await request.get('Prateek-Mehta-AI-PM-Resume.pdf')).body();
    for (const path of ['Prateek-Mehta-PM-Resume.pdf', 'Prateek-Mehta-Product-Resume.pdf', 'Resume.pdf']) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect((await res.body()).equals(current), `${path} should be the current resume`).toBe(true);
    }
  });
});
