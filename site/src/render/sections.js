// Closing sections: safety card (principles), "I build sites like this",
// contact ("Arrivals") with the notify form, and the footer.
// Build-time renderers: every word lands in the HTML before JS runs.
import { PROFILE, PRINCIPLES, SITES_PITCH, CONTACT, NOTIFY, FOOTER } from '../content.js';
import { esc, href, link, ICON, barcode } from './shared.js';

const MAILTO = `mailto:${PROFILE.email}?subject=Reaching%20out%20from%20your%20portfolio`;

// One stroke that draws in when its panel is revealed. `d` staggers it.
const draw = (tag, attrs, d = 0, cls = '') =>
  `<${tag} class="draw${cls ? ' ' + cls : ''}" pathLength="1" style="--d:${d}" ${attrs}/>`;

// Safety-card pictograms: ink line drawings, one per principle.
const PICTOS = [
  // Structure before speed: a framed box measured with a ruler and set square.
  [
    '<rect class="fade picto-soft" x="30" y="30" width="62" height="44" rx="2"/>',
    draw('rect', 'x="30" y="30" width="62" height="44" rx="2"'),
    draw('path', 'd="M41 46h40M41 56h28M41 66h34"', 1, 'thin'),
    draw('path', 'd="M30 18h62M30 13v10M92 13v10"', 2, 'accent-line'),
    draw('path', 'd="M116 76V22l56 54z"', 1),
    draw('path', 'd="M126 66V46l20 20z"', 2, 'thin'),
    draw('rect', 'x="16" y="86" width="168" height="18" rx="2"', 2),
    draw('path', 'd="M28 86v8M40 86v5M52 86v8M64 86v5M76 86v8M88 86v5M100 86v8M112 86v5M124 86v8M136 86v5M148 86v8M160 86v5M172 86v8"', 3, 'thin'),
  ],
  // Removal is underrated: a form where three of four steps are struck out.
  [
    draw('rect', 'x="52" y="14" width="96" height="100" rx="6"'),
    '<rect class="fade picto-accent" x="82" y="8" width="36" height="12" rx="3"/>',
    draw('rect', 'x="82" y="8" width="36" height="12" rx="3"'),
    ...[36, 56, 76].map((y, i) =>
      draw('path', `d="M64 ${y - 6}h12v12h-12zM86 ${y - 3}h46M86 ${y + 3}h30"`, 1 + i * 0.4, 'thin muted')
    ),
    draw('path', 'd="M64 90h12v12h-12zM86 93h46M86 99h30"', 2.2, 'thin'),
    ...[36, 56, 76].map((y, i) => draw('path', `d="M58 ${y}h84"`, 3 + i * 0.5, 'strike')),
    draw('path', 'd="M66.5 96.5l3.2 3.2 6-7"', 4.5, 'accent-line'),
  ],
  // AI is a lever, not a feature: a small push lifts a heavy box.
  [
    draw('path', 'd="M12 104h176"', 0, 'thin'),
    '<path class="fade picto-accent" d="M118 104l14-24 14 24z"/>',
    draw('path', 'd="M118 104l14-24 14 24z"', 1),
    draw('path', 'd="M22 96L186 72"', 1.5, 'plank'),
    `<g transform="rotate(-8.28 166 73.6)">
      <rect class="fade picto-soft" x="150" y="45.6" width="32" height="28" rx="2"/>
      ${draw('rect', 'x="150" y="45.6" width="32" height="28" rx="2"', 2.5)}
    </g>`,
    draw('path', 'd="M30 46v38M23.5 78l6.5 8 6.5-8"', 3, 'accent-line'),
    draw('path', 'd="M164 36V12M157.5 18.5l6.5-6.5 6.5 6.5"', 4),
  ],
  // Show, don't pitch: the deck gets a cross, the prototype in hand gets a tick.
  [
    draw('rect', 'x="12" y="24" width="70" height="46" rx="3"', 0, 'muted'),
    draw('path', 'd="M22 38h34M22 48h46M22 58h26"', 1, 'thin muted'),
    draw('path', 'd="M47 70v10M35 104l12-24 12 24"', 1, 'muted'),
    draw('circle', 'cx="82" cy="24" r="10"', 2, 'muted'),
    draw('path', 'd="M78 20l8 8M86 20l-8 8"', 2.6, 'muted'),
    draw('rect', 'x="124" y="10" width="44" height="78" rx="8"', 0.5),
    draw('path', 'd="M132 24h28M132 32h18M132 44h28"', 1.5, 'thin'),
    '<rect class="fade picto-accent" x="132" y="60" width="28" height="10" rx="5"/>',
    draw('path', 'd="M116 116c-3-12-2-22 6-30l9-9c3-3 8 1 5 5l-6 9"', 2),
    draw('path', 'd="M168 58c6 0 6 8 0 8M168 66c6 0 6 8 0 8M168 74c6 0 6 8 0 8M170 82c2 14-2 26-10 34"', 2.5),
    '<circle class="fade picto-accent" cx="170" cy="12" r="10"/>',
    draw('circle', 'cx="170" cy="12" r="10"', 3),
    draw('path', 'd="M165 12.5l3.5 3.5 6.5-7"', 3.5),
  ],
];

const picto = (i) =>
  `<svg class="picto" viewBox="0 0 200 120" aria-hidden="true" focusable="false">${PICTOS[i].join('')}</svg>`;

export function principles() {
  const p = PRINCIPLES;
  const panels = p.items
    .map(
      (item, i) => `
        <li class="safety-panel reveal" style="--i:${i}">
          <div class="safety-fig">
            <span class="safety-num mono" aria-hidden="true">${i + 1}</span>
            ${picto(i)}
          </div>
          <h3 class="safety-title">${esc(item.title)}</h3>
          <p class="safety-text">${esc(item.text)}</p>
        </li>`
    )
    .join('');

  return `
<section class="section safety" id="principles" aria-labelledby="principles-title">
  <div class="section-inner">
    <div class="safety-card" data-reveal>
      <div class="safety-sheet">
        <div class="safety-strip mono" aria-hidden="true">
          <span>Read before takeoff</span>
          ${ICON.plane}
          <span>Keep in seat pocket</span>
        </div>
        <div class="safety-intro reveal">
          <div>
            <p class="section-label">${esc(p.label)}</p>
            <h2 class="section-title" id="principles-title">${esc(p.title)}</h2>
          </div>
          ${p.lead ? `<p class="safety-lead">${esc(p.lead)}</p>` : ''}
        </div>
        <ol class="safety-grid">${panels}
        </ol>
      </div>
    </div>
  </div>
</section>`;
}

export function sites() {
  const s = SITES_PITCH;
  return `
<section class="section sites" id="sites" aria-labelledby="sites-title">
  <div class="section-inner sites-inner">
    <div class="sites-copy reveal">
      <p class="section-label">${esc(s.label)}</p>
      <h2 class="section-title" id="sites-title">${esc(s.title)}</h2>
      <p class="sites-body">${esc(s.body)}</p>
      <a class="btn btn--ink sites-cta" href="#contact">${ICON.plane}<span>${esc(s.cta)}</span></a>
    </div>
    <div class="sites-art reveal" aria-hidden="true">
      <div class="draft">
        <div class="draft-main">
          <div class="draft-top mono"><span>Boarding pass</span><span class="draft-tag">Draft</span></div>
          <div class="draft-field">
            <span class="draft-k mono">Passenger</span>
            <span class="draft-v draft-v--lg">You</span>
          </div>
          <div class="draft-route">
            <span class="draft-code">Idea</span>
            <span class="draft-track">
              <span class="draft-fly"><span class="draft-line"></span>${ICON.plane}</span>
            </span>
            <span class="draft-code">Live</span>
          </div>
          <div class="draft-field">
            <span class="draft-k mono">Destination</span>
            <span class="draft-v">Your next role</span>
          </div>
        </div>
        <div class="draft-stub">
          <span class="draft-k mono">Gate</span>
          <span class="draft-v">Open</span>
          ${barcode('your-next-role', 34, 40)}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function contact() {
  const c = CONTACT;
  const n = NOTIFY;
  const body = c.body.map((t) => `<p>${esc(t)}</p>`).join('');

  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="contact-sky" aria-hidden="true"></div>
  <div class="section-inner">
    <div class="contact-head reveal">
      <div>
        <p class="section-label">${esc(c.label)}</p>
        <h2 class="section-title" id="contact-title">${esc(c.title)}</h2>
      </div>
      <p class="contact-clock mono">
        <span class="contact-clock-k">Mumbai local time</span>
        <span class="contact-clock-v" id="contact-clock">IST, UTC+5:30</span>
      </p>
    </div>
    <div class="contact-grid">
      <div class="contact-main reveal">
        <div class="contact-body">${body}</div>
        <p class="contact-avail mono"><span class="live-dot" aria-hidden="true"></span>${esc(PROFILE.availabilityLong)}</p>
        <ul class="contact-list">
          <li>${link(
            PROFILE.calendly,
            `<span class="contact-book-icon">${ICON.calendar}</span><span class="contact-book-text">${esc(c.book)}</span>${ICON.arrowUpRight}`,
            'contact-book'
          )}</li>
          <li><a class="contact-row" href="${esc(MAILTO)}"><span class="contact-k mono">Email</span><span class="contact-v">${esc(PROFILE.email)}</span>${ICON.arrowUpRight}</a></li>
          <li>${link(
            PROFILE.linkedin,
            `<span class="contact-k mono">LinkedIn</span><span class="contact-v">${esc(PROFILE.linkedinLabel)}</span>${ICON.arrowUpRight}`,
            'contact-row'
          )}</li>
          <li><div class="contact-row contact-row--static"><span class="contact-k mono">Base</span><span class="contact-v">${esc(PROFILE.location)}</span>${ICON.pin}</div></li>
        </ul>
      </div>
      <div class="notify reveal" id="notify">
        <p class="notify-label mono">${esc(n.label)}</p>
        <h3 class="notify-title">${esc(n.title)}</h3>
        <p class="notify-body">${esc(n.body)}</p>
        <form class="notify-form" id="notify-form" novalidate>
          <label for="notify-email" class="visually-hidden">Email address</label>
          <div class="notify-row">
            <input type="email" id="notify-email" name="email" class="notify-input" placeholder="${esc(n.placeholder)}" autocomplete="email" required aria-describedby="notify-error" aria-invalid="false">
            <button type="submit" class="btn btn--marigold notify-btn" id="notify-submit" data-busy="${esc(n.busy)}">${esc(n.button)}</button>
          </div>
          <p class="notify-error" id="notify-error" role="alert" hidden></p>
          <p class="notify-note">${esc(n.note)}</p>
        </form>
        <div class="notify-success" id="notify-success" aria-hidden="true" tabindex="-1">
          <span class="notify-check" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <div>
            <p class="notify-success-text">${esc(n.success)}</p>
            <p class="notify-success-sub">${esc(n.successSub)}</p>
          </div>
          <span class="notify-stamp mono" aria-hidden="true">Boarded</span>
        </div>
        <div class="notify-already" id="notify-already" hidden>
          <span class="notify-check notify-check--sm" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <p class="notify-already-text">${esc(n.already)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function footer() {
  const [a, b] = PROFILE.thesis;
  const lights = Array.from({ length: 24 }, (_, i) => `<span style="--i:${i}"></span>`).join('');
  return `
<footer class="footer">
  <div class="footer-runway" aria-hidden="true">${lights}</div>
  <div class="footer-inner">
    <p class="footer-quote reveal"><span>${esc(a)}</span> <span class="footer-quote-accent">${esc(b)}</span></p>
    <div class="footer-nav reveal">
      ${link(PROFILE.calendly, `${ICON.calendar}<span>${esc(CONTACT.book)}</span>`, 'btn btn--marigold')}
      <a class="footer-link" href="${href(FOOTER.comic.href)}">${esc(FOOTER.comic.label)}</a>
      <span class="footer-social">
        <a class="btn-icon" href="${esc(MAILTO)}" aria-label="Email Prateek">${ICON.mail}</a>
        ${link(PROFILE.linkedin, ICON.linkedin, 'btn-icon', 'aria-label="Prateek on LinkedIn"')}
      </span>
    </div>
    <div class="footer-meta mono">
      <p>${esc(FOOTER.credit)}</p>
      <p>&copy; 2026 ${esc(PROFILE.name)}</p>
    </div>
  </div>
</footer>`;
}
