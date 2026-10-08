// The 2D layer of the journey. Works in every tier, with or without 3D:
// card reveals, the HUD (route progress + year odometer), nav state, hero tilt.

const reduce = matchMedia('(prefers-reduced-motion: reduce)');

function odometer(el) {
  const digits = el.textContent.trim().split('');
  el.textContent = '';
  el.classList.add('odo');
  const strips = digits.map(() => {
    const d = document.createElement('span');
    d.className = 'odo-digit';
    const s = document.createElement('span');
    s.className = 'odo-strip';
    s.textContent = '0123456789'.split('').join('\n');
    d.appendChild(s);
    el.appendChild(d);
    return s;
  });
  const set = (value) => {
    const v = String(value).padStart(strips.length, '0');
    if (el.getAttribute('data-value') === v) return;
    el.setAttribute('data-value', v);
    strips.forEach((s, i) => s.style.setProperty('--d', v[i]));
  };
  set(digits.join(''));
  return set;
}

function initHud(journey) {
  const hud = document.getElementById('hud');
  const track = document.getElementById('flight');
  if (!hud || !track) return;
  const segs = [...journey.querySelectorAll('.seg[data-hud]')];
  const stops = [...hud.querySelectorAll('.hud-stop')];
  const progress = document.getElementById('hud-progress');
  const plane = document.getElementById('hud-plane');
  const setYear = odometer(document.getElementById('hud-year'));
  let ticking = false;
  let lastStop = -1;

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    const inTrack = r.top < vh * 0.5 && r.bottom > vh * 0.5;
    hud.classList.toggle('is-on', inTrack);
    const p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / r.height));
    progress.style.transform = `scaleX(${p.toFixed(4)})`;
    plane.style.left = `${(p * 100).toFixed(2)}%`;

    // Exactly one segment is 'in' at a time: the one holding the midline.
    let active = segs[0];
    for (const s of segs) {
      const b = s.getBoundingClientRect();
      if (b.top <= vh * 0.55) active = s;
      s.classList.toggle('is-in', b.top < vh * 0.5 && b.bottom > vh * 0.5);
    }
    if (active) {
      setYear(active.dataset.year);
      const i = Number(active.dataset.hud);
      if (i !== lastStop) {
        stops.forEach((s, k) => {
          s.classList.toggle('is-past', k < i);
          s.classList.toggle('is-now', k === i);
          if (k === i) s.setAttribute('aria-current', 'step');
          else s.removeAttribute('aria-current');
        });
        lastStop = i;
      }
    }
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const dark = () => [
    ...document.querySelectorAll('#board, #contact'),
    ...(document.documentElement.classList.contains('is-night') ? document.querySelectorAll('#cockpit, #thesis') : []),
  ];
  let tick = false;
  const update = () => {
    tick = false;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    const y = 32;
    const isDark = dark().some((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    nav.classList.toggle('is-dark', isDark);
  };
  window.addEventListener('scroll', () => {
    if (!tick) {
      tick = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

function initHeroPass() {
  const pass = document.querySelector('.pass--hero');
  if (!pass || reduce.matches || matchMedia('(pointer: coarse)').matches) return;
  let raf = 0;
  window.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      pass.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
      pass.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    });
  }, { passive: true });
}

function initSmoothLinks() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' }
  );
  els.forEach((el) => io.observe(el));
}

export function initJourney() {
  const journey = document.getElementById('journey');
  if (journey) {
    initHud(journey);
  }
  initNav();
  initHeroPass();
  initSmoothLinks();
  initReveal();
}
