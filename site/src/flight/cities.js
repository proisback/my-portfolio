import {
  BoxGeometry, CylinderGeometry, ConeGeometry, SphereGeometry, TorusGeometry,
  Group, Mesh, ShaderMaterial, AdditiveBlending, Matrix4, Vector3,
} from 'three';
import { Builder, matrixOf } from './materials.js';
import { U, PALETTE } from './uniforms.js';
import { CITY, HARBOUR, NECKLACE, RUNWAY, TRACK, westCoastX } from './places.js';

// Deterministic randomness so the cities look the same on every visit.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const G = {
  box: new BoxGeometry(1, 1, 1),
  cyl: new CylinderGeometry(1, 1, 1, 12),
  cyl6: new CylinderGeometry(1, 1, 1, 6),
  sq: new CylinderGeometry(0.7, 1, 1, 4),
  cone: new ConeGeometry(1, 1, 12),
  cone4: new ConeGeometry(1, 1, 4),
  dome: new SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2),
  ball: new SphereGeometry(1, 8, 6),
  canopy: new ConeGeometry(1, 1, 7),
  arch: new TorusGeometry(1, 0.22, 6, 12, Math.PI),
};

const STONE = ['#E9E2D3', '#DCD5C6', '#CFC6B5', '#E6D9C1', '#C8CED3', '#D9CFC0', '#BFC7CC'];
const GREENS = ['#7FA36A', '#8FB277', '#6E955E'];

function box(b, w, h, d, x, z, color, opts = {}) {
  const y0 = opts.y ?? 0;
  b.add(G.box, { pos: [x, y0 + h / 2, z], rot: [0, opts.ry ?? 0, 0], scale: [w, h, d], color, win: opts.win ?? 0, emit: opts.emit ?? 0, edges: opts.edges ?? true });
}

function tree(b, x, z, s, r) {
  b.add(G.cyl6, { pos: [x, 0.09 * s, z], scale: [0.03 * s, 0.18 * s, 0.03 * s], color: '#8A6A4C', edges: false });
  b.add(G.canopy, { pos: [x, 0.36 * s, z], rot: [0, r() * 3, 0], scale: [0.16 * s, 0.42 * s, 0.16 * s], color: GREENS[Math.floor(r() * GREENS.length)], threshold: 40 });
}

function palm(b, x, z, s, r) {
  const lean = (r() - 0.5) * 0.3;
  b.add(G.cyl6, { pos: [x, 0.3 * s, z], rot: [lean, 0, lean], scale: [0.025 * s, 0.6 * s, 0.025 * s], color: '#9A7B57', edges: false });
  const top = [x + lean * 0.3 * s, 0.6 * s, z - lean * 0.3 * s];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + r();
    const m = matrixOf({ pos: top, rot: [0, a, 0] }).multiply(matrixOf({ pos: [0.14 * s, -0.04 * s, 0], rot: [0, 0, -0.5], scale: [0.3 * s, 0.015 * s, 0.07 * s] }));
    b.add(G.box, { matrix: m, color: '#6F9A5A', edges: false });
  }
}

function harbourEdgeX(z) {
  const [cx, cz, rx, rz] = HARBOUR;
  const k = (z - cz) / rz;
  return Math.abs(k) < 1 ? cx - rx * Math.sqrt(1 - k * k) : cx + 2;
}

// ---------------------------------------------------------------------------
// MUMBAI: runway, skyline, Sea Link, Gateway of India, Marine Drive, local train
function buildMumbai() {
  const r = rng(19);
  const b = new Builder();
  const out = new Group();
  out.name = 'mumbai';

  // Runway + terminal
  const rl = RUNWAY.z1 - RUNWAY.z0;
  box(b, 0.62, 0.02, rl + 1, RUNWAY.x, (RUNWAY.z0 + RUNWAY.z1) / 2, '#5D6068', { edges: true });
  for (let z = RUNWAY.z0 + 0.4; z < RUNWAY.z1; z += 0.7) box(b, 0.05, 0.025, 0.32, RUNWAY.x, z, '#F4F1EA', { edges: false });
  box(b, 0.5, 0.25, 2.6, RUNWAY.x + 1.2, -22.4, '#D7DDE2', { win: 1 });
  b.add(G.cyl, { pos: [RUNWAY.x + 1.15, 0.55, -20.4], scale: [0.08, 1.1, 0.08], color: '#E5E1D8' });
  b.add(G.cyl, { pos: [RUNWAY.x + 1.15, 1.15, -20.4], scale: [0.2, 0.14, 0.2], color: '#A8C3D1', emit: 0.6 });

  // Skyline: tall towers in the middle of the island, low-rise elsewhere.
  let placed = 0;
  for (let i = 0; i < 400 && placed < 64; i++) {
    const z = -16 + r() * 13.5;
    const minX = westCoastX(z) + 0.85;
    const maxX = Math.min(harbourEdgeX(z) - 0.9, -55.5);
    if (maxX - minX < 0.6) continue;
    const x = minX + r() * (maxX - minX);
    if (Math.abs(x - TRACK.x) < 0.42) continue;
    if (z > -4.6 && x > -60.4) continue; // keep the Gateway clear
    if (z < -15.6 && x < -60.5) continue;
    const towerZone = z > -14 && z < -8.5;
    const south = z > -6.2;
    const h = towerZone ? 0.9 + r() * r() * 2.6 : south ? 0.6 + r() * 1.1 : 0.25 + r() * 0.6;
    const w = 0.22 + r() * 0.3;
    const d = 0.22 + r() * 0.3;
    box(b, w, h, d, x, z, STONE[Math.floor(r() * STONE.length)], { win: 1, ry: (r() - 0.5) * 0.3 });
    if (towerZone && h > 2.2) b.add(G.cyl, { pos: [x, h + 0.12, z], scale: [0.015, 0.24, 0.015], color: '#C9C2B4', edges: false });
    placed++;
  }
  for (let i = 0; i < 26; i++) {
    const z = -18 + r() * 17;
    const x = westCoastX(z) + 0.5 + r() * 4;
    if (Math.abs(x - TRACK.x) < 0.4 || x > harbourEdgeX(z) - 0.9) continue;
    tree(b, x, z, 0.8 + r() * 0.5, r);
  }

  // Bandra-Worli Sea Link: offshore cable-stayed bridge with two pylons.
  const slZ0 = -16.4;
  const slZ1 = -10.2;
  const slX = (z) => westCoastX(z) - 0.9 + Math.sin((z - slZ0) * 0.5) * 0.12;
  const steps = 14;
  for (let i = 0; i < steps; i++) {
    const za = slZ0 + ((slZ1 - slZ0) * i) / steps;
    const zb = slZ0 + ((slZ1 - slZ0) * (i + 1)) / steps;
    const xa = slX(za);
    const xb = slX(zb);
    const len = Math.hypot(xb - xa, zb - za);
    const m = new Matrix4().lookAt(new Vector3(xa, 0, za), new Vector3(xb, 0, zb), new Vector3(0, 1, 0));
    m.setPosition((xa + xb) / 2, 0.32, (za + zb) / 2);
    b.add(G.box, { matrix: m.multiply(matrixOf({ scale: [0.2, 0.05, len] })), color: '#E7E3DA', edges: i % 2 === 0 });
    const pm = new Matrix4().setPosition((xa + xb) / 2, 0.15, (za + zb) / 2);
    if (i % 2 === 1) b.add(G.cyl6, { matrix: pm.multiply(matrixOf({ scale: [0.03, 0.3, 0.03] })), color: '#CFC9BD', edges: false });
  }
  const cables = [];
  for (const pz of [-14.2, -12.4]) {
    const px = slX(pz);
    for (const s of [-1, 1]) {
      const m = matrixOf({ pos: [px + s * 0.07, 0.95, pz], rot: [0, 0, s * -0.12], scale: [0.045, 1.3, 0.07] });
      b.add(G.box, { matrix: m, color: '#E9E5DC' });
    }
    b.add(G.box, { pos: [px, 1.62, pz], scale: [0.12, 0.08, 0.08], color: '#E9E5DC' });
    for (let k = 1; k <= 6; k++) {
      for (const dir of [-1, 1]) {
        const dz = pz + dir * k * 0.15;
        cables.push(px, 1.55 - k * 0.02, pz, slX(dz), 0.34, dz);
      }
    }
  }
  b.addLines(cables, '#9AA3AE');

  // Gateway of India (faces the harbour) and the hotel beside it.
  const gx = -59.0;
  const gz = -3.3;
  const gm = matrixOf({ pos: [gx, 0, gz], rot: [0, Math.PI / 2, 0], scale: 0.9 });
  const gw = (opts) => b.add(opts.geo, { ...opts, parent: gm, color: opts.color || '#D8BE8C' });
  gw({ geo: G.box, pos: [0, 0.05, 0], scale: [1.5, 0.1, 0.7] });
  for (const sx of [-0.48, 0.48]) {
    gw({ geo: G.box, pos: [sx, 0.48, 0], scale: [0.34, 0.86, 0.5] });
    gw({ geo: G.cyl, pos: [sx * 1.32, 0.62, 0.2], scale: [0.08, 1.1, 0.08] });
    gw({ geo: G.cyl, pos: [sx * 1.32, 0.62, -0.2], scale: [0.08, 1.1, 0.08] });
    gw({ geo: G.dome, pos: [sx * 1.32, 1.17, 0.2], scale: 0.08, color: '#CDB07A' });
    gw({ geo: G.dome, pos: [sx * 1.32, 1.17, -0.2], scale: 0.08, color: '#CDB07A' });
  }
  gw({ geo: G.box, pos: [0, 1.0, 0], scale: [1.32, 0.2, 0.5] });
  gw({ geo: G.box, pos: [0, 1.17, 0], scale: [0.9, 0.14, 0.42] });
  gw({ geo: G.arch, pos: [0, 0.62, 0.0], rot: [Math.PI / 2, 0, 0], scale: [0.31, 0.31, 0.9] });
  box(b, 0.66, 0.72, 1.5, gx - 0.95, gz + 0.45, '#E5D4B4', { win: 1 });
  b.add(G.dome, { pos: [gx - 0.95, 0.72, gz + 0.45], scale: 0.24, color: '#B5523B' });
  for (const dz of [-0.15, 1.05]) b.add(G.dome, { pos: [gx - 0.95, 0.72, gz + dz], scale: 0.11, color: '#B5523B' });

  // Marine Drive promenade and the "Queen's Necklace" streetlights.
  const lamps = [];
  for (let i = 0; i < NECKLACE.count; i++) {
    const z = NECKLACE.z0 + ((NECKLACE.z1 - NECKLACE.z0) * i) / (NECKLACE.count - 1);
    const x = westCoastX(z) + NECKLACE.inset + Math.sin(i * 0.4) * 0.05;
    lamps.push([x, z]);
    b.add(G.ball, { pos: [x, 0.14, z], scale: 0.045, color: '#FFE2A0', emit: 1, edges: false });
  }
  for (let i = 0; i < lamps.length - 1; i++) {
    const [xa, za] = lamps[i];
    const [xb, zb] = lamps[i + 1];
    const m = new Matrix4().lookAt(new Vector3(xa, 0, za), new Vector3(xb, 0, zb), new Vector3(0, 1, 0));
    m.setPosition((xa + xb) / 2, 0.012, (za + zb) / 2);
    b.add(G.box, { matrix: m.multiply(matrixOf({ scale: [0.16, 0.02, Math.hypot(xb - xa, zb - za)] })), color: '#8C8C88', edges: false });
  }

  // Rail line
  const rails = [];
  for (const dx of [-0.05, 0.05]) rails.push(TRACK.x + dx, 0.03, TRACK.z0, TRACK.x + dx, 0.03, TRACK.z1);
  for (let z = TRACK.z0; z < TRACK.z1; z += 0.35) rails.push(TRACK.x - 0.09, 0.025, z, TRACK.x + 0.09, 0.025, z);
  b.addLines(rails, '#5A5752');
  b.add(G.box, { pos: [TRACK.x, 0.01, (TRACK.z0 + TRACK.z1) / 2], scale: [0.26, 0.02, TRACK.z1 - TRACK.z0], color: '#A39B8E', edges: false });

  out.add(b.build('mumbai-static'));

  // The local train: nine cars, maroon with a yellow band, running the line.
  const tb = new Builder();
  for (let i = 0; i < 9; i++) {
    const z = i * 0.66;
    tb.add(G.box, { pos: [0, 0.1, z], scale: [0.13, 0.13, 0.6], color: '#7B2D3A', win: 0 });
    tb.add(G.box, { pos: [0, 0.075, z], scale: [0.135, 0.03, 0.6], color: '#E7B847', edges: false });
    tb.add(G.box, { pos: [0, 0.135, z], scale: [0.137, 0.025, 0.56], color: '#F2E6C9', emit: 0.35, edges: false });
  }
  const train = tb.build('train');
  train.position.set(TRACK.x, 0, TRACK.z0);
  out.add(train);

  return {
    group: out,
    update(time) {
      const span = TRACK.z1 - TRACK.z0 - 6;
      train.position.z = TRACK.z0 + ((time * 0.9) % span);
    },
  };
}

// ---------------------------------------------------------------------------
// JAMSHEDPUR: the steel plant, Jubilee Park, XLRI
export const XLRI = new Vector3(69.4, 0, -50.2);
export const CHIMNEYS = [];

function buildJamshedpur() {
  const r = rng(22);
  const b = new Builder();
  const c = CITY.IXW;

  // Steel plant
  const px = c.x + 3.2;
  const pz = c.z - 1.8;
  for (let i = 0; i < 4; i++) {
    const x = px + i * 0.42;
    const z = pz - 0.6 + (i % 2) * 0.25;
    const h = 2.3 + (i % 2) * 0.5;
    b.add(G.cyl, { pos: [x, h / 2, z], scale: [0.1, h, 0.1], color: '#A39283' });
    b.add(G.cyl, { pos: [x, h - 0.22, z], scale: [0.105, 0.14, 0.105], color: '#B4553C', edges: false });
    CHIMNEYS.push(new Vector3(x, h + 0.05, z));
  }
  b.add(G.cyl, { pos: [px + 0.6, 0.8, pz + 0.9], scale: [0.42, 1.6, 0.42], color: '#7D7F86' });
  b.add(G.cone, { pos: [px + 0.6, 1.85, pz + 0.9], scale: [0.42, 0.5, 0.42], color: '#6C6E75' });
  b.add(G.cyl, { pos: [px + 0.6, 2.4, pz + 0.9], scale: [0.06, 0.8, 0.06], color: '#6C6E75' });
  box(b, 2.4, 0.55, 0.8, px + 0.9, pz + 2.1, '#8E9AA1');
  box(b, 1.6, 0.42, 0.7, px - 1.2, pz + 1.2, '#97A3A9');
  b.add(G.box, { pos: [px - 0.4, 0.55, pz + 0.3], rot: [0, 0.5, 0.45], scale: [1.8, 0.07, 0.14], color: '#6F7378' });
  for (let i = 0; i < 3; i++) b.add(G.cyl, { pos: [px - 1.3 + i * 0.4, 0.35, pz - 0.9], scale: [0.16, 0.7, 0.16], color: '#B9B2A5' });

  // XLRI campus: long brick blocks around a courtyard, a central tower.
  const xm = matrixOf({ pos: [XLRI.x, 0, XLRI.z], rot: [0, 0.2, 0] });
  b.add(G.box, { parent: xm, pos: [0, 0.22, -0.4], scale: [1.9, 0.44, 0.38], color: '#B35C43', win: 1 });
  b.add(G.box, { parent: xm, pos: [-0.8, 0.2, 0.25], scale: [0.36, 0.4, 1.0], color: '#B35C43', win: 1 });
  b.add(G.box, { parent: xm, pos: [0.8, 0.2, 0.25], scale: [0.36, 0.4, 1.0], color: '#B35C43', win: 1 });
  b.add(G.box, { parent: xm, pos: [0, 0.45, -0.4], scale: [0.36, 0.9, 0.42], color: '#A9533B', win: 1 });
  b.add(G.cone4, { parent: xm, pos: [0, 1.02, -0.4], rot: [0, Math.PI / 4, 0], scale: [0.3, 0.24, 0.3], color: '#6E3B2E' });
  b.add(G.box, { parent: xm, pos: [0, 0.01, 0.3], scale: [1.2, 0.02, 0.8], color: '#9DBB7E', edges: false });
  for (let i = 0; i < 6; i++) tree(b, XLRI.x - 1.4 + r() * 2.8, XLRI.z + 0.9 + r() * 0.7, 0.9, r);

  // Jubilee Park: trees ringing the lake
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    const rr = 1.3 + r() * 0.9;
    tree(b, 70.6 + Math.cos(a) * rr * 1.2, -46.2 + Math.sin(a) * rr * 0.8, 0.8 + r() * 0.5, r);
  }

  // Town
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2;
    const d = 1.5 + r() * 4.2;
    const x = c.x + Math.cos(a) * d * 1.2 - 1;
    const z = c.z + Math.sin(a) * d;
    if (Math.hypot(x - 70.6, z + 46.2) < 2.4 || Math.hypot(x - px, z - pz) < 2.6 || Math.hypot(x - XLRI.x, z - XLRI.z) < 1.6) continue;
    box(b, 0.25 + r() * 0.3, 0.2 + r() * 0.7, 0.25 + r() * 0.3, x, z, STONE[Math.floor(r() * STONE.length)], { win: 1, ry: r() });
  }
  const group = b.build('jamshedpur');
  return { group, update() {} };
}

// ---------------------------------------------------------------------------
// CHENNAI: Chennai Central, the Marina lighthouse, palms on the beach
export const LIGHTHOUSE = new Vector3(14.55, 0, 51.1);

const beamVert = /* glsl */ `
varying float vY;
void main() { vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const beamFrag = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity; varying float vY;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * pow(vY, 1.6) * 0.55);
  #include <colorspace_fragment>
}`;

function buildChennai() {
  const r = rng(13);
  const b = new Builder();
  const c = CITY.MAA;

  // Chennai Central: red facade, clock tower, corner turrets.
  const cm = matrixOf({ pos: [c.x - 0.6, 0, c.z - 1.5], rot: [0, 0.1, 0] });
  const red = '#B6503C';
  b.add(G.box, { parent: cm, pos: [0, 0.3, 0], scale: [2.2, 0.6, 0.55], color: red, win: 1 });
  b.add(G.box, { parent: cm, pos: [0, 0.62, 0], scale: [2.24, 0.05, 0.6], color: '#EFE6D6', edges: false });
  b.add(G.box, { parent: cm, pos: [0, 0.85, 0], scale: [0.36, 1.7, 0.36], color: red, win: 0 });
  b.add(G.box, { parent: cm, pos: [0, 1.5, 0], scale: [0.4, 0.3, 0.4], color: '#EFE6D6' });
  b.add(G.cone4, { parent: cm, pos: [0, 1.88, 0], rot: [0, Math.PI / 4, 0], scale: [0.34, 0.46, 0.34], color: '#8D3A2C' });
  for (const s of [-1, 1]) b.add(G.box, { parent: cm, pos: [0, 1.5, s * 0.205], scale: [0.18, 0.18, 0.02], color: '#FBF7EE', emit: 0.5, edges: false });
  for (const sx of [-1.05, 1.05]) {
    for (const sz of [-0.24, 0.24]) {
      b.add(G.box, { parent: cm, pos: [sx, 0.45, sz], scale: [0.16, 0.9, 0.16], color: red });
      b.add(G.cone4, { parent: cm, pos: [sx, 1.0, sz], rot: [0, Math.PI / 4, 0], scale: [0.13, 0.2, 0.13], color: '#8D3A2C' });
    }
  }

  // Lighthouse: tapered square tower, red band, lamp room.
  const L = LIGHTHOUSE;
  b.add(G.sq, { pos: [L.x, 1.15, L.z], rot: [0, Math.PI / 4, 0], scale: [0.16, 2.3, 0.16], color: '#E9E3D8' });
  b.add(G.sq, { pos: [L.x, 2.0, L.z], rot: [0, Math.PI / 4, 0], scale: [0.135, 0.22, 0.135], color: '#C1452F', edges: false });
  b.add(G.cyl, { pos: [L.x, 2.42, L.z], scale: [0.13, 0.22, 0.13], color: '#FFE7A8', emit: 1 });
  b.add(G.cone, { pos: [L.x, 2.62, L.z], scale: [0.15, 0.2, 0.15], color: '#C1452F' });

  // Palms along the beach, town inland
  for (let i = 0; i < 16; i++) {
    const z = c.z - 5 + i * 0.7 + r() * 0.3;
    palm(b, c.x + 1.9 + r() * 0.6 + (z - c.z) * -0.08, z, 0.9 + r() * 0.4, r);
  }
  for (let i = 0; i < 70; i++) {
    const x = c.x - 5.5 + r() * 6.6;
    const z = c.z - 5.5 + r() * 11;
    if (Math.hypot(x - (c.x - 0.6), z - (c.z - 1.5)) < 1.6 || x > c.x + 1.4) continue;
    const tall = Math.hypot(x - c.x, z - c.z) < 3 ? r() * 0.9 : 0;
    box(b, 0.24 + r() * 0.3, 0.22 + r() * 0.55 + tall, 0.24 + r() * 0.3, x, z, STONE[Math.floor(r() * STONE.length)], { win: 1, ry: r() * 0.4 });
  }
  const group = b.build('chennai');

  const beamMat = new ShaderMaterial({
    uniforms: { uColor: { value: PALETTE.lamp }, uOpacity: { value: 0 } },
    vertexShader: beamVert,
    fragmentShader: beamFrag,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const beamGeo = new ConeGeometry(0.9, 7, 16, 1, true);
  beamGeo.translate(0, -3.5, 0);
  beamGeo.rotateZ(Math.PI / 2);
  const beam = new Mesh(beamGeo, beamMat);
  beam.position.set(L.x, 2.42, L.z);
  group.add(beam);

  return {
    group,
    update(time, colorAmount) {
      beam.rotation.y = time * 0.9;
      beamMat.uniforms.uOpacity.value = Math.max(U.uDusk.value * 0.8, U.uNight.value) * colorAmount;
    },
  };
}

export function buildCities() {
  const list = [buildMumbai(), buildJamshedpur(), buildChennai()];
  const group = new Group();
  group.name = 'cities';
  for (const c of list) group.add(c.group);
  return {
    group,
    update(time, colorAmount) {
      for (const c of list) c.update(time, colorAmount);
    },
  };
}
