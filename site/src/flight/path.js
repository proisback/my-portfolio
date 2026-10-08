import { CatmullRomCurve3, Vector3, Matrix4, Quaternion } from 'three';
import { RUNWAY } from './places.js';

// Waypoints (x, altitude, z). Indices are referenced by the choreography,
// so keep the comments in sync when editing.
const W = [
  [RUNWAY.x, 0.12, -26.0], // 0  runway start, Mumbai
  [RUNWAY.x, 0.14, -21.0], // 1  take-off roll
  [RUNWAY.x, 0.95, -16.4], // 2  lift-off
  [-65.6, 2.6, -11.8], //     3  offshore, past the Sea Link
  [-64.4, 3.9, -6.4], //      4  along Marine Drive, offshore
  [-59.6, 4.9, -0.6], //      5  over the south tip, turning east
  [-54.2, 5.8, -5.0], //      6  over the harbour, turning north-east
  [-49.0, 7.4, -13.5], //     7  climbing out of Mumbai
  [-24.0, 13.0, -27.0], //    8  cruise
  [2.0, 15.0, -36.0], //      9  cloud bank 1
  [35.0, 13.0, -45.0], //     10 cruise
  [57.0, 7.4, -53.0], //      11 approach Jamshedpur
  [66.0, 4.8, -54.6], //      12 over XLRI
  [74.4, 4.4, -53.0], //      13 over the steel plant
  [77.4, 4.6, -46.8], //      14
  [72.2, 5.0, -41.6], //      15 over Jubilee Park
  [64.8, 6.8, -42.4], //      16 turning south-west
  [55.0, 12.0, -28.0], //     17 cruise
  [40.0, 15.0, -5.0], //      18 cloud bank 2
  [26.0, 12.0, 20.0], //      19 cruise
  [19.0, 6.6, 35.0], //       20 approach Chennai along the coast
  [16.9, 4.5, 44.4], //       21
  [16.2, 3.9, 50.4], //       22 past the lighthouse
  [12.2, 3.9, 54.6], //       23 turning west
  [8.4, 5.0, 49.0], //        24 over Chennai Central
  [5.8, 7.2, 43.0], //        25 climbing out
  [-12.0, 13.0, 30.0], //     26 cruise into dusk
  [-33.0, 15.0, 14.0], //     27 cloud bank 3
  [-49.0, 11.0, 2.4], //      28 descending to Mumbai
  [-55.6, 6.6, -1.0], //      29 over the harbour at dusk
  [-60.8, 5.9, -6.2], //      30 over Marine Drive
  [-64.6, 5.8, -12.0], //     31 past the Sea Link
  [-63.6, 6.4, -20.0], //     32 north along the coast
  [-59.6, 7.2, -27.0], //     33 the turn, past the airport
  [-59.1, 5.6, -22.5], //     34 cockpit: lined up over the rail line
  [-59.6, 4.9, -15.5], //     35 low down the spine, towers on both sides
  [-60.0, 5.3, -8.0], //      36 the wave
  [-60.6, 7.0, 1.0], //       37 out over the south tip
];

export const N = W.length;
export const P = (i) => i / (N - 1);
export const BANKS = [9, 18, 27].map((i) => new Vector3(...W[i]));

export function buildPath() {
  return new CatmullRomCurve3(W.map((w) => new Vector3(...w)), false, 'centripetal', 0.5);
}

const UP = new Vector3(0, 1, 0);
const a = new Vector3();
const b = new Vector3();
const c = new Vector3();
const m = new Matrix4();
const q = new Quaternion();

// Plane pose at curve parameter t, with banking from horizontal curvature.
// `state.roll` is damped across frames for smoothness.
export function planePose(curve, t, state, dt) {
  const tt = Math.min(Math.max(t, 0), 1);
  const e = 0.0016;
  curve.getPoint(tt, state.pos);
  curve.getPoint(Math.min(1, tt + e), a);
  curve.getPoint(Math.min(1, tt + 2 * e), b);
  if (tt >= 1 - 2 * e) {
    curve.getPoint(tt - e, c);
    a.copy(state.pos).add(state.pos).sub(c);
    b.copy(a).add(a).sub(state.pos);
  }
  state.fwd.copy(a).sub(state.pos).normalize();
  c.copy(b).sub(a).normalize();
  const turn = state.fwd.x * c.z - state.fwd.z * c.x;
  const onGround = state.pos.y < 0.5 ? 0 : Math.min(1, (state.pos.y - 0.5) / 1.5);
  const target = Math.max(-0.75, Math.min(0.75, turn * 26)) * onGround;
  const k = 1 - Math.exp(-dt * 3.5);
  state.roll += (target - state.roll) * k;

  // Level frame (no roll) for exterior cameras, rolled frame for the plane.
  state.right.crossVectors(UP, state.fwd).normalize();
  state.up.crossVectors(state.fwd, state.right).normalize();
  m.makeBasis(state.right, state.up, state.fwd);
  state.quat.setFromRotationMatrix(m);
  q.setFromAxisAngle(state.fwd, state.roll);
  state.quatRolled.copy(state.quat).premultiply(q);
  return state;
}

export function createPose() {
  return {
    pos: new Vector3(),
    fwd: new Vector3(0, 0, 1),
    right: new Vector3(1, 0, 0),
    up: new Vector3(0, 1, 0),
    quat: new Quaternion(),
    quatRolled: new Quaternion(),
    roll: 0,
  };
}

const camA = new Vector3();
const tgtA = new Vector3();
const eyeV = new Vector3();
const lookV = new Vector3();

// Camera from the scrubbed state S: a plane-relative chase rig blended with a
// world-anchored rig (S.world) and the captain's seat (S.cockpit).
export function composeCamera(camera, pose, S, eye) {
  // Chase rig in the level frame
  camA.copy(pose.pos)
    .addScaledVector(pose.fwd, -S.back)
    .addScaledVector(UP, S.up)
    .addScaledVector(pose.right, S.right);
  tgtA.copy(pose.pos).addScaledVector(pose.fwd, S.ahead).addScaledVector(UP, S.lookUp);

  // World rig
  camA.lerp(b.set(S.wx, S.wy, S.wz), S.world);
  tgtA.lerp(c.set(S.tx, S.ty, S.tz), S.world);

  if (S.cockpit > 0) {
    // Captain's eye in the rolled plane frame, looking ahead (S.look turns
    // the head toward the co-pilot seat).
    eyeV.set(eye.x, eye.y, eye.z).applyQuaternion(pose.quatRolled).add(pose.pos);
    lookV.set(eye.x - S.look * 1.1, eye.y - 0.3 + S.look * 0.12, eye.z + 1).applyQuaternion(pose.quatRolled).add(pose.pos);
    const k = S.cockpit * S.cockpit * (3 - 2 * S.cockpit);
    camA.lerp(eyeV, k);
    tgtA.lerp(lookV, k);
    if (k > 0.98) camera.up.set(0, 1, 0).applyQuaternion(pose.quatRolled);
    else camera.up.set(0, 1, 0);
  } else {
    camera.up.set(0, 1, 0);
  }
  camera.position.copy(camA);
  camera.lookAt(tgtA);
  const fov = Math.min(100, S.fov * (camera.userData.fovScale || 1));
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}
