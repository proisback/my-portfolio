// Departures board: a split-flap airport board listing the seven products.
// Every word is in the HTML; src/board.js turns the [data-flap] spans into
// flap cells and src/pass.js plays the boarding pass on click.
import { PRODUCTS, CITIES } from '../content.js';
import { esc, href, ICON } from './shared.js';

const FIELDS = ['code', 'board', 'month', 'status'];
const HEAD = { code: 'Flight', board: 'Destination', month: 'Month', status: 'Status' };
const MONTHS = {
  JAN: 'January', FEB: 'February', MAR: 'March', APR: 'April', MAY: 'May', JUN: 'June',
  JUL: 'July', AUG: 'August', SEP: 'September', OCT: 'October', NOV: 'November', DEC: 'December',
};

// Column width in flap cells = longest value in that column, so columns align.
const W = Object.fromEntries(FIELDS.map((f) => [f, Math.max(...PRODUCTS.map((p) => p[f].length))]));

const spokenMonth = (m) => {
  const [mon, yy] = m.split(' ');
  return `${MONTHS[mon] || mon} 20${yy}`;
};
const sentence = (s) => s.charAt(0) + s.slice(1).toLowerCase();

const flap = (field, value) =>
  `<span class="fl fl--${field}" data-flap="${field}" data-w="${W[field]}">${esc(value)}</span>`;

function row(p) {
  const status = p.status.toLowerCase();
  // The badge already sits beside the status, so don't repeat it in the headline.
  const lead = p.badge ? `${p.badge} · ` : '';
  const headline = lead && p.headline.startsWith(lead) ? p.headline.slice(lead.length) : p.headline;
  const badge = p.badge ? `<span class="f-badge">${esc(p.badge)}</span>` : '';
  const label =
    `Flight ${p.code}, ${p.name}. ${spokenMonth(p.month)}. Status: ${sentence(p.status)}` +
    `${p.badge ? `, ${p.badge}` : ''}. ${p.headline.replace(/ · /g, ', ')}. Read the case study.`;

  return `
        <li class="board-row">
          <a class="flight" href="${esc(href(`work/${p.slug}/`))}" data-slug="${esc(p.slug)}" data-name="${esc(p.name)}" data-status="${status}" aria-label="${esc(label)}">
            ${flap('code', p.code)}
            ${flap('board', p.board)}
            ${flap('month', p.month)}
            <span class="lamp" aria-hidden="true"></span>
            ${flap('status', p.status)}
            <span class="f-head">${badge ? badge.replace('f-badge', 'f-badge f-badge--inline') : ''}<span class="f-mm">${esc(p.month)} · </span>${esc(headline)}</span>
            ${badge}
            <span class="f-go" aria-hidden="true">${ICON.arrowUpRight}</span>
          </a>
        </li>`;
}

// Boarding pass shell, cloned by pass.js and filled from the clicked row.
function passTemplate() {
  const home = CITIES.BOM;
  const field = (k, label) =>
    `<div class="bp-field"><span class="bp-k">${label}</span><span class="bp-v" data-k="${k}"></span></div>`;
  return `
    <template id="bp-tpl">
      <div class="bp-overlay" aria-hidden="true">
        <div class="bp-veil"></div>
        <div class="bp">
          <div class="bp-main">
            <div class="bp-top mono"><span>Boarding pass</span><span data-k="code"></span></div>
            <div class="bp-route">
              <div class="bp-port"><span class="bp-iata">${esc(home.code)}</span><span class="bp-sub mono">${esc(home.name)}</span></div>
              <div class="bp-path"><span class="bp-dash"></span>${ICON.plane}<span class="bp-dash"></span></div>
              <div class="bp-port bp-port--to"><span class="bp-dest" data-k="name"></span><span class="bp-sub mono">Case study</span></div>
            </div>
            <div class="bp-grid mono">${field('code', 'Flight')}${field('month', 'Month')}${field('status', 'Status')}</div>
            <div class="bp-stamp mono">Boarding</div>
          </div>
          <div class="bp-stub mono">
            <span class="bp-k">Flight</span><span class="bp-v" data-k="code"></span>
            <span class="bp-k">Month</span><span class="bp-v" data-k="month"></span>
            <span class="bp-bar" data-k="bar"></span>
          </div>
        </div>
      </div>
    </template>`;
}

export function board() {
  // Phone rows are a grid of whole cells: flight + lamp + status, then destination + arrow.
  const phone = { 'w-row': Math.max(W.code + 1 + W.status, W.board + 1), 'col-lamp': W.code + 1, 'col-status': W.code + 2 };
  const widths = [...FIELDS.map((f) => `--w-${f}:${W[f]}`), ...Object.entries(phone).map(([k, v]) => `--${k}:${v}`)].join(';');
  const cols = FIELDS.map((f) => `<span class="c-${f}">${HEAD[f]}</span>`).join('');

  return `
<section class="board-section" id="board" aria-labelledby="board-title" style="${widths}">
  <div class="board-lamps" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="section-inner">
    <header class="board-intro">
      <p class="section-label">Now boarding</p>
      <h2 class="section-title board-title" id="board-title">${PRODUCTS.length} AI products built in 2026</h2>
      <p class="board-hint mono">Pick a flight to read the case study</p>
    </header>
    <div class="board">
      <div class="board-bar">
        <p class="board-name mono"><span class="board-icon">${ICON.plane}</span><span>Departures</span><span class="board-dot" aria-hidden="true">·</span><span lang="hi">प्रस्थान</span></p>
        <p class="board-clock mono" aria-hidden="true"><span>${esc(CITIES.BOM.code)}</span><span class="fl fl--clock" data-clock data-w="5">--:--</span><span>IST</span></p>
      </div>
      <div class="board-grid">
        <div class="board-cols mono" aria-hidden="true">${cols}</div>
        <ol class="board-rows">${PRODUCTS.map(row).join('')}
        </ol>
      </div>
    </div>
  </div>${passTemplate()}
</section>`;
}
