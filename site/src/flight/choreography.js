import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { P } from './path.js';
import { XLRI } from './cities.js';

gsap.registerPlugin(ScrollTrigger);

// Everything the 3D reads each frame. The scroll-scrubbed timeline is the
// only writer. Camera fields are explained in path.js composeCamera().
const INITIAL = {
  t: 0,
  back: 3, up: 0.8, right: 1, ahead: 4, lookUp: 0, fov: 36,
  world: 1, wx: -51.5, wy: 17, wz: -37, tx: -61.6, ty: 0, tz: -15.5,
  cockpit: 0, look: 1, shift: 1,
  reveal: 0, local: 0, waveR: 0, tod: 1, veil: 0,
};

export const S = { ...INITIAL };

const io = 'sine.inOut';

function veil(tl, center, w) {
  tl.to(S, { veil: 1, duration: w, ease: 'sine.in' }, Math.max(0, center - w));
  tl.to(S, { veil: 0, duration: w * 1.3, ease: 'sine.out' }, center);
}

// Each beat adds its tweens inside [a, a + d] (fractions of the journey scroll).
const BEATS = {
  gate() {},
  // Take-off: from the map view down to a low chase behind the plane.
  'mumbai-a'(tl, a, d) {
    tl.to(S, { t: P(2.6), ease: 'power1.in', duration: d }, a);
    tl.to(S, { world: 0, back: 2.6, up: 0.5, right: 0.95, ahead: 5, lookUp: 0.35, fov: 46, ease: io, duration: d * 0.75 }, a);
  },
  // Establishing shot from over the Arabian Sea: the plane crosses the skyline.
  'mumbai-b'(tl, a, d) {
    tl.to(S, { t: P(7), ease: 'none', duration: d }, a);
    tl.set(S, { wx: -71, wy: 6.4, wz: -15.5, tx: -60.4, ty: 1.4, tz: -8.6 }, a);
    tl.to(S, { world: 1, fov: 40, ease: io, duration: d * 0.45 }, a);
    tl.to(S, { wx: -72.5, wy: 7.6, wz: -1.5, tx: -58.8, ty: 1.6, tz: -7.4, ease: io, duration: d }, a);
  },
  'leg-1'(tl, a, d) {
    tl.to(S, { t: P(11), ease: 'none', duration: d }, a);
    tl.to(S, { world: 0, back: 3.6, up: 0.85, right: 1.7, ahead: 7, lookUp: 0.8, fov: 52, ease: io, duration: d * 0.4 }, a);
    veil(tl, a + d * 0.5, d * 0.09);
  },
  jamshedpur(tl, a, d) {
    tl.to(S, { t: P(16), ease: 'none', duration: d }, a);
    tl.to(S, { back: 5.6, up: 3.0, right: -4.6, ahead: 1.5, lookUp: -1.1, fov: 44, ease: io, duration: d * 0.6 }, a);
    tl.to(S, { local: 4.6, ease: 'power2.out', duration: d * 0.5 }, a + d * 0.25);
  },
  'leg-2'(tl, a, d) {
    tl.to(S, { t: P(20), ease: 'none', duration: d }, a);
    tl.to(S, { back: 3.4, up: 1.1, right: -1.8, ahead: 7, lookUp: 0.6, fov: 52, ease: io, duration: d * 0.45 }, a);
    tl.to(S, { reveal: 0.24, ease: io, duration: d }, a);
    veil(tl, a + d * 0.5, d * 0.09);
  },
  chennai(tl, a, d) {
    tl.to(S, { t: P(25), ease: 'none', duration: d }, a);
    tl.to(S, { back: 5.8, up: 2.6, right: 4.6, ahead: 1.5, lookUp: -0.9, fov: 44, ease: io, duration: d * 0.6 }, a);
    tl.to(S, { reveal: 0.42, tod: 2, ease: io, duration: d }, a);
  },
  'leg-3'(tl, a, d) {
    tl.to(S, { t: P(29), ease: 'none', duration: d }, a);
    tl.to(S, { back: 3.6, up: 0.9, right: 1.6, ahead: 7, lookUp: 0.7, fov: 52, ease: io, duration: d * 0.45 }, a);
    tl.to(S, { reveal: 0.55, tod: 3, ease: io, duration: d }, a);
    veil(tl, a + d * 0.5, d * 0.09);
  },
  'mumbai-dusk'(tl, a, d) {
    tl.to(S, { t: P(32), ease: 'none', duration: d }, a);
    tl.to(S, { back: 7.2, up: 3.2, right: -3.8, ahead: 1, lookUp: -1, fov: 44, ease: io, duration: d * 0.7 }, a);
    tl.to(S, { reveal: 0.62, tod: 3.2, ease: io, duration: d }, a);
  },
  turn(tl, a, d) {
    tl.to(S, { t: P(34), ease: 'none', duration: d }, a);
    tl.to(S, { back: 3.4, up: 1.0, right: 1.5, ahead: 5, lookUp: 0.3, fov: 46, ease: io, duration: d }, a);
    tl.to(S, { tod: 3.6, ease: io, duration: d }, a);
  },
  // Into the captain's seat, a wave from the co-pilot, eyes forward, then out.
  cockpit(tl, a, d) {
    tl.to(S, { t: P(35.6), ease: 'none', duration: d }, a);
    tl.to(S, { cockpit: 1, fov: 64, shift: 0, ease: 'power2.inOut', duration: d * 0.26 }, a);
    veil(tl, a + d * 0.17, d * 0.06);
    tl.to(S, { look: 0, ease: io, duration: d * 0.25 }, a + d * 0.5);
    tl.to(S, { tod: 4, ease: io, duration: d * 0.5 }, a);
    veil(tl, a + d * 0.88, d * 0.06);
    tl.set(S, { cockpit: 0, wx: -48, wy: 10, wz: -2, tx: -60, ty: 2, tz: -12 }, a + d * 0.88);
    tl.set(S, { world: 1, fov: 48 }, a + d * 0.88);
  },
  // Pull out over night Mumbai; the marigold wave paints the city in.
  wave(tl, a, d) {
    tl.to(S, { t: P(37), ease: 'none', duration: d }, a);
    tl.to(S, { wx: -45, wy: 16, wz: 6, tx: -60.4, ty: -1.5, tz: -12.5, fov: 46, ease: io, duration: d * 0.45 }, a);
    tl.to(S, { waveR: 150, ease: 'power1.in', duration: d * 0.6 }, a + d * 0.05);
    tl.to(S, { reveal: 1, ease: io, duration: d * 0.35 }, a + d * 0.45);
  },
};
let tl;
let st;

function measure(journey) {
  const vh = window.innerHeight;
  const top = journey.getBoundingClientRect().top + window.scrollY;
  const total = Math.max(1, journey.offsetHeight - vh);
  const clamp = (v) => Math.min(1, Math.max(0, v));
  return [...journey.querySelectorAll('[data-beat]')].map((el) => {
    const r = el.getBoundingClientRect();
    const start = r.top + window.scrollY - top;
    const a = clamp((start - vh * 0.35) / total);
    const b = clamp((start + r.height - vh * 0.65) / total);
    return { beat: el.dataset.beat, a, b: Math.max(b, a + 0.004) };
  });
}

export function buildChoreography(journey) {
  st?.kill();
  tl?.kill();
  Object.assign(S, INITIAL);
  tl = gsap.timeline({ paused: true, defaults: { overwrite: false } });
  tl.set(S, { ...INITIAL }, 0);
  for (const { beat, a, b } of measure(journey)) BEATS[beat]?.(tl, a, b - a);
  tl.to({}, { duration: Math.max(0, 1 - tl.duration()) });
  st = ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    animation: tl,
  });
  return st;
}

export function destroyChoreography() {
  st?.kill();
  tl?.kill();
  st = tl = undefined;
}

export const LOCAL_CENTER = XLRI;
