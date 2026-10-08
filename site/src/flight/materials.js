import {
  ShaderMaterial, BufferGeometry, BufferAttribute, EdgesGeometry, Mesh, LineSegments, Group,
  Matrix4, Vector3, Quaternion, Euler, Color, FrontSide,
} from 'three';
import { NOISE, REVEAL_UNIFORMS, REVEAL } from './glsl.js';
import { U, PALETTE } from './uniforms.js';

let OCTAVES = 4;
export function setQuality(tier) {
  OCTAVES = tier === 'mobile' ? 3 : 4;
}

const worldVert = /* glsl */ `
attribute vec3 aColor;
attribute float aWin;
attribute float aEmit;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vColor;
varying float vWin;
varying float vEmit;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vColor = aColor;
  vWin = aWin;
  vEmit = aEmit;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const worldFrag = () => /* glsl */ `
#define FBM_OCTAVES ${OCTAVES}
${REVEAL_UNIFORMS}
uniform vec3 uLamp;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vColor;
varying float vWin;
varying float vEmit;
${NOISE}
${REVEAL}
void main() {
  vec3 N = normalize(vNormal);
  if (!gl_FrontFacing) N = -N;
  float ndl = dot(N, uSunDir);
  float band = ndl > 0.42 ? 1.0 : (ndl > 0.0 ? 0.8 : 0.64);

  vec3 lit = vColor * band;
  lit = mix(lit, lit * vec3(1.1, 0.84, 0.72), uDusk);
#ifdef FORCE_COLOR
  // Cockpit interior: warm instrument light instead of night darkness.
  lit = vColor * (0.62 + 0.38 * band) * vec3(1.0, 0.94, 0.86);
#else
  vec3 night = vColor * vec3(0.13, 0.16, 0.3) * (0.7 + 0.3 * band);
  lit = mix(lit, night, uNight);
#endif

  float win = 0.0;
  if (vWin > 0.5 && abs(N.y) < 0.5) {
    vec2 q = vec2(dot(vWorld.xz, vec2(N.z, -N.x)) * 8.0, vWorld.y * 10.0);
    vec2 cell = floor(q);
    vec2 f = fract(q);
    float on = step(0.42, hash12(cell + vec2(floor(vWorld.x * 3.0), floor(vWorld.z * 3.0))));
    float rect = step(0.28, f.x) * step(f.x, 0.72) * step(0.3, f.y) * step(f.y, 0.72);
    win = rect * on;
  }
  lit = mix(lit, uLamp * 1.15, win * uNight);
  lit = mix(lit, uLamp * 1.3, vEmit * max(uNight, uDusk * 0.6));

  float shade = clamp((1.0 - band) * 1.6, 0.0, 1.0);
  vec2 hp = abs(N.y) > 0.6 ? vWorld.xz : (abs(N.x) > abs(N.z) ? vWorld.zy : vWorld.xy);
  float h = hatchLOD(hp, shade);
  vec3 bp = mix(uPaper, uInk, h * 0.62);

  float rim = 1.0 - abs(dot(N, normalize(cameraPosition - vWorld)));
  bp = mix(bp, uInk, smoothstep(0.84, 0.97, rim) * 0.75);

#ifdef FORCE_COLOR
  float m = 1.0;
#else
  float m = revealMask(vWorld);
#endif
  vec3 col = mix(bp, lit, m);
  col = applyFog(col, vWorld, m);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const lineVert = /* glsl */ `
attribute vec3 aColor;
varying vec3 vWorld;
varying vec3 vColor;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vColor = aColor;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const lineFrag = () => /* glsl */ `
#define FBM_OCTAVES ${OCTAVES}
${REVEAL_UNIFORMS}
varying vec3 vWorld;
varying vec3 vColor;
${NOISE}
${REVEAL}
void main() {
#ifdef FORCE_COLOR
  float m = 1.0;
#else
  float m = revealMask(vWorld);
#endif
  vec3 edge = vColor * 0.42;
  edge = mix(edge, vec3(0.05, 0.06, 0.12), uNight * 0.8);
  vec3 col = mix(uInk, edge, m);
  float d = distance(vWorld, cameraPosition);
  float fade = 1.0 - smoothstep(uFogNear, uFogFar, d);
  float a = mix(0.95, 0.4, m) * fade;
  gl_FragColor = vec4(col, a);
  #include <colorspace_fragment>
}`;

export function createWorldMaterial(extra = {}) {
  return new ShaderMaterial({
    uniforms: { ...U, uLamp: { value: PALETTE.lamp } },
    vertexShader: worldVert,
    fragmentShader: worldFrag(),
    side: FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    ...extra,
  });
}

export function createLineMaterial(extra = {}) {
  return new ShaderMaterial({
    uniforms: { ...U },
    vertexShader: lineVert,
    fragmentShader: lineFrag(),
    transparent: true,
    depthWrite: false,
    ...extra,
  });
}

const tmpColor = new Color();

function paint(geo, color, win, emit) {
  const n = geo.attributes.position.count;
  tmpColor.set(color);
  const c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    c[i * 3] = tmpColor.r;
    c[i * 3 + 1] = tmpColor.g;
    c[i * 3 + 2] = tmpColor.b;
  }
  geo.setAttribute('aColor', new BufferAttribute(c, 3));
  if (win !== undefined) geo.setAttribute('aWin', new BufferAttribute(new Float32Array(n).fill(win), 1));
  if (emit !== undefined) geo.setAttribute('aEmit', new BufferAttribute(new Float32Array(n).fill(emit), 1));
}

// Concatenate non-indexed geometries that share the same attribute set.
function merge(parts, names) {
  const out = new BufferGeometry();
  for (const name of names) {
    const size = parts[0].attributes[name].itemSize;
    let len = 0;
    for (const p of parts) len += p.attributes[name].array.length;
    const arr = new Float32Array(len);
    let o = 0;
    for (const p of parts) {
      arr.set(p.attributes[name].array, o);
      o += p.attributes[name].array.length;
    }
    out.setAttribute(name, new BufferAttribute(arr, size));
  }
  return out;
}

export function matrixOf({ pos = [0, 0, 0], rot = [0, 0, 0], scale = 1 } = {}) {
  const s = Array.isArray(scale) ? scale : [scale, scale, scale];
  return new Matrix4().compose(new Vector3(...pos), new Quaternion().setFromEuler(new Euler(...rot)), new Vector3(...s));
}

// Collects many small parts and bakes them into one mesh + one line set,
// so a whole city costs two draw calls.
export class Builder {
  constructor() {
    this.meshParts = [];
    this.lineParts = [];
  }

  add(geo, opts = {}) {
    const { color = '#ffffff', win = 0, emit = 0, edges = true, threshold = 31, matrix, parent } = opts;
    let m = matrix || matrixOf(opts);
    if (parent) m = parent.clone().multiply(m);
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(m);
    paint(g, color, win, emit);
    this.meshParts.push(g);
    if (edges) {
      const e = new EdgesGeometry(geo, threshold);
      e.applyMatrix4(m);
      paint(e, color);
      this.lineParts.push(e);
    }
    return this;
  }

  // Raw ink lines (cables, rails): flat [x1,y1,z1, x2,y2,z2, ...].
  addLines(points, color = '#22304A') {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(points), 3));
    paint(g, color);
    this.lineParts.push(g);
    return this;
  }

  // forceColor: always drawn in full color (the cockpit interior).
  build(name = 'part', { forceColor = false } = {}) {
    const group = new Group();
    group.name = name;
    if (this.meshParts.length) {
      const mesh = new Mesh(merge(this.meshParts, ['position', 'normal', 'aColor', 'aWin', 'aEmit']), forceColor ? forcedWorld() : sharedWorld());
      mesh.geometry.computeBoundingSphere();
      group.add(mesh);
    }
    if (this.lineParts.length) {
      const lines = new LineSegments(merge(this.lineParts, ['position', 'aColor']), forceColor ? forcedLines() : sharedLines());
      lines.geometry.computeBoundingSphere();
      group.add(lines);
    }
    this.meshParts.length = 0;
    this.lineParts.length = 0;
    return group;
  }
}

let worldMat;
let lineMat;
let worldForced;
let lineForced;
const FORCE = { defines: { FORCE_COLOR: '' } };
export function sharedWorld() {
  return (worldMat ||= createWorldMaterial());
}
export function sharedLines() {
  return (lineMat ||= createLineMaterial());
}
export function forcedWorld() {
  return (worldForced ||= createWorldMaterial(FORCE));
}
export function forcedLines() {
  return (lineForced ||= createLineMaterial(FORCE));
}
export function disposeShared() {
  for (const m of [worldMat, lineMat, worldForced, lineForced]) m?.dispose();
  worldMat = lineMat = worldForced = lineForced = undefined;
}
