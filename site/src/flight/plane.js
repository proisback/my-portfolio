import {
  LatheGeometry, ExtrudeGeometry, Shape, CylinderGeometry, BoxGeometry, SphereGeometry,
  Vector2, Group, Mesh, BackSide, BufferAttribute,
} from 'three';
import { Builder, createWorldMaterial } from './materials.js';
import { buildSidekick } from './sidekick.js';

// A procedural airliner, nose along +Z, about 2.2 units long. The fuselage
// is front-face culled, so a camera inside the nose sees the cockpit set
// and the world outside, not the hull.

const PROFILE = [
  [0.0, -1.12], [0.045, -1.08], [0.085, -0.96], [0.125, -0.68], [0.14, -0.32],
  [0.14, 0.58], [0.135, 0.76], [0.12, 0.9], [0.092, 1.0], [0.052, 1.08], [0.0, 1.12],
].map(([r, y]) => new Vector2(r, y));

function flat(points, depth) {
  const s = new Shape(points.map(([x, y]) => new Vector2(x, y)));
  return new ExtrudeGeometry(s, { depth, bevelEnabled: false });
}

function wing(sign, span, root, tip, sweep, depth) {
  // x = spanwise, y = chordwise (+ is forward)
  const pts = [
    [sign * 0.06, root / 2],
    [sign * span, root / 2 - sweep],
    [sign * span, root / 2 - sweep - tip],
    [sign * 0.06, -root / 2],
  ];
  const g = flat(pts, depth);
  g.rotateX(Math.PI / 2);
  g.translate(0, depth / 2, 0);
  return g;
}

function paintMesh(geo, hex) {
  const b = new Builder();
  b.add(geo, { color: hex, edges: false });
  const g = b.meshParts[0];
  b.meshParts.length = 0;
  return g;
}

export function buildPlane() {
  const b = new Builder();
  const fus = new LatheGeometry(PROFILE, 18);
  fus.rotateX(Math.PI / 2);
  b.add(fus, { color: '#F3F0E8', threshold: 35 });

  for (const s of [-1, 1]) {
    b.add(wing(s, 1.08, 0.5, 0.16, 0.48, 0.026), { pos: [0, -0.07, 0.08], rot: [0, 0, s * 0.07], color: '#DCDDDE' });
    b.add(wing(s, 0.42, 0.26, 0.1, 0.2, 0.018), { pos: [0, 0.02, -0.92], rot: [0, 0, s * 0.1], color: '#DCDDDE' });
    const eng = new CylinderGeometry(0.058, 0.05, 0.32, 14, 1, false);
    eng.rotateX(Math.PI / 2);
    b.add(eng, { pos: [s * 0.4, -0.15, 0.2], color: '#C9CBD0', threshold: 40 });
    b.add(new CylinderGeometry(0.06, 0.06, 0.05, 14).rotateX(Math.PI / 2), { pos: [s * 0.4, -0.15, 0.37], color: '#F5C94C', edges: false });
    b.add(new BoxGeometry(0.02, 0.07, 0.16), { pos: [s * 0.4, -0.1, 0.18], color: '#C9CBD0', edges: false });
    for (let i = 0; i < 16; i++) {
      b.add(new BoxGeometry(0.004, 0.018, 0.026), { pos: [s * 0.1385, 0.035, -0.55 + i * 0.085], color: '#2C3445', edges: false });
    }
  }
  const fin = flat([[-0.6, 0], [-1.08, 0], [-1.13, 0.5], [-0.98, 0.5]], 0.022);
  fin.rotateY(-Math.PI / 2);
  b.add(fin, { pos: [-0.011, 0.06, 0], color: '#F5C94C' });
  b.add(new BoxGeometry(0.15, 0.03, 0.055), { pos: [0, 0.075, 0.965], rot: [-0.55, 0, 0], color: '#2A3242', edges: false });
  const plane = b.build('plane');

  // Cockpit set (only meaningful from inside): glare shield, a glass cockpit
  // of lit displays, two yokes, seats, and the sidekick in the right seat.
  const cockpit = new Group();
  cockpit.name = 'cockpit';
  const cb = new Builder();
  cb.add(new BoxGeometry(0.2, 0.05, 0.06), { pos: [0, -0.108, 0.93], color: '#2B303C', edges: false });
  cb.add(new BoxGeometry(0.2, 0.012, 0.05), { pos: [0, -0.076, 0.935], rot: [0.18, 0, 0], color: '#20242E', edges: false });
  const screens = [[-0.068, '#78CDBE'], [-0.026, '#F5C94C'], [0.026, '#78CDBE'], [0.068, '#F5C94C']];
  for (const [x, col] of screens) {
    cb.add(new BoxGeometry(0.026, 0.016, 0.002), { pos: [x, -0.1, 0.9], rot: [-0.18, 0, 0], color: col, emit: 0.85, edges: false });
  }
  cb.add(new BoxGeometry(0.05, 0.03, 0.05), { pos: [0, -0.13, 0.885], color: '#2B303C', edges: false });
  for (const s of [-1, 1]) {
    cb.add(new BoxGeometry(0.004, 0.004, 0.05), { pos: [s * 0.045, -0.1, 0.875], color: '#15181F', edges: false });
    cb.add(new BoxGeometry(0.03, 0.005, 0.004), { pos: [s * 0.045, -0.097, 0.85], color: '#15181F', edges: false });
    cb.add(new BoxGeometry(0.058, 0.085, 0.014), { pos: [s * 0.046, -0.05, 0.79], rot: [0.15, 0, 0], color: '#5A4A42', edges: false });
    cb.add(new BoxGeometry(0.058, 0.014, 0.05), { pos: [s * 0.046, -0.09, 0.815], color: '#5A4A42', edges: false });
  }
  cb.add(new BoxGeometry(0.003, 0.07, 0.004), { pos: [0, 0.03, 0.953], rot: [-0.6, 0, 0], color: '#15181F', edges: false });
  cb.add(new BoxGeometry(0.18, 0.003, 0.004), { pos: [0, 0.064, 0.935], color: '#15181F', edges: false });
  cockpit.add(cb.build('cockpit-set', { forceColor: true }));

  // Interior shell: back faces of the cabin walls; the open nose ahead of it
  // reads as the windscreen, framed by the dashboard and the window posts.
  const shellCabin = new LatheGeometry(PROFILE.filter((p) => p.y <= 0.9 && p.y >= 0.4).map((p) => new Vector2(p.x * 0.97, p.y)), 18);
  shellCabin.rotateX(Math.PI / 2);
  const shellMat = createWorldMaterial({ side: BackSide, polygonOffset: false, defines: { FORCE_COLOR: '' } });
  for (const g of [shellCabin]) {
    cockpit.add(new Mesh(paintMesh(g, '#343947'), shellMat));
  }

  const sidekick = buildSidekick();
  sidekick.group.scale.setScalar(0.016);
  sidekick.group.position.set(-0.05, -0.004, 0.845);
  sidekick.group.rotation.y = 2.05;
  cockpit.add(sidekick.group);
  const group = new Group();
  group.name = 'aircraft';
  group.add(plane, cockpit);
  return {
    group,
    cockpit,
    // Eye point of the captain's seat, in plane space.
    eye: { x: 0.046, y: 0.036, z: 0.78 },
    // c: how far the camera is into the cockpit (0 outside, 1 seated).
    update(time, c) {
      cockpit.visible = c > 0.05;
      plane.visible = c < 0.9;
      if (cockpit.visible) sidekick.update(time);
    },
  };
}
