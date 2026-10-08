// SVG route map for devices that don't get the 3D flight (reduced motion,
// save-data, weak hardware, lost WebGL). Same geography as the 3D world:
// x = (lon - 79) * 10, y = -(lat - 18) * 10.

const CITIES = [
  { code: 'BOM', name: 'Mumbai', x: -61.2, y: -10.8 },
  { code: 'IXW', name: 'Jamshedpur', x: 72, y: -48 },
  { code: 'MAA', name: 'Chennai', x: 12.7, y: 49.2 },
];

// Route: BOM → IXW → MAA → BOM as gentle arcs.
const ROUTE = 'M -61.2 -10.8 Q 2 -52 72 -48 Q 66 4 12.7 49.2 Q -36 40 -61.2 -10.8';
const PLANE = 'M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z';

export function startFallback({ stage, journey, animate }) {
  if (!stage || stage.querySelector('.route-map')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const wrap = document.createElement('div');
  wrap.className = 'route-map' + (animate ? '' : ' route-map--static');
  wrap.innerHTML = `
<svg viewBox="-92 -78 196 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs>
    <pattern id="rm-grid" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M10 0H0V10" fill="none" stroke="currentColor" stroke-width="0.12" opacity="0.18"/>
    </pattern>
    <pattern id="rm-water" width="3" height="1.6" patternUnits="userSpaceOnUse">
      <path d="M0 0.8H3" stroke="currentColor" stroke-width="0.14" opacity="0.4"/>
    </pattern>
  </defs>
  <rect x="-92" y="-78" width="196" height="150" fill="url(#rm-grid)"/>
  <path class="rm-sea" d="M -63.6 -11 L -27 80 L -110 80 L -110 -95 L -75 -95 Z" fill="url(#rm-water)"/>
  <path class="rm-sea" d="M 15.4 49.2 L 92 -44 L 130 -44 L 130 90 L -10 90 Z" fill="url(#rm-water)"/>
  <path class="rm-coast" d="M -75 -40 L -63.6 -11 L -27 80"/>
  <path class="rm-coast" d="M 100 -54 L 15.4 49.2 L 0 68"/>
  <path class="rm-route-base" d="${ROUTE}"/>
  <path class="rm-route" d="${ROUTE}"/>
  ${CITIES.map((c) => `<g class="rm-city" transform="translate(${c.x} ${c.y})"><circle r="1.6"/><circle class="rm-ring" r="3.4"/><text x="4.2" y="-2.6">${c.code}</text><text class="rm-name" x="4.2" y="1.6">${c.name}</text></g>`).join('')}
  <g class="rm-plane"><path d="${PLANE}" transform="translate(-6 -6) scale(0.5)"/></g>
</svg>`;
  stage.appendChild(wrap);
  stage.classList.add('is-fallback');

  const route = wrap.querySelector('.rm-route');
  const plane = wrap.querySelector('.rm-plane');
  const len = route.getTotalLength();
  route.style.strokeDasharray = `${len}`;
  const track = document.getElementById('flight');
  void ns;

  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    const r = track.getBoundingClientRect();
    let p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / r.height));
    if (!animate) {
      // Jump between stops instead of gliding.
      p = Math.round(p * 6) / 6;
    }
    const d = p * len;
    route.style.strokeDashoffset = `${len - d}`;
    const a = route.getPointAtLength(Math.max(0.01, d));
    const b = route.getPointAtLength(Math.min(len, d + 0.6));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
    plane.setAttribute('transform', `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
    wrap.classList.toggle('is-late', p > 0.8);
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
  void journey;
}
