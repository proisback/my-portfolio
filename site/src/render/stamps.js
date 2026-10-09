// Passport stamps: each stop's organisation as a one-ink stamp. Logos are
// official artwork reduced to currentColor (sources in src/stamps/SOURCES.md),
// defined once as <symbol>s and drawn with <use>, so a logo that sits on a card
// and again in the passport row ships once.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './shared.js';

const DIR = fileURLToPath(new URL('../stamps/', import.meta.url));

const LOGOS = Object.fromEntries(
  readdirSync(DIR)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => {
      const [, attrs, inner] = readFileSync(join(DIR, f), 'utf8').match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
      const vb = attrs.match(/viewBox="([^"]+)"/)[1];
      const [, , w, h] = vb.split(/\s+/).map(Number);
      return [f.slice(0, -4), { vb, inner, ratio: w / h, evenodd: attrs.includes('fill-rule="evenodd"') }];
    })
);

// Card-size logo heights, tuned so every mark reads at a similar weight.
// Wide marks (Marsh McLennan) are capped by MAX_W instead.
const HEIGHT = { tcs: 24, xlri: 26, 'standard-chartered': 32, 'marsh-mclennan': 24, citi: 18 };
const MAX_W = 132;
const r = (n) => Math.round(n * 10) / 10;

export function sprite() {
  const symbols = Object.entries(LOGOS)
    .map(
      ([id, l]) =>
        `<symbol id="logo-${id}" viewBox="${l.vb}"><g fill="currentColor"${l.evenodd ? ' fill-rule="evenodd" clip-rule="evenodd"' : ''}>${l.inner}</g></symbol>`
    )
    .join('');
  return `<svg class="logo-sprite" width="0" height="0" aria-hidden="true" focusable="false">${symbols}</svg>`;
}

function mark(spec, scale) {
  if (spec.logo) {
    const l = LOGOS[spec.logo];
    if (!l) throw new Error(`[stamps] no file src/stamps/${spec.logo}.svg`);
    let h = (HEIGHT[spec.logo] || 24) * scale;
    let w = h * l.ratio;
    if (w > MAX_W * scale) [w, h] = [MAX_W * scale, (MAX_W * scale) / l.ratio];
    return `<svg class="stamp-logo" width="${r(w)}" height="${r(h)}" aria-hidden="true" focusable="false"><use href="#logo-${spec.logo}" width="100%" height="100%"/></svg>`;
  }
  if (spec.mask) {
    const h = 30 * scale;
    return `<span class="stamp-mask stamp-mask--${spec.mask}" style="width:${r(h * spec.ratio)}px;height:${r(h)}px" aria-hidden="true"></span>`;
  }
  return `<span class="stamp-type" aria-hidden="true">${spec.text.map((t) => `<span>${esc(t)}</span>`).join('')}</span>`;
}

// `top` and `bottom` are the small rim lines (e.g. "BOM · 2017", "Arrived").
export function stamp(spec, { top = '', bottom = '', tilt = -5, scale = 1, cls = '' } = {}) {
  const kind = spec.mask ? ` stamp--${spec.mask}` : spec.text ? ' stamp--type' : '';
  const rim = (t) => (t ? `<span class="stamp-rim mono" aria-hidden="true">${esc(t)}</span>` : '');
  return `<span class="stamp${kind}${cls ? ` ${cls}` : ''}" role="img" aria-label="${esc(spec.name)}" style="--r:${tilt}deg">${rim(top)}${mark(spec, scale)}${rim(bottom)}</span>`;
}
