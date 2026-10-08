import {
  PlaneGeometry, InstancedBufferGeometry, InstancedBufferAttribute, Mesh, ShaderMaterial, Vector3,
} from 'three';
import { NOISE, REVEAL_UNIFORMS, REVEAL } from './glsl.js';
import { U } from './uniforms.js';

// Cartoon cumulus: camera-facing quads with an fbm silhouette, a hard
// alpha-tested edge (so no sorting is needed) and an ink outline that
// softens as the world fills with color.

const vert = /* glsl */ `
attribute vec3 aOffset;
attribute vec2 aSize;
attribute float aSeed;
uniform float uTime;
varying vec2 vUv;
varying float vSeed;
varying vec3 vWorld;
varying float vLife;
void main() {
  vec3 center = aOffset;
  vec2 size = aSize;
  vLife = 0.0;
#ifdef SMOKE
  float life = fract(uTime * 0.11 + aSeed);
  center += vec3(life * 2.2, life * 0.9, life * 0.5);
  size *= 0.4 + life * 1.0;
  vLife = life;
#else
  center.x += sin(uTime * 0.05 + aSeed * 6.0) * 0.6;
#endif
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 wp = center + right * position.x * size.x + up * position.y * size.y;
  vUv = uv;
  vSeed = aSeed;
  vWorld = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`;

const frag = (octaves) => /* glsl */ `
#define FBM_OCTAVES ${octaves}
${REVEAL_UNIFORMS}
varying vec2 vUv;
varying float vSeed;
varying vec3 vWorld;
varying float vLife;
${NOISE}
${REVEAL}
void main() {
  vec2 p = (vUv - 0.5) * vec2(1.0, 1.55);
  float base = smoothstep(0.04, 0.2, vUv.y);
  float n = fbm(vUv * vec2(3.2, 2.4) + vSeed * 17.0);
  float bumps = vnoise(vec2(vUv.x * 7.0 + vSeed * 9.0, 1.0)) * 0.12;
  float d = length(p) + (0.5 - n) * 0.42 - bumps * smoothstep(0.3, 0.9, vUv.y);
  float a = (1.0 - smoothstep(0.38, 0.4, d)) * base;
#ifdef SMOKE
  a *= 1.0 - smoothstep(0.55, 1.0, vLife);
  a *= smoothstep(0.0, 0.08, vLife);
#endif
  if (a < 0.5) discard;

  float edgeD = abs(d - 0.39);
  float ew = fwidth(d) * 1.6 + 0.002;
  float outline = 1.0 - smoothstep(0.0, ew, edgeD);
  float bottomEdge = (1.0 - smoothstep(0.0, fwidth(vUv.y) * 2.0, abs(vUv.y - 0.12))) * step(d, 0.39);
  outline = max(outline, bottomEdge * 0.0);

  float shade = smoothstep(0.75, 0.15, vUv.y + (n - 0.5) * 0.4);
  vec2 hp = vWorld.xy + vWorld.zz;
  float h = hatchLOD(hp, shade * 0.6);
  vec3 bp = mix(uPaper, uInk, max(outline * 0.85, h * 0.35));

  vec3 lit = mix(vec3(1.0, 0.99, 0.97), vec3(0.78, 0.8, 0.9), shade * 0.7);
#ifdef SMOKE
  lit = mix(vec3(0.86, 0.84, 0.8), vec3(0.62, 0.6, 0.6), shade);
#endif
  lit = mix(lit, lit * vec3(1.08, 0.82, 0.78), uDusk);
  lit = mix(lit, vec3(0.16, 0.19, 0.3) + (1.0 - shade) * 0.08, uNight);
  lit = mix(lit, lit * 0.82, outline * 0.6);

  float m = revealMask(vWorld);
  vec3 col = mix(bp, lit, m);
  col = applyFog(col, vWorld, m);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

function makeLayer(items, defines, octaves) {
  const quad = new PlaneGeometry(1, 1);
  const geo = new InstancedBufferGeometry();
  geo.index = quad.index;
  geo.setAttribute('position', quad.attributes.position);
  geo.setAttribute('uv', quad.attributes.uv);
  const off = new Float32Array(items.length * 3);
  const size = new Float32Array(items.length * 2);
  const seed = new Float32Array(items.length);
  items.forEach((it, i) => {
    off.set(it.pos, i * 3);
    size.set(it.size, i * 2);
    seed[i] = it.seed;
  });
  geo.setAttribute('aOffset', new InstancedBufferAttribute(off, 3));
  geo.setAttribute('aSize', new InstancedBufferAttribute(size, 2));
  geo.setAttribute('aSeed', new InstancedBufferAttribute(seed, 1));
  geo.instanceCount = items.length;
  const mat = new ShaderMaterial({
    uniforms: { ...U },
    vertexShader: vert,
    fragmentShader: frag(octaves),
    defines,
  });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// banks: world points where the plane punches through cloud between cities.
export function buildClouds(tier, banks, chimneys) {
  const r = rand(4242);
  const count = tier === 'mobile' ? 46 : 110;
  const items = [];
  for (let i = 0; i < count; i++) {
    const pos = [-110 + r() * 230, 9 + r() * 12, -95 + r() * 205];
    const w = 4 + r() * 7;
    items.push({ pos, size: [w, w * (0.45 + r() * 0.2)], seed: r() * 10 });
  }
  const per = tier === 'mobile' ? 14 : 26;
  for (const b of banks) {
    for (let i = 0; i < per; i++) {
      const a = r() * Math.PI * 2;
      const d = r() * 5.5;
      const pos = [b.x + Math.cos(a) * d, b.y - 2.2 + r() * 4.2, b.z + Math.sin(a) * d];
      const w = 4 + r() * 6;
      items.push({ pos, size: [w, w * 0.6], seed: r() * 10 });
    }
  }
  const clouds = makeLayer(items, {}, tier === 'mobile' ? 3 : 4);
  clouds.name = 'clouds';

  const puffs = [];
  const perChimney = tier === 'mobile' ? 3 : 4;
  chimneys.forEach((c, ci) => {
    for (let i = 0; i < perChimney; i++) puffs.push({ pos: [c.x, c.y, c.z], size: [0.6, 0.46], seed: i / perChimney + ci * 0.13 });
  });
  const smoke = makeLayer(puffs, { SMOKE: '' }, 3);
  smoke.name = 'smoke';
  return { clouds, smoke };
}

export const BANK_POINT = new Vector3();
