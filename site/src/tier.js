// Decides how much of the flight a device gets:
//   full   desktop WebGL2: the whole scene
//   mobile touch or narrow screens: lighter scene, capped resolution
//   lite   save-data, weak hardware or no WebGL2: animated 2D route map
//   static reduced motion: 2D route map without animation
// `?tier=` overrides for testing. Software WebGL is caught later, inside the
// renderer (see flight/index.js), so detection here never creates a context.
const TIERS = ['full', 'mobile', 'lite', 'static'];

export function forcedTier() {
  const forced = new URLSearchParams(location.search).get('tier');
  return TIERS.includes(forced) ? forced : null;
}

export function detectTier() {
  const forced = forcedTier();
  if (forced) return forced;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  const nav = navigator;
  if (nav.connection?.saveData) return 'lite';
  if ((nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)) return 'lite';
  if (!('WebGL2RenderingContext' in window)) return 'lite';
  const coarse = matchMedia('(pointer: coarse)').matches;
  return coarse || window.innerWidth < 900 ? 'mobile' : 'full';
}
