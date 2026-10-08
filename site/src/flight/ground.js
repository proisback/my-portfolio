import {
  PlaneGeometry, Mesh, ShaderMaterial, Color, Vector2, Vector3, Vector4,
  BufferGeometry, BufferAttribute, DoubleSide,
} from 'three';
import { NOISE, REVEAL_UNIFORMS, REVEAL } from './glsl.js';
import { U, PALETTE } from './uniforms.js';
import { CITY, COAST, HARBOUR, LAKE } from './places.js';

const groundVert = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const groundFrag = (octaves) => /* glsl */ `
#define FBM_OCTAVES ${octaves}
${REVEAL_UNIFORMS}
uniform vec2 uWestA; uniform vec2 uWestB;
uniform vec2 uEastA; uniform vec2 uEastB;
uniform vec4 uHarbour; uniform vec4 uLake;
uniform vec3 uCity[3];
uniform vec3 uLandA; uniform vec3 uLandB; uniform vec3 uSand;
uniform vec3 uSea; uniform vec3 uSeaDeep; uniform vec3 uLamp;
varying vec3 vWorld;
${NOISE}
${REVEAL}

// Signed distance to an infinite line; positive on the left of a->b.
float side(vec2 p, vec2 a, vec2 b) {
  vec2 d = normalize(b - a);
  return (p.x - a.x) * d.y - (p.y - a.y) * d.x;
}

float waterLine(float y) {
  float v = abs(fract(y) - 0.5);
  float w = fwidth(y);
  return 1.0 - smoothstep(0.07 - w, 0.07 + w, v);
}

float coastDistance(vec2 p) {
  float near = 1e5;
  for (int i = 0; i < 3; i++) near = min(near, distance(p, uCity[i].xz));
  float amp = mix(0.35, 2.6, smoothstep(5.0, 22.0, near));
  float n = (fbm(p * 0.11) - 0.5) * 2.0 * amp + (vnoise(p * 0.9) - 0.5) * 0.35;
  float dw = side(p, uWestA, uWestB) + n;
  float de = side(p, uEastA, uEastB) + n;
  float d = min(dw, de);
  vec2 q = (p - uHarbour.xy) / uHarbour.zw;
  float hn = (fbm(p * 0.45 + 2.0) - 0.5) * 1.4;
  d = min(d, (length(q) - 1.0) * min(uHarbour.z, uHarbour.w) + hn);
  vec2 l = (p - uLake.xy) / uLake.zw;
  d = min(d, (length(l) - 1.0) * min(uLake.z, uLake.w));
  return d;
}

void main() {
  vec2 p = vWorld.xz;
  float cd = coastDistance(p);
  float water = 1.0 - smoothstep(-0.04, 0.04, cd);

  float h = fbm(p * 0.032) + fbm(p * 0.13 + 4.0) * 0.22;
  float cl = h * 16.0;
  float cv = abs(fract(cl) - 0.5);
  float cw = fwidth(cl);
  float contour = smoothstep(0.5 - cw * 1.4, 0.5, cv);
  float major = step(4.5, mod(floor(cl + 0.5), 5.0));
  contour *= mix(0.55, 1.0, major) * (1.0 - water) * (1.0 - smoothstep(0.22, 0.55, cw));

  vec2 g = abs(fract(p / 20.0 - 0.5) - 0.5) * 20.0;
  float gw = fwidth(p.x) * 1.3;
  float grid = (1.0 - smoothstep(0.0, gw, min(g.x, g.y))) * (1.0 - smoothstep(0.8, 2.5, gw));

  // Water hatching: ~10px apart on screen at any distance (two blended
  // power-of-two densities), so close-ups never turn into thick bars.
  float wy0 = p.y + sin(p.x * 0.35) * 0.27;
  float wl = log2(max(fwidth(wy0), 1e-5) * 10.0);
  float wd = exp2(-floor(wl));
  float wline = mix(waterLine(wy0 * wd), waterLine(wy0 * wd * 0.5), fract(wl)) * water;
  wline *= 0.25 + 0.75 * (1.0 - smoothstep(0.0, 7.0, -cd));

  float cwid = fwidth(cd) * 1.4 + 0.015;
  float coast = 1.0 - smoothstep(0.0, cwid, abs(cd));

  vec3 bp = uPaper;
  bp = mix(bp, uInk, contour * 0.2);
  bp = mix(bp, uInk, grid * 0.09);
  bp = mix(bp, uInk, wline * 0.38);
  bp = mix(bp, uInk, coast * 0.8);

  vec3 land = mix(uLandA, uLandB, smoothstep(0.32, 0.68, fbm(p * 0.05 + 9.0)));
  land = mix(land, land * 0.9, contour * 0.6);
  float sand = (1.0 - smoothstep(0.0, 0.55, cd)) * (1.0 - water);
  land = mix(land, uSand, sand);
  vec3 sea = mix(uSea, uSeaDeep, smoothstep(0.0, 12.0, -cd));
  float shimmer = vnoise(p * 0.7 + vec2(uTime * 0.12, -uTime * 0.09)) - 0.5;
  sea += shimmer * 0.05;
  sea = mix(sea, vec3(0.92, 0.95, 0.94), (1.0 - smoothstep(0.0, 0.35, -cd)) * water * 0.6);
  vec3 colm = mix(land, sea, water);
  colm = mix(colm, colm * vec3(1.1, 0.84, 0.7), uDusk);
  vec3 nightCol = colm * vec3(0.1, 0.12, 0.24);
  nightCol += water * vec3(0.015, 0.02, 0.04) * (0.6 + shimmer);
  colm = mix(colm, nightCol, uNight);
  for (int i = 0; i < 3; i++) {
    float d = distance(p, uCity[i].xz);
    colm += uLamp * exp(-d * d / 26.0) * 0.32 * uNight * (1.0 - water * 0.6);
  }

  float m = revealMask(vWorld);
  vec3 col = mix(bp, colm, m);
  col = applyFog(col, vWorld, m);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function buildGround(tier) {
  const geo = new PlaneGeometry(760, 760, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mat = new ShaderMaterial({
    uniforms: {
      ...U,
      uWestA: { value: COAST.westA }, uWestB: { value: COAST.westB },
      uEastA: { value: COAST.eastA }, uEastB: { value: COAST.eastB },
      uHarbour: { value: new Vector4(...HARBOUR) },
      uLake: { value: new Vector4(...LAKE) },
      uCity: { value: [CITY.BOM, CITY.IXW, CITY.MAA] },
      uLandA: { value: new Color('#B9CC93') },
      uLandB: { value: new Color('#DCCB94') },
      uSand: { value: new Color('#EBDDB3') },
      uSea: { value: new Color('#8FC4C2') },
      uSeaDeep: { value: new Color('#4F8FA4') },
      uLamp: { value: PALETTE.lamp },
    },
    vertexShader: groundVert,
    fragmentShader: groundFrag(tier === 'mobile' ? 3 : 4),
  });
  const mesh = new Mesh(geo, mat);
  mesh.position.set(10, 0, 10);
  mesh.name = 'ground';
  return mesh;
}

// ---------------------------------------------------------------------------
// The route: a dashed line drawn on the ground under the flight path, which
// extends as the plane flies (uProgress is the curve parameter of the plane).

const routeVert = /* glsl */ `
attribute float aT;
attribute float aS;
attribute float aSide;
varying vec3 vWorld;
varying float vT;
varying float vS;
varying float vSide;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vT = aT; vS = aS; vSide = aSide;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const routeFrag = /* glsl */ `
#define FBM_OCTAVES 3
${REVEAL_UNIFORMS}
uniform float uProgress;
uniform vec3 uMarigold;
varying vec3 vWorld;
varying float vT;
varying float vS;
varying float vSide;
${NOISE}
${REVEAL}
void main() {
  if (vT > uProgress) discard;
  float dash = step(fract(vS / 0.55), 0.5);
  float edge = 1.0 - smoothstep(0.65, 1.0, abs(vSide));
  float a = dash * edge;
  if (a < 0.02) discard;
  float m = revealMask(vWorld);
  vec3 col = mix(uInk, uMarigold, m);
  col = mix(col, uMarigold * 1.2, uNight * m);
  float d = distance(vWorld, cameraPosition);
  a *= 1.0 - smoothstep(uFogNear, uFogFar, d);
  gl_FragColor = vec4(col, a * 0.9);
  #include <colorspace_fragment>
}`;

export function buildRoute(curve, samples = 900) {
  const pos = new Float32Array(samples * 2 * 3);
  const t = new Float32Array(samples * 2);
  const s = new Float32Array(samples * 2);
  const sideA = new Float32Array(samples * 2);
  const width = 0.055;
  const p = new Vector3();
  const q = new Vector3();
  let acc = 0;
  let prev = null;
  for (let i = 0; i < samples; i++) {
    const u = i / (samples - 1);
    curve.getPoint(u, p);
    curve.getPoint(Math.min(1, u + 0.001), q);
    const dir = new Vector2(q.x - p.x, q.z - p.z).normalize();
    if (!dir.lengthSq()) dir.set(1, 0);
    const nx = -dir.y * width;
    const nz = dir.x * width;
    if (prev) acc += Math.hypot(p.x - prev.x, p.z - prev.z);
    prev = p.clone();
    for (let k = 0; k < 2; k++) {
      const sgn = k === 0 ? -1 : 1;
      const j = i * 2 + k;
      pos[j * 3] = p.x + nx * sgn;
      pos[j * 3 + 1] = 0.035;
      pos[j * 3 + 2] = p.z + nz * sgn;
      t[j] = u;
      s[j] = acc;
      sideA[j] = sgn;
    }
  }
  const index = [];
  for (let i = 0; i < samples - 1; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aT', new BufferAttribute(t, 1));
  geo.setAttribute('aS', new BufferAttribute(s, 1));
  geo.setAttribute('aSide', new BufferAttribute(sideA, 1));
  geo.setIndex(index);
  geo.computeBoundingSphere();
  const mat = new ShaderMaterial({
    uniforms: { ...U, uProgress: { value: 0 }, uMarigold: { value: PALETTE.marigold } },
    vertexShader: routeVert,
    fragmentShader: routeFrag,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });
  const mesh = new Mesh(geo, mat);
  mesh.name = 'route';
  mesh.renderOrder = 1;
  return mesh;
}
