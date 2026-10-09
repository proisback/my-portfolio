// Writes the generated pages from src/content.js before every dev/build run:
// work/<slug>/index.html for each product, read/index.html, comic/index.html.
// Plain Node ESM, no Vite. Vite picks the files up as multi-page inputs.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS } from '../src/content.js';
import { workPage, readPage, comicPage } from '../src/render/pages.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const written = [];

function write(rel, html) {
  if (html.includes('—')) throw new Error(`[gen] em-dash found in ${rel}; remove it from content.js`);
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(`${rel} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
}

const slugs = new Set(PRODUCTS.map((p) => p.slug));
if (slugs.size !== PRODUCTS.length) throw new Error('[gen] duplicate product slug in content.js');

// Drop stale case studies (renamed or removed products) before writing.
rmSync(join(root, 'work'), { recursive: true, force: true });
PRODUCTS.forEach((p, i) => write(`work/${p.slug}/index.html`, workPage(p, i)));
write('read/index.html', readPage());
write('comic/index.html', comicPage());

console.log(`[gen] wrote ${written.length} pages:\n  ${written.join('\n  ')}`);
