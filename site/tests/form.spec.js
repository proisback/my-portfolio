import { test, expect, only } from './fixtures.js';
import { NOTIFY } from '../src/content.js';

// Never let a submit reach the real Supabase project. The `supabase` fixture
// already answers **/rest/v1/** at the context level; these page-level routes
// make the stub explicit and let each test choose the response.
async function stubSupabase(page, status = 201) {
  const posts = [];
  await page.route('**/rest/v1/**', (route) => {
    posts.push({ method: route.request().method(), body: route.request().postData() });
    return route.fulfill({ status, body: status >= 400 ? '{"message":"stubbed failure"}' : '', contentType: 'application/json' });
  });
  return posts;
}

async function freshForm(page) {
  await page.goto('./#contact', { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.locator('#notify-form').scrollIntoViewIfNeeded();
  await expect(page.locator('#notify-form')).toBeVisible();
  await expect(page.locator('#notify-already')).toBeHidden();
}

test.describe('notify form', () => {
  test('validation, typo fix, success, then already-on-the-list after reload', async ({ page }, testInfo) => {
    only(testInfo, 'desktop');
    const posts = await stubSupabase(page);
    await freshForm(page);

    const input = page.locator('#notify-email');
    const submit = page.locator('#notify-submit');
    const error = page.locator('#notify-error');
    await expect(input).toHaveAttribute('placeholder', NOTIFY.placeholder);
    await expect(submit).toHaveText(NOTIFY.button);

    // 1. Not an email.
    await input.fill('not-an-email');
    await submit.click();
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Please enter a valid email address.');
    await expect(input).toHaveAttribute('aria-invalid', 'true');

    // Typing clears the error.
    await input.fill('x');
    await expect(error).toBeHidden();
    await expect(input).toHaveAttribute('aria-invalid', 'false');

    // 2. Placeholder domain.
    await input.fill('test@test.com');
    await submit.click();
    await expect(error).toBeVisible();
    await expect(error).toHaveText('That looks like a placeholder domain. A real email, please?');

    // 3. Typo suggestion fills the corrected address when clicked.
    await input.fill('a@gmial.com');
    await submit.click();
    await expect(error).toBeVisible();
    await expect(error).toContainText('Did you mean');
    const fix = error.locator('.notify-typo-link');
    await expect(fix).toHaveText('a@gmail.com');
    await fix.click();
    await expect(input).toHaveValue('a@gmail.com');
    await expect(error).toBeHidden();
    expect(posts).toHaveLength(0);

    // 4. Valid email, stubbed insert: success card.
    await submit.click();
    const success = page.locator('#notify-success');
    await expect(success).toHaveClass(/\bis-visible\b/);
    await expect(success).toHaveAttribute('aria-hidden', 'false');
    await expect(success).toBeVisible();
    await expect(success).toContainText(NOTIFY.success);
    await expect(page.locator('#notify-form')).toBeHidden();
    expect(posts).toHaveLength(1);
    expect(posts[0].method).toBe('POST');
    expect(JSON.parse(posts[0].body)).toEqual({ email: 'a@gmail.com' });
    expect(await page.evaluate(() => localStorage.getItem('portfolio_notify_subscribed'))).toBe('1');

    // 5. Returning visitor.
    await page.reload({ waitUntil: 'load' });
    await page.locator('#notify').scrollIntoViewIfNeeded();
    await expect(page.locator('#notify-already')).toBeVisible();
    await expect(page.locator('#notify-already')).toContainText(NOTIFY.already);
    await expect(page.locator('#notify-form')).toBeHidden();
  });

  test('a deliberate resubmit of the same typo is respected', async ({ page }, testInfo) => {
    only(testInfo, 'desktop');
    const posts = await stubSupabase(page);
    await freshForm(page);
    await page.locator('#notify-email').fill('someone@gmial.com');
    await page.locator('#notify-submit').click();
    await expect(page.locator('#notify-error')).toContainText('Did you mean');
    await page.locator('#notify-submit').click();
    await expect(page.locator('#notify-success')).toHaveClass(/\bis-visible\b/);
    expect(posts.map((p) => JSON.parse(p.body).email)).toEqual(['someone@gmial.com']);
  });

  test('fails open: a server error still shows the success card', async ({ page }, testInfo) => {
    only(testInfo, 'desktop');
    const posts = await stubSupabase(page, 500);
    await freshForm(page);
    await page.locator('#notify-email').fill('reader@gmail.com');
    await page.locator('#notify-submit').click();
    await expect(page.locator('#notify-success')).toHaveClass(/\bis-visible\b/);
    await expect(page.locator('#notify-success')).toContainText(NOTIFY.success);
    expect(posts).toHaveLength(1);
  });
});
