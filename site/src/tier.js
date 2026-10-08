// Decides how much of the flight a device gets:
//   full   desktop WebGL2: the whole scene
//   mobile touch or narrow screens: lighter scene, capped resolution
//   lite   save-data, weak hardware or no WebGL2: animated 2D route map
//   static reduced motion: 2D route map without animation
// `?tier=` overrides for testing.
const TIERS = ['full', 'mobile', 'lite', 'static'];

function hasWebGL2() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectTier() {
  const forced = new URLSearchParams(location.search).get('tier');
  if (TIERS.includes(forced)) return forced;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
  const nav = navigator;
  if (nav.connection?.saveData) return 'lite';
  if ((nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)) return 'lite';
  if (!hasWebGL2()) return 'lite';
  const coarse = matchMedia('(pointer: coarse)').matches;
  return coarse || window.innerWidth < 900 ? 'mobile' : 'full';
}
