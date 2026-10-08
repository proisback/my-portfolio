import { Color, Vector3, Vector4 } from 'three';

export const PALETTE = {
  paper: new Color('#F3ECDD'),
  ink: new Color('#22304A'),
  marigold: new Color('#F5C94C'),
  lamp: new Color('#FFD27A'),
};

// One uniforms object shared by every world material.
export const U = {
  uTime: { value: 0 },
  uReveal: { value: 0 },
  uWave: { value: new Vector4(0, 0, 0, -1) },
  uLocal: { value: new Vector4(0, 0, 0, 0) },
  uPaper: { value: PALETTE.paper.clone() },
  uInk: { value: PALETTE.ink.clone() },
  uFogColor: { value: new Color('#F3ECDF') },
  uFogNear: { value: 70 },
  uFogFar: { value: 260 },
  uNight: { value: 0 },
  uDusk: { value: 0 },
  uSunDir: { value: new Vector3(-0.45, 0.8, 0.35).normalize() },
  uSkyTop: { value: new Color('#BFD6EA') },
  uSkyHorizon: { value: new Color('#F3ECDF') },
};

// Time of day: 0 dawn, 1 day, 2 golden hour, 3 dusk, 4 night.
const SKY = [
  { top: '#F1D5C8', hor: '#FBE9D3', sun: [0.7, 0.35, -0.4] },
  { top: '#BFD6EA', hor: '#F3ECDF', sun: [-0.45, 0.8, 0.35] },
  { top: '#E3C29E', hor: '#F9D9A8', sun: [-0.7, 0.45, 0.4] },
  { top: '#6B5C90', hor: '#EE9A74', sun: [-0.85, 0.18, 0.3] },
  { top: '#0B1124', hor: '#252E4D', sun: [0.3, 0.75, -0.5] },
].map((k) => ({ top: new Color(k.top), hor: new Color(k.hor), sun: new Vector3(...k.sun).normalize() }));

const NIGHT_PAPER = new Color('#1B2747');
const NIGHT_INK = new Color('#AFC0DD');

const tmpA = new Color();
const tmpB = new Color();
const tmpV = new Vector3();

export function setTimeOfDay(tod) {
  const t = Math.min(Math.max(tod, 0), 4);
  const i = Math.min(Math.floor(t), 3);
  const f = t - i;
  const a = SKY[i];
  const b = SKY[i + 1];
  U.uSkyTop.value.copy(tmpA.copy(a.top).lerp(b.top, f));
  U.uSkyHorizon.value.copy(tmpB.copy(a.hor).lerp(b.hor, f));
  U.uFogColor.value.copy(U.uSkyHorizon.value);
  U.uSunDir.value.copy(tmpV.copy(a.sun).lerp(b.sun, f).normalize());
  U.uNight.value = Math.min(Math.max(t - 3, 0), 1);
  // At night the drawing inverts into a literal blueprint: pale lines on navy.
  const n = U.uNight.value;
  U.uPaper.value.copy(PALETTE.paper).lerp(NIGHT_PAPER, n);
  U.uInk.value.copy(PALETTE.ink).lerp(NIGHT_INK, n);
  U.uDusk.value = Math.max(0, 1 - Math.abs(t - 3) * 1.25) * 0.9 + Math.max(0, 1 - Math.abs(t - 2) * 1.5) * 0.35;
}

setTimeOfDay(1);
