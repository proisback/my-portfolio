import { SEGMENTS, TESTIMONIALS, CITIES, STATS } from '../content.js';
import { esc, link, ICON } from './shared.js';

// Which HUD stop each segment belongs to, and the year shown on the odometer.
const HUD_INDEX = { mumbai: 0, tcs: 0, 'leg-1': 1, jamshedpur: 1, 'leg-2': 2, chennai: 2, 'leg-3': 3, marsh: 3, turn: 3, cockpit: 4, thesis: 4 };
const yearOf = (s) => String(s.year || s.years || '').match(/\d{4}/)?.[0] || '';
const segData = (s) => `data-year="${yearOf(s)}" data-hud="${HUD_INDEX[s.id] ?? 0}"`;

function quote(key) {
  const t = TESTIMONIALS[key];
  if (!t) return '';
  return `
      <figure class="quote">
        <blockquote><p>${esc(t.text)}</p></blockquote>
        <figcaption><span class="quote-name">${esc(t.name)}</span><span class="quote-role">${esc(t.role)}</span></figcaption>
      </figure>`;
}

function metrics(list) {
  if (!list) return '';
  return `<ul class="metrics">${list
    .map((m) => `<li><span class="metric-value">${esc(m.value)}</span><span class="metric-label">${esc(m.label)}</span></li>`)
    .join('')}</ul>`;
}

// Instrument-style dials for the cockpit card. Fill is decorative.
function gauges() {
  const fills = [0.8, 0.9, 0.3, 0.7];
  return `<ul class="gauges" aria-label="Instrument panel">${STATS.map((s, i) => {
    const a = -130 + fills[i] * 260;
    return `<li class="gauge">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="gauge-ring" cx="50" cy="50" r="42"/>
        <path class="gauge-arc" d="M 19.7 75.2 A 42 42 0 1 1 80.3 75.2" pathLength="100" style="--fill:${fills[i] * 100}"/>
        <g class="gauge-needle" style="--a:${a}deg"><line x1="50" y1="50" x2="50" y2="16"/></g>
        <circle class="gauge-hub" cx="50" cy="50" r="4"/>
      </svg>
      <span class="gauge-value">${esc(s.value)}</span>
      <span class="gauge-label">${esc(s.label)}</span>
    </li>`;
  }).join('')}</ul>`;
}

function stop(s) {
  const city = CITIES[s.city];
  const role = s.role
    ? `<p class="card-role"><strong>${esc(s.role)}</strong>${s.org ? `<span>${esc(s.org)}</span>` : ''}</p>`
    : '';
  const accolade = s.accolade
    ? `<p class="card-accolade">${link(s.accolade.href, `${esc(s.accolade.text)} ${ICON.arrowUpRight}`)}</p>`
    : '';
  const body = s.body.map((p) => `<p>${esc(p)}</p>`).join('');

  if (s.thesis) {
    const [a, b] = s.title.split('. ');
    return `
  <section class="seg seg--thesis" id="${s.id}" data-beat="${s.beat}" ${segData(s)} aria-labelledby="${s.id}-title">
    <div class="thesis-wrap">
      <p class="card-head mono"><span class="card-code">${esc(city.code)}</span><span>${esc(s.label)}</span><span>${esc(s.years)}</span></p>
      <h2 class="thesis" id="${s.id}-title"><span class="line">${esc(a)}.</span> <span class="line line--marigold">${esc(b)}</span></h2>
      ${body}
      <a class="btn btn--marigold" href="#board">${ICON.plane}<span>See departures</span></a>
    </div>
  </section>`;
  }

  return `
  <section class="seg seg--stop${s.gauges ? ' seg--cockpit' : ''}" id="${s.id}" data-beat="${s.beat}" data-city="${s.city}" ${segData(s)} aria-labelledby="${s.id}-title">
    <article class="card">
      <p class="card-head mono"><span class="card-code">${esc(city.code)}</span><span class="card-city">${esc(s.label)}</span><span class="card-years">${esc(s.years)}</span></p>
      <h2 class="card-title" id="${s.id}-title">${esc(s.title)}</h2>
      ${role}
      <div class="card-body">${body}</div>
      ${metrics(s.metrics)}
      ${s.gauges ? gauges() : ''}
      ${accolade}
      ${s.quote ? quote(s.quote) : ''}
      <span class="card-reg card-reg--tl" aria-hidden="true"></span><span class="card-reg card-reg--br" aria-hidden="true"></span>
    </article>
  </section>`;
}

function leg(s) {
  const from = CITIES[s.from];
  const to = CITIES[s.to];
  return `
  <section class="seg seg--leg" id="${s.id}" data-beat="${s.beat}" ${segData(s)} aria-label="Flight from ${esc(from.name)} to ${esc(to.name)}, ${esc(s.year)}">
    <p class="leg-caption mono">
      <span class="leg-port"><b>${esc(from.code)}</b>${esc(from.name)}</span>
      <span class="leg-line" aria-hidden="true">${ICON.plane}</span>
      <span class="leg-port"><b>${esc(to.code)}</b>${esc(to.name)}</span>
      <span class="leg-year">${esc(s.year)}</span>
    </p>
  </section>`;
}

export function segments() {
  return `
<div class="track" id="flight" aria-label="The flight: Prateek's career, city by city">
  ${SEGMENTS.map((s) => (s.leg ? leg(s) : stop(s))).join('')}
</div>`;
}

// Fixed flight HUD: route progress (also navigation) and the year odometer.
export function hud() {
  const stops = [
    { id: 'mumbai', code: 'BOM', year: '2012' },
    { id: 'jamshedpur', code: 'IXW', year: '2022' },
    { id: 'chennai', code: 'MAA', year: '2023' },
    { id: 'marsh', code: 'BOM', year: '2025' },
    { id: 'cockpit', code: '2026', year: '2026' },
  ];
  return `
<nav class="hud" id="hud" aria-label="Flight progress">
  <div class="hud-year mono" aria-hidden="true"><span class="hud-year-label">Year</span><span class="hud-year-value" id="hud-year">2012</span></div>
  <ol class="hud-route">
    ${stops
      .map(
        (s, i) =>
          `<li><a class="hud-stop mono" href="#${s.id}" data-stop="${i}" aria-label="Jump to ${esc(s.code)} ${esc(s.year)}"><span class="hud-dot" aria-hidden="true"></span><span>${esc(s.code)}</span></a></li>`
      )
      .join('')}
  </ol>
  <div class="hud-track" aria-hidden="true"><span class="hud-progress" id="hud-progress"></span><span class="hud-plane" id="hud-plane">${ICON.plane}</span></div>
</nav>`;
}
