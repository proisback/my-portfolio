// Full-document renderers for the generated pages: one case study per product
// (work/<slug>/), the plain "Read as a page" view (read/) and the origin comic
// (comic/). Pure functions returning HTML strings. They run in Node via
// scripts/generate-pages.mjs and are never shipped to the browser.
import {
  SITE,
  PROFILE,
  STATS,
  HERO_PASS,
  CITIES,
  SEGMENTS,
  TESTIMONIALS,
  PRODUCTS,
  PRINCIPLES,
  CONTACT,
  FOOTER,
  COMIC,
} from '../content.js';
import { esc, href, link, ICON, barcode } from './shared.js';

const pad = (n) => String(n).padStart(2, '0');
const isExternal = (path) => /^https?:/.test(href(path));
const LAMP = { LIVE: 'live', PROTOTYPE: 'proto', LAUNCHED: 'launched' };

const ARROW = {
  left: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  right: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};

// Sets html.vt-in when the page arrives through a cross-document view
// transition, so the pass morphs from the departures board instead of also
// playing its own entrance. Must be a classic head script to run before the
// first frame (pagereveal fires then).
const VT_HOOK =
  "<script>addEventListener('pagereveal',function(e){if(e.viewTransition)document.documentElement.classList.add('vt-in')})</script>";

function lamp(status) {
  return `<span class="pg-lamp pg-lamp--${LAMP[status] || 'live'}" aria-hidden="true"></span>`;
}

// A link with a trailing icon; external links also announce the new tab.
function action(path, label, cls) {
  const ext = isExternal(path);
  const icon = ext ? ICON.arrowUpRight : ICON.book;
  const hint = ext ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '';
  return link(path, `<span>${esc(label)}</span>${icon}${hint}`, cls);
}

/* ---------- Document shell ---------- */

function doc({ title, description, path, page, body, current = '' }) {
  const url = SITE.url + path;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#F5EFE1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(url)}">
  <meta property="og:type" content="${page === 'work' ? 'article' : 'website'}">
  <meta property="og:site_name" content="${esc(PROFILE.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${esc(SITE.url)}og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  ${VT_HOOK}
  <script type="module" src="/src/page.js"></script>
</head>
<body class="pg pg--${page}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${nav(current)}
  <main id="main" tabindex="-1">
${body}
  </main>
  ${footer(current)}
  <div class="grain" aria-hidden="true"></div>
</body>
</html>
`;
}

function nav(current) {
  const here = (name) => (current === name ? ' aria-current="page"' : '');
  return `<header class="pg-nav">
    <nav class="pg-nav-inner" aria-label="Primary">
      <a class="pg-logo" href="${href('')}" aria-label="${esc(PROFILE.name)}, home">
        <span class="pg-mark" aria-hidden="true">pm</span><span class="pg-name" aria-hidden="true">${esc(PROFILE.name)}</span>
      </a>
      <div class="pg-links">
        <a class="pg-link" href="${href('')}#board" aria-label="All departures"><span class="pg-long">All departures</span><span class="pg-short">Departures</span></a>
        <a class="pg-link" href="${href('read/')}"${here('read')} aria-label="Read as a page"><span class="pg-long">Read as a page</span><span class="pg-short">Read</span></a>
        ${link(PROFILE.resume, 'Resume', 'btn btn--ink btn--sm pg-resume')}
      </div>
    </nav>
  </header>`;
}

function footer(current) {
  const [a, b] = PROFILE.thesis;
  const here = (name) => (current === name ? 'aria-current="page"' : '');
  return `<footer class="pg-foot">
    <div class="pg-foot-inner">
      <p class="pg-foot-quote"><span>${esc(a)}</span> <span class="pg-foot-accent">${esc(b)}</span></p>
      <nav class="pg-foot-links" aria-label="More from Prateek">
        ${link(FOOTER.fieldGuides.href, esc(FOOTER.fieldGuides.label))}
        ${link(FOOTER.comic.href, esc(FOOTER.comic.label), '', here('comic'))}
        <a href="${href('')}">Back to the flight</a>
      </nav>
      <div class="pg-foot-base mono"><span>${esc(FOOTER.credit)}</span><span>© 2026 ${esc(PROFILE.name)}</span></div>
    </div>
  </footer>`;
}

/* ---------- Work pages ---------- */

function field(key, value, cls = '') {
  return `<div class="wp-field${cls}"><span class="wp-k mono">${esc(key)}</span><span class="wp-v">${value}</span></div>`;
}

function pass(p, i) {
  const [date, ...crew] = p.meta.split(' · ');
  const long = p.name.length > 18 ? ' wp-name--long' : '';
  const gate = pad(i + 1);
  return `
    <header class="wp-hero">
      <p class="wp-kicker mono"><a href="${href('')}#board">Departures</a><span aria-hidden="true">/</span><span>Case study ${gate} of ${pad(PRODUCTS.length)}</span></p>
      <article class="wp-pass" style="view-transition-name: pass-${esc(p.slug)}" aria-labelledby="pass-title">
        <div class="wp-pass-main">
          <div class="wp-band mono"><span class="wp-band-l">${ICON.plane}<span>Boarding pass</span></span><span>${esc(p.code)}</span></div>
          <div class="wp-pass-body">
            <div class="wp-row">
              ${field('Passenger', esc(HERO_PASS.passenger))}
              ${field('Date', esc(date))}
              ${field('Gate', gate)}
            </div>
            <h1 class="wp-name${long}" id="pass-title">${esc(p.name)}</h1>
            <p class="wp-dest"><span class="wp-k mono">Destination</span><span class="wp-dest-v">${esc(p.kind)}</span></p>
            ${p.badge ? `<p class="wp-stamp mono"><span class="visually-hidden">Role: </span>${esc(p.badge)}</p>` : ''}
            <div class="wp-row wp-row--foot">
              ${field('Crew', esc(crew.join(' · ')))}
              ${field('Status', `${lamp(p.status)}<span>${esc(p.status)}</span>`, ' wp-field--status')}
            </div>
          </div>
        </div>
        <div class="wp-stub" aria-hidden="true">
          <div class="wp-stub-f wp-stub-f--code"><span class="wp-k mono">Flight</span><span class="wp-stub-code">${esc(p.code)}</span></div>
          <div class="wp-stub-f"><span class="wp-k mono">Passenger</span><span class="wp-stub-v mono">${esc(HERO_PASS.passenger)}</span></div>
          <div class="wp-stub-pair">
            <div class="wp-stub-f"><span class="wp-k mono">Boarding</span><span class="wp-stub-v mono">${esc(p.month)}</span></div>
            <div class="wp-stub-f"><span class="wp-k mono">Gate</span><span class="wp-stub-v mono">${gate}</span></div>
          </div>
          ${barcode(p.code, 46, 64)}
        </div>
      </article>
    </header>`;
}

function intro(p) {
  const tags = p.tags.map((t) => `<li>${esc(t)}</li>`).join('');
  const links = p.links
    .map((l, k) => action(l.href, l.label, k === 0 ? 'btn btn--marigold' : 'btn btn--ghost'))
    .join('');
  const shot = p.image
    ? `
      <figure class="wp-shot reveal">
        <div class="wp-device"><img src="${href(p.image)}" alt="Screenshot of ${esc(p.name)} on a phone" width="860" height="1864" loading="lazy" decoding="async"></div>
        <figcaption class="mono">Fig. 1 · ${esc(p.name)}</figcaption>
      </figure>`
    : '';
  return `
    <section class="wp-intro${p.image ? ' wp-intro--shot' : ''}" aria-labelledby="brief-title">
      <div class="wp-intro-copy">
        <h2 class="visually-hidden" id="brief-title">Overview</h2>
        <p class="wp-tagline">${esc(p.tagline)}</p>
        <p class="wp-summary">${p.summary}</p>
        <ul class="wp-tags" aria-label="What this shows">${tags}</ul>
        <div class="wp-links">${links}</div>
      </div>${shot}
    </section>`;
}

function section(s, k, total) {
  const id = `sec-${pad(k + 1)}`;
  const paras = (s.html || []).map((h) => `<p>${h}</p>`).join('');
  const list = s.list ? `<ul class="wp-list">${s.list.map((li) => `<li>${li}</li>`).join('')}</ul>` : '';
  const stats = s.stats
    ? `<dl class="wp-stats">${s.stats
        .map((st) => `<div class="wp-stat"><dt>${esc(st.label)}</dt><dd>${esc(st.value)}</dd></div>`)
        .join('')}</dl>`
    : '';
  return `
      <section class="wp-sec reveal" aria-labelledby="${id}">
        <div class="wp-sec-head">
          <p class="wp-sec-idx mono" aria-hidden="true"><span>${pad(k + 1)}</span><span class="wp-sec-of">/ ${pad(total)}</span></p>
          <h2 class="wp-sec-title" id="${id}">${esc(s.h)}</h2>
        </div>
        <div class="wp-sec-body">${paras}${list}${stats}</div>
      </section>`;
}

function hop(p, dir) {
  const label = dir === 'prev' ? `${ARROW.left}<span>Previous flight</span>` : `<span>Next flight</span>${ARROW.right}`;
  return `
        <a class="wp-hop wp-hop--${dir}" href="${href(`work/${p.slug}/`)}">
          <span class="wp-hop-dir mono">${label}</span>
          <span class="wp-hop-code mono">${esc(p.code)}</span>
          <span class="wp-hop-name">${esc(p.name)}</span>
          <span class="wp-hop-kind">${esc(p.kind)}</span>
          <span class="wp-hop-status mono">${lamp(p.status)}${esc(p.status)}</span>
        </a>`;
}

export function workPage(p, index) {
  const n = PRODUCTS.length;
  const prev = PRODUCTS[(index - 1 + n) % n];
  const next = PRODUCTS[(index + 1) % n];
  const body = `${pass(p, index)}
    ${intro(p)}
    <div class="wp-body">${p.sections.map((s, k) => section(s, k, p.sections.length)).join('')}
    </div>
    <nav class="wp-onward" aria-label="More flights">
      <p class="section-label">Connecting flights</p>
      <div class="wp-hops">${hop(prev, 'prev')}${hop(next, 'next')}
      </div>
      <a class="btn btn--ink" href="${href('')}#board">${ICON.plane}<span>Back to departures</span></a>
    </nav>`;
  return doc({
    title: `${p.name} · ${p.kind} | ${PROFILE.name}`,
    description: p.tagline,
    path: `work/${p.slug}/`,
    page: 'work',
    body,
  });
}

/* ---------- Read as a page ---------- */

function quote(key) {
  const t = TESTIMONIALS[key];
  if (!t) return '';
  return `
          <figure class="rp-quote">
            <blockquote><p>${esc(t.text)}</p></blockquote>
            <figcaption><span class="rp-quote-name">${esc(t.name)}</span><span class="rp-quote-role mono">${esc(t.role)}</span></figcaption>
          </figure>`;
}

function stopArticle(s) {
  const city = CITIES[s.city];
  const role = s.role
    ? `<p class="rp-role"><strong>${esc(s.role)}</strong>${s.org ? `<span>${esc(s.org)}</span>` : ''}</p>`
    : '';
  const metrics = s.metrics
    ? `<ul class="rp-metrics">${s.metrics
        .map((m) => `<li><span class="rp-metric-v">${esc(m.value)}</span><span class="rp-metric-l">${esc(m.label)}</span></li>`)
        .join('')}</ul>`
    : '';
  const accolade = s.accolade
    ? `<p class="rp-accolade">${link(s.accolade.href, `${esc(s.accolade.text)} ${ICON.arrowUpRight}`)}</p>`
    : '';
  return `
        <article class="rp-stop" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title">
          <p class="rp-meta mono"><span class="rp-code">${esc(city.code)}</span><span>${esc(s.label)}</span><span class="rp-years">${esc(s.years)}</span></p>
          <h3 id="${esc(s.id)}-title">${esc(s.title)}</h3>
          ${role}
          ${s.body.map((b) => `<p>${esc(b)}</p>`).join('')}
          ${metrics}${accolade}${s.quote ? quote(s.quote) : ''}
        </article>`;
}

function legDivider(s) {
  const from = CITIES[s.from];
  const to = CITIES[s.to];
  return `
        <p class="rp-leg mono" aria-label="Flight from ${esc(from.name)} to ${esc(to.name)}, ${esc(s.year)}"><span aria-hidden="true">${esc(from.code)}</span><span class="rp-leg-plane" aria-hidden="true">${ICON.plane}</span><span aria-hidden="true">${esc(to.code)}</span><span class="rp-leg-year" aria-hidden="true">${esc(s.year)}</span></p>`;
}

// The cities flown through, in order: "Mumbai → Jamshedpur → Chennai → Mumbai".
function route(segments) {
  const cities = [];
  for (const s of segments) {
    const code = s.leg ? s.to : s.city;
    if (code && cities[cities.length - 1] !== code) cities.push(code);
  }
  return cities
    .map((c) => `<span>${esc(CITIES[c].name)}</span>`)
    .join(`<span class="rp-route-arrow" aria-hidden="true">${ARROW.right}</span><span class="visually-hidden"> to </span>`);
}

function productArticle(p) {
  const live = p.links[0];
  return `
        <article class="rp-product" id="${esc(p.slug)}" aria-labelledby="${esc(p.slug)}-title">
          <p class="rp-meta mono"><span class="rp-code">${esc(p.code)}</span><span>${esc(p.meta)}</span><span class="rp-status">${lamp(p.status)}${esc(p.status)}</span></p>
          <h3 id="${esc(p.slug)}-title">${esc(p.name)}${p.badge ? ` <span class="rp-badge mono">${esc(p.badge)}</span>` : ''}</h3>
          <p class="rp-kind">${esc(p.kind)}</p>
          <p class="rp-tagline">${esc(p.tagline)}</p>
          <p>${p.summary}</p>
          <p class="rp-links">
            <a href="${href(`work/${p.slug}/`)}"><span>Read the case study</span>${ARROW.right}</a>
            ${live ? action(live.href, live.label, '') : ''}
          </p>
        </article>`;
}

export function readPage() {
  const journey = SEGMENTS.filter((s) => !s.thesis);
  const thesis = SEGMENTS.find((s) => s.thesis);
  const stats = STATS.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('');
  const claim = esc(PROFILE.claim).replace('builds with AI', '<span class="rp-mark">builds with AI</span>');
  const toc = [
    ['journey', 'The flight'],
    ['thesis', 'The thesis'],
    ['departures', 'Departures'],
    ['principles', 'How I think'],
    ['contact', 'Contact'],
  ];

  const body = `
    <div class="rp">
      <header class="rp-hero">
        <p class="rp-mode mono">Plain-text edition · <a href="${href('')}">Board the 3D flight instead</a></p>
        <p class="rp-eyebrow mono">${esc(PROFILE.eyebrow)}</p>
        <h1 class="rp-name">${esc(PROFILE.name)}</h1>
        <p class="rp-claim">${claim}</p>
        <p class="rp-intro">${esc(PROFILE.intro)}</p>
        <dl class="rp-stats">${stats}</dl>
        <p class="rp-avail mono"><span class="live-dot" aria-hidden="true"></span>${esc(PROFILE.availabilityLong)}</p>
        <div class="rp-ctas">
          ${link(PROFILE.resume, 'View resume', 'btn btn--ink')}
          ${action(PROFILE.calendly, CONTACT.book, 'btn btn--ghost')}
          <a class="btn btn--ghost" href="mailto:${esc(PROFILE.email)}">${ICON.mail}<span>Email me</span></a>
        </div>
      </header>

      <nav class="rp-toc" aria-labelledby="toc-title">
        <h2 class="rp-toc-title mono" id="toc-title">Itinerary</h2>
        <ol>${toc
          .map(([id, label], i) => `<li><a href="#${id}"><span class="rp-toc-n mono">${pad(i + 1)}</span><span class="rp-toc-l">${esc(label)}</span><span class="rp-toc-dots" aria-hidden="true"></span>${ARROW.right}</a></li>`)
          .join('')}</ol>
      </nav>

      <section class="rp-sec" id="journey" aria-labelledby="journey-title">
        <p class="section-label">01 · The flight</p>
        <h2 class="rp-h2 rp-route" id="journey-title">${route(journey)}</h2>
        ${journey.map((s) => (s.leg ? legDivider(s) : stopArticle(s))).join('')}
      </section>

      <section class="rp-sec rp-thesis" id="thesis" aria-labelledby="thesis-title">
        <p class="section-label">02 · ${esc(thesis.label)}, ${esc(thesis.years)}</p>
        <h2 class="rp-thesis-line" id="thesis-title"><span>${esc(PROFILE.thesis[0])}</span> <span class="rp-thesis-accent">${esc(PROFILE.thesis[1])}</span></h2>
        ${thesis.body.map((b) => `<p>${esc(b)}</p>`).join('')}
      </section>

      <section class="rp-sec" id="departures" aria-labelledby="departures-title">
        <p class="section-label">03 · Departures</p>
        <h2 class="rp-h2" id="departures-title">${esc(STATS[3].value)} ${esc(STATS[3].label)}</h2>
        ${PRODUCTS.map(productArticle).join('')}
      </section>

      <section class="rp-sec" id="principles" aria-labelledby="principles-title">
        <p class="section-label">04 · How I think</p>
        <h2 class="rp-h2" id="principles-title">${esc(PRINCIPLES.title)}</h2>
        <p class="rp-lead">${esc(PRINCIPLES.lead)}</p>
        <ol class="rp-principles">${PRINCIPLES.items
          .map((it, i) => `<li><span class="rp-p-n mono" aria-hidden="true">${pad(i + 1)}</span><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></li>`)
          .join('')}</ol>
      </section>

      <section class="rp-sec" id="contact" aria-labelledby="contact-title">
        <p class="section-label">05 · Contact</p>
        <h2 class="rp-h2" id="contact-title">${esc(CONTACT.title)}</h2>
        ${CONTACT.body.map((b) => `<p>${esc(b)}</p>`).join('')}
        <ul class="rp-contact">
          <li>${ICON.calendar}${action(PROFILE.calendly, CONTACT.book, '')}</li>
          <li>${ICON.mail}<a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a></li>
          <li>${ICON.linkedin}${action(PROFILE.linkedin, PROFILE.linkedinLabel, '')}</li>
          <li>${ICON.pin}<span>${esc(PROFILE.location)}</span></li>
        </ul>
        <p class="rp-avail mono"><span class="live-dot" aria-hidden="true"></span>${esc(PROFILE.availabilityLong)}</p>
      </section>
    </div>`;

  return doc({
    title: `Read as a page | ${PROFILE.name}`,
    description: `${PROFILE.name}, ${PROFILE.claim} The whole journey and all ${PRODUCTS.length} products as one plain, printable page.`,
    path: 'read/',
    page: 'read',
    body,
    current: 'read',
  });
}

/* ---------- Origin comic ---------- */

export function comicPage() {
  const total = COMIC.pages.length;
  const [first, ...rest] = COMIC.title.split('. ');
  const pages = COMIC.pages
    .map((desc, i) => {
      const n = i + 1;
      const name = desc.split('. ')[0];
      const load = n === 1 ? 'fetchpriority="high"' : 'loading="lazy"';
      return `
        <li class="cp-page${n === 1 ? '' : ' reveal'}">
          <figure>
            <div class="cp-frame"><img src="${href(`images/comic-story/${n}.webp`)}" alt="Comic page ${n} of ${total}: ${esc(desc)}" width="1080" height="864" ${load} decoding="async"></div>
            <figcaption class="mono" aria-hidden="true"><span>Page ${pad(n)} / ${pad(total)}</span><span>${esc(name)}</span></figcaption>
          </figure>
        </li>`;
    })
    .join('');

  const body = `
    <header class="cp-hero">
      <p class="section-label">Origin story · ${total} pages</p>
      <h1 class="cp-title"><span>${esc(first)}.</span> <span class="cp-title-accent">${esc(rest.join('. '))}</span></h1>
      <p class="cp-lead">${esc(COMIC.lead)}</p>
    </header>
    <ol class="cp-pages" aria-label="Comic pages">${pages}
    </ol>
    <div class="cp-end">
      <a class="btn btn--ink" href="${href('')}">${ARROW.left}<span>Back to home</span></a>
      <a class="btn btn--ghost" href="${href('')}#board">${ICON.plane}<span>See the products</span></a>
    </div>`;

  return doc({
    title: `The origin comic | ${PROFILE.name}`,
    description: `${COMIC.title} ${COMIC.lead}`,
    path: 'comic/',
    page: 'comic',
    body,
    current: 'comic',
  });
}
