// Split-flap departures board. Server HTML holds the real text in
// <span data-flap>; this turns each into fixed-width flap cells and runs every
// flip from one requestAnimationFrame scheduler (transforms + opacity only).
import { initPass } from './pass.js';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·-%';
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const active = new Set();
let raf = 0;

const rnd = (n) => (Math.random() * n) | 0;
const now = () => performance.now();

const TPL = document.createElement('span');
TPL.className = 'fc';
TPL.innerHTML =
  '<span class="fh t"><i> </i></span><span class="fh b"><i> </i></span><span class="fh t f"><i> </i></span><span class="fh b f"><i> </i></span>';

// <span data-flap>TEXT</span> -> w cells, all blank until the board reveals.
// Each cell keeps its four Text nodes so a flip only rewrites `.data`.
function flapify(el) {
  const value = el.textContent.trim();
  const w = +el.dataset.w || value.length;
  el.dataset.value = value;
  el.textContent = '';
  el.setAttribute('aria-hidden', 'true');
  const cells = [];
  for (let i = 0; i < w; i++) {
    const n = TPL.cloneNode(true);
    const [t, b, ft, fb] = [...n.children].map((h) => h.firstChild.firstChild);
    cells.push({ t, b, ft, fb, top: n.children[2].style, bot: n.children[3].style, cur: ' ', q: [] });
    el.appendChild(n);
  }
  el.classList.add('is-flap');
  return { el, w, value, cells };
}

function show(c, ch) {
  c.cur = c.t.data = c.b.data = ch;
}

// Queue n random characters then `to` on one cell, starting at time `at`.
// A busy cell is left alone unless `force`, which re-routes it after the
// flip already in progress.
function flip(c, to, n, at, d, force) {
  if (RM.matches) return show(c, to);
  const seq = [];
  while (n-- > 0) seq.push(CHARS[rnd(CHARS.length)]);
  seq.push(to);
  if (active.has(c)) {
    if (force) c.q.splice(c.on ? 1 : 0, Infinity, ...seq);
    return;
  }
  if (seq.length === 1 && to === c.cur) return;
  c.q = seq;
  c.t0 = at;
  c.d = d || 70 + rnd(20);
  c.on = false;
  active.add(c);
  if (!raf) raf = requestAnimationFrame(tick);
}

// Static top shows the next char (revealed as the leaf falls), the falling
// leaf carries the current top half, the landing leaf the next bottom half.
// Leaves keep a 3D transform for the whole run so their layers persist.
function setup(c) {
  c.t.data = c.fb.data = c.q[0];
  c.ft.data = c.cur;
  c.top.cssText = 'visibility:visible;transform:rotateX(0deg)';
  c.bot.cssText = 'visibility:hidden;transform:rotateX(90deg)';
  c.on = true;
  c.down = false;
  c.s = 0;
}

function tick(t) {
  raf = 0;
  for (const c of active) {
    while (c.q.length && t >= c.t0 + c.d) {
      if (!c.on) setup(c);
      c.cur = c.b.data = c.q.shift();
      c.t0 += c.d;
      c.on = false;
    }
    if (!c.q.length) {
      c.top.cssText = c.bot.cssText = '';
      active.delete(c);
    } else if (t >= c.t0) {
      if (!c.on) setup(c);
      draw(c, (t - c.t0) / c.d);
    }
  }
  if (active.size) raf = requestAnimationFrame(tick);
}

// Gravity fold over 84% of the flip (leaf accelerates as it falls), then the
// landed leaf bounces off the stop. Shade deepens in steps as a leaf turns
// from the lamp (stepped so a flip restyles only on a step change).
function shade(st, c, v) {
  if (c.s !== v) st.setProperty('--s', (c.s = v) * 0.17);
}

function draw(c, u) {
  const L = 0.84;
  const a = u < L ? 180 * (0.3 * (u / L) + 0.7 * (u / L) ** 2) : 180;
  if (a < 90) {
    c.top.transform = `rotateX(${-a.toFixed(1)}deg)`;
    return shade(c.top, c, (a / 30) | 0);
  }
  if (!c.down) {
    c.down = true;
    c.s = -1;
    c.top.visibility = 'hidden';
    c.bot.visibility = 'visible';
  }
  c.bot.transform = `rotateX(${(a < 180 ? 180 - a : 7 * Math.sin((Math.PI * (u - L)) / (1 - L))).toFixed(1)}deg)`;
  shade(c.bot, c, ((180 - a) / 36) | 0);
}

// Set a whole field to `str` (padded to its width), cell i starting at at + i*step.
function setField(f, str, at, { n = () => 0, step = 15, d, force } = {}) {
  const s = str.padEnd(f.w).slice(0, f.w);
  f.cells.forEach((c, i) => flip(c, s[i], n(s[i]), at + i * step, d, force));
}

// The board sits far down the page, so its ~1,100 flap cells are built only
// when the reader is within a couple of screens of it, keeping first load
// light. The server-rendered text is in place until then.
export function initBoard() {
  const section = document.getElementById('board');
  const boardEl = section?.querySelector('.board');
  if (!boardEl) return;
  if (!('IntersectionObserver' in window)) return setupBoard(section, boardEl);
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setupBoard(section, boardEl);
    },
    { rootMargin: '200% 0px' }
  );
  io.observe(section);
}

function setupBoard(section, boardEl) {
  const rows = [...section.querySelectorAll('.flight')].map((a) => {
    const f = {};
    a.querySelectorAll('[data-flap]').forEach((el) => (f[el.dataset.flap] = flapify(el)));
    return { a, f, order: ['code', 'board', 'month', 'status'].map((k) => f[k]).filter(Boolean) };
  });
  const byA = new Map(rows.map((r) => [r.a, r]));

  let revealed = false;
  let inView = false;
  let amb = 0;

  // Rows clatter in top to bottom (90ms apart), cells sweep left to right
  // (15ms apart); real letters spin 2-5 random flaps, blanks sometimes one or two.
  const reveal = () => {
    revealed = true;
    const t0 = now() + 40;
    rows.forEach((r, ri) => {
      let off = 0;
      for (const f of r.order) {
        setField(f, f.value, t0 + ri * 90 + off * 15 + rnd(12), {
          n: (ch) => (ch === ' ' ? (Math.random() < 0.4 ? 1 + rnd(2) : 0) : 2 + rnd(4)),
        });
        off += f.w;
      }
    });
  };

  // Every 5-7s while in view, one row refreshes its status or month in place.
  const ambient = () => {
    clearTimeout(amb);
    amb = setTimeout(() => {
      if (!inView) return;
      if (revealed && !document.hidden) {
        const r = rows[rnd(rows.length)];
        const pick = [r.f.status, r.f.month].filter((f) => f && f.el.offsetWidth);
        const f = pick[rnd(pick.length)];
        if (f && !r.a.classList.contains('is-boarding')) {
          setField(f, f.value, now(), { n: () => 1 + rnd(3), step: 40, d: 80 });
        }
      }
      ambient();
    }, 5000 + rnd(2000));
  };

  if (RM.matches || !('IntersectionObserver' in window)) {
    reveal();
    inView = true;
  } else {
    new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (!revealed && e.intersectionRatio >= 0.25) reveal();
        if (inView) ambient();
        else clearTimeout(amb);
      },
      { threshold: [0, 0.25] }
    ).observe(boardEl);
  }

  // Hover / focus: the row lights up (CSS) and its status quickly re-flips.
  let lit = null;
  const wake = (a) => {
    const r = byA.get(a);
    if (!r || !revealed || a === lit || a.classList.contains('is-boarding')) return;
    lit = a;
    const f = r.f.status;
    setField(f, f.value, now(), { n: (ch) => (ch === ' ' ? 0 : 1 + rnd(2)), step: 22, d: 55 });
  };
  const list = section.querySelector('.board-rows');
  list.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'mouse') wake(e.target.closest('.flight'));
  });
  list.addEventListener('pointerleave', () => (lit = null));
  list.addEventListener('focusin', (e) => wake(e.target.closest('.flight')));
  list.addEventListener('focusout', () => (lit = null));

  // Mumbai clock: HH:MM flaps, only the digits that change flip.
  const clockEl = section.querySelector('[data-clock]');
  if (clockEl) {
    const clock = flapify(clockEl);
    clock.cells.forEach((c, i) => show(c, clock.value[i] || ' '));
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const update = () => {
      const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
      const s = `${p.hour}:${p.minute}`;
      const t = now();
      clock.cells.forEach((c, i) => (inView ? flip(c, s[i], c.cur === '-' ? 2 : 0, t + i * 60, 90) : show(c, s[i])));
    };
    update();
    setInterval(update, 30000);
  }

  initPass({
    // The clicked row's status flips to BOARDING while the pass rises.
    board(a) {
      const f = byA.get(a)?.f.status;
      if (f && f.w >= 8) setField(f, 'BOARDING', now(), { n: () => 1, step: 25, d: 60, force: true });
    },
    reset(a) {
      const f = byA.get(a)?.f.status;
      if (f) setField(f, f.value, now() + 200, { n: () => 1, step: 25, d: 70, force: true });
    },
  });
}
