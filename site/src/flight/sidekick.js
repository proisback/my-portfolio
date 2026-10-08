import { SphereGeometry, CylinderGeometry, TorusGeometry, Group } from 'three';
import { Builder } from './materials.js';

// The marigold AI sidekick from the old site's illustrations, built from
// primitives: round head, big eyes, a smile, ear cups, antenna, waving arm.
const MARIGOLD = '#F2C14E';
const DEEP = '#DDA235';
const INK = '#1C1B22';

export function buildSidekick() {
  const sphere = new SphereGeometry(1, 16, 12);
  const cyl = new CylinderGeometry(1, 1, 1, 12);
  const smile = new TorusGeometry(0.3, 0.05, 6, 14, Math.PI);

  const b = new Builder();
  b.add(sphere, { pos: [0, 0, 0], scale: [1, 0.9, 0.95], color: MARIGOLD, threshold: 60 });
  for (const s of [-1, 1]) {
    b.add(sphere, { pos: [s * 0.33, 0.06, 0.82], scale: [0.17, 0.23, 0.12], color: INK, edges: false });
    b.add(sphere, { pos: [s * 0.33 + 0.05, 0.13, 0.92], scale: 0.05, color: '#FFFFFF', edges: false });
    b.add(cyl, { pos: [s * 0.98, 0, 0], rot: [0, 0, Math.PI / 2], scale: [0.26, 0.16, 0.26], color: DEEP, threshold: 60 });
  }
  b.add(smile, { pos: [0, -0.24, 0.86], rot: [0.2, 0, Math.PI], scale: 1, color: INK, edges: false });
  b.add(cyl, { pos: [0, 1.05, 0], scale: [0.04, 0.35, 0.04], color: DEEP, edges: false });
  b.add(sphere, { pos: [0, 1.28, 0], scale: 0.13, color: MARIGOLD });
  b.add(cyl, { pos: [0, -0.92, 0], scale: [0.32, 0.18, 0.32], color: DEEP, edges: false });
  b.add(sphere, { pos: [0, -1.55, 0], scale: [0.78, 0.72, 0.62], color: MARIGOLD, threshold: 60 });
  b.add(cyl, { pos: [-0.72, -1.5, 0.15], rot: [0.5, 0, 0.35], scale: [0.14, 0.62, 0.14], color: DEEP });
  const body = b.build('sidekick-body', { forceColor: true });

  const ab = new Builder();
  ab.add(cyl, { pos: [0, 0.3, 0], scale: [0.13, 0.62, 0.13], color: DEEP });
  ab.add(cyl, { pos: [0, 0.78, 0.05], scale: [0.12, 0.4, 0.12], color: MARIGOLD });
  ab.add(sphere, { pos: [0, 1.06, 0.08], scale: [0.2, 0.22, 0.12], color: MARIGOLD });
  const arm = ab.build('sidekick-arm', { forceColor: true });
  const shoulder = new Group();
  shoulder.position.set(0.66, -1.32, 0.05);
  shoulder.add(arm);

  const group = new Group();
  group.name = 'sidekick';
  group.add(body, shoulder);
  return {
    group,
    update(time) {
      shoulder.rotation.z = -0.55 + Math.sin(time * 5.5) * 0.42;
      shoulder.rotation.x = -0.2;
      body.rotation.z = Math.sin(time * 1.4) * 0.04;
      body.position.y = Math.sin(time * 2.2) * 0.03;
    },
  };
}
