// Boarding pass transition: click a departures row, a pass rises from it,
// gets stamped, the stub tears off, then we navigate. The pass carries
// view-transition-name pass-<slug> so supporting browsers morph it into the
// case study's hero pass. Reduced motion and modified clicks navigate as normal.
const RM = matchMedia('(prefers-reduced-motion: reduce)');
let busy = false;
let overlay = null;
let timer = 0;

// Same bars as render/shared.js barcode(code, 46, 56) on the case study pass.
function barcode(seed, bars = 46, height = 56) {
  let x = 0;
  let h = 2166136261;
  let r = '';
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  for (let i = 0; i < bars; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const w = 1 + (Math.abs(h) % 3);
    if (i % 2 === 0) r += `<rect x="${x}" y="0" width="${w}" height="${height}"/>`;
    x += w + 1;
  }
  return `<svg class="barcode" viewBox="0 0 ${x} ${height}" preserveAspectRatio="none" aria-hidden="true" fill="currentColor">${r}</svg>`;
}

function board(a, tpl, hooks) {
  const val = (k) => a.querySelector(`[data-flap="${k}"]`)?.dataset.value || '';
  overlay = tpl.content.firstElementChild.cloneNode(true);
  const $ = (s) => overlay.querySelector(s);
  const data = { code: val('code'), month: val('month'), status: val('status'), name: a.dataset.name };
  overlay.querySelectorAll('[data-k]').forEach((n) => {
    if (n.dataset.k in data) n.textContent = data[n.dataset.k];
  });
  $('[data-k="bar"]').innerHTML = barcode(data.code);
  const pass = $('.bp');
  pass.dataset.status = a.dataset.status;
  pass.style.viewTransitionName = `pass-${a.dataset.slug}`;
  document.body.appendChild(overlay);
  a.classList.add('is-boarding');
  hooks.board?.(a);

  // FLIP: start folded flat inside the row, rise to the centre of the screen.
  const r = a.getBoundingClientRect();
  const p = pass.getBoundingClientRect();
  const dx = r.left + r.width / 2 - (p.left + p.width / 2);
  const dy = r.top + r.height / 2 - (p.top + p.height / 2);
  const P = 'perspective(1400px) ';
  const at = (delay, duration, easing = 'ease-out', fill = 'both') => ({ delay, duration, easing, fill });

  $('.bp-veil').animate({ opacity: [0, 1] }, at(0, 320));
  pass.animate(
    [
      { transform: `${P}translate(${dx}px,${dy}px) scale(.4) rotateX(62deg)`, opacity: 0 },
      { opacity: 1, offset: 0.22 },
      { transform: `${P}translate(0,0) scale(1) rotateX(0deg)`, opacity: 1 },
    ],
    at(0, 440, 'cubic-bezier(.18,.9,.24,1)', 'backwards')
  );
  // The stamp slams down (accelerating), squashes on impact, settles.
  const S = 'translate(-50%,-50%) ';
  $('.bp-stamp').animate(
    [
      { transform: `${S}scale(2.6) rotate(-27deg)`, opacity: 0, easing: 'cubic-bezier(.55,0,1,.45)' },
      { transform: `${S}scale(.93) rotate(-11deg)`, opacity: 1, offset: 0.72, easing: 'ease-out' },
      { transform: `${S}scale(1) rotate(-12deg)`, opacity: 1 },
    ],
    at(420, 170)
  );
  pass.animate(
    [{ transform: 'none' }, { transform: 'translateY(4px) scale(.985)', offset: 0.3 }, { transform: 'none' }],
    at(540, 190, 'ease-out', 'none')
  );
  // Tear along the perforation: the stub hinges from its top corner, then drops away.
  $('.bp-main').animate(
    [{ transform: 'none' }, { transform: 'translateX(-3px) rotate(-.5deg)', offset: 0.3 }, { transform: 'none' }],
    at(640, 260, 'ease-out', 'none')
  );
  $('.bp-stub').animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'translate(6px,1px) rotate(2deg)', opacity: 1, offset: 0.2 },
      { transform: 'translate(40px,120px) rotate(17deg)', opacity: 0 },
    ],
    at(640, 300, 'cubic-bezier(.45,0,.8,.45)', 'forwards')
  );

  timer = setTimeout(() => location.assign(a.href), 900);
}

function reset(hooks) {
  clearTimeout(timer);
  overlay?.remove();
  overlay = null;
  busy = false;
  document.querySelectorAll('.flight.is-boarding').forEach((a) => {
    a.classList.remove('is-boarding');
    hooks.reset?.(a);
  });
}

export function initPass(hooks = {}) {
  const list = document.querySelector('.board-rows');
  const tpl = document.getElementById('bp-tpl');
  if (!list || !tpl) return;

  list.addEventListener('click', (e) => {
    const a = e.target.closest('a.flight');
    if (!a) return;
    // A second click mid-boarding must not cut the animation or navigate.
    if (busy) {
      e.preventDefault();
      return;
    }
    if (RM.matches || e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    busy = true;
    board(a, tpl, hooks);
  });

  // Back/forward cache: the page comes back exactly as we left it, overlay and all.
  addEventListener('pageshow', (e) => e.persisted && reset(hooks));
}
