import { SITE, PROFILE, STATS, HERO_PASS } from '../content.js';
import { esc, href, link, ICON, barcode } from './shared.js';

export function head() {
  return `
  <title>${esc(SITE.title)}</title>
  <meta name="description" content="${esc(SITE.description)}">
  <link rel="canonical" href="${esc(SITE.url)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(SITE.title)}">
  <meta property="og:description" content="${esc(SITE.description)}">
  <meta property="og:url" content="${esc(SITE.url)}">
  <meta property="og:image" content="${esc(SITE.url)}og.jpg">
  <meta name="twitter:card" content="summary_large_image">`;
}

export function nav() {
  return `
<nav class="nav" id="nav" aria-label="Primary">
  <a class="nav-logo" href="#top">
    <span class="nav-mark" aria-hidden="true">pm</span><span class="nav-name">${esc(PROFILE.name)}</span><span class="visually-hidden">, back to top</span>
  </a>
  <div class="nav-links">
    <a href="#mumbai">The flight</a>
    <a href="#board">Departures</a>
    <a href="#principles">How I think</a>
    <a href="#contact">Contact</a>
  </div>
  <div class="nav-actions">
    <a class="nav-read" href="${href('read/')}">Quick read</a>
    ${link(PROFILE.resume, 'Resume', 'btn btn--ink btn--sm')}
  </div>
</nav>`;
}

export function hero() {
  const [first, ...rest] = PROFILE.name.split(' ');
  const stats = STATS.filter((s) => s.hero).map(
    (s) => `<li class="stat"><span class="stat-value">${esc(s.value)}</span><span class="stat-label">${esc(s.label)}</span></li>`
  ).join('');
  const claim = esc(PROFILE.claim).replace('builds with AI', '<span class="ink-mark">builds with AI</span>');

  return `
<header class="hero seg" id="top" data-beat="gate">
  <div class="hero-inner">
    <div class="hero-copy">
      <p class="eyebrow mono"><span class="live-dot" aria-hidden="true"></span>${esc(PROFILE.eyebrow)}</p>
      <h1 class="hero-name"><span class="line">${esc(first)}</span> <span class="line">${esc(rest.join(' '))}</span></h1>
      <p class="hero-claim">${claim}</p>
      <p class="hero-intro">${esc(PROFILE.intro)}</p>
      <ul class="stats" aria-label="At a glance">${stats}</ul>
      <div class="hero-ctas">
        <a class="btn btn--marigold" href="#mumbai" data-board-flight>${ICON.plane}<span>Board the flight</span></a>
        ${link(PROFILE.resume, 'View resume', 'btn btn--ghost')}
      </div>
      <p class="hero-meta mono">
        <a href="#board">Skip to the work</a>
      </p>
    </div>
    ${heroPass()}
  </div>
  <a class="scroll-cue mono" href="#mumbai" aria-label="Scroll to start the flight">
    <span>Scroll to take off</span>${ICON.arrowDown}
  </a>
</header>`;
}

function heroPass() {
  const p = HERO_PASS;
  return `
<aside class="pass pass--hero" aria-label="Boarding pass for ${esc(PROFILE.name)}">
  <div class="pass-main">
    <div class="pass-top mono"><span>Boarding pass</span><span>${esc(p.flight)}</span></div>
    <div class="pass-field"><span class="pass-k mono">Passenger</span><span class="pass-v pass-v--name">${esc(p.passenger)}</span></div>
    <div class="pass-route">
      <div class="pass-port"><span class="pass-code">${esc(p.from.code)}</span><span class="pass-sub">${esc(p.from.label)}</span></div>
      <div class="pass-path" aria-hidden="true"><span class="pass-dash"></span>${ICON.plane}<span class="pass-dash"></span></div>
      <div class="pass-port pass-port--to"><span class="pass-code">${esc(p.to.code)}</span><span class="pass-sub">${esc(p.to.label)}</span></div>
    </div>
    <div class="pass-grid">
      <div class="pass-field"><span class="pass-k mono">Class</span><span class="pass-v">${esc(p.class)}</span></div>
      <div class="pass-field"><span class="pass-k mono">Gate</span><span class="pass-v">${esc(p.gate)}</span></div>
      <div class="pass-field"><span class="pass-k mono">Seat</span><span class="pass-v">${esc(p.seat)}</span></div>
    </div>
  </div>
  <div class="pass-stub">
    <span class="pass-k mono">Flight</span><span class="pass-v">${esc(p.flight)}</span>
    <span class="pass-k mono">Seat</span><span class="pass-v">${esc(p.seat)}</span>
    ${barcode(p.passenger)}
  </div>
</aside>`;
}
