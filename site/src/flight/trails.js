import { BufferGeometry, BufferAttribute, Line, ShaderMaterial, Vector3, Group } from 'three';
import { NOISE, REVEAL_UNIFORMS, REVEAL } from './glsl.js';
import { U } from './uniforms.js';

// Contrails from both engines, sampled from the flight curve behind the
// plane (not from frame history), so they stay right when scrolling back.
const SAMPLES = 48;
const SPAN = 0.022; // curve parameter covered by a trail

const vert = /* glsl */ `
attribute float aU;
varying float vU;
varying vec3 vWorld;
void main() {
  vU = aU;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const frag = /* glsl */ `
#define FBM_OCTAVES 2
${REVEAL_UNIFORMS}
uniform float uAlpha;
varying float vU;
varying vec3 vWorld;
${NOISE}
${REVEAL}
void main() {
  float m = revealMask(vWorld);
  vec3 col = mix(uInk, vec3(1.0), m);
  col = mix(col, vec3(0.75, 0.8, 0.95), uNight * m);
  float a = (1.0 - vU) * smoothstep(0.0, 0.08, vU) * uAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a * 0.8);
  #include <colorspace_fragment>
}`;

export function buildTrails() {
  const mat = new ShaderMaterial({
    uniforms: { ...U, uAlpha: { value: 0 } },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
  });
  const group = new Group();
  group.name = 'trails';
  const lines = [-0.4, 0.4].map(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(SAMPLES * 3), 3));
    const u = new Float32Array(SAMPLES);
    for (let i = 0; i < SAMPLES; i++) u[i] = i / (SAMPLES - 1);
    geo.setAttribute('aU', new BufferAttribute(u, 1));
    const line = new Line(geo, mat);
    line.frustumCulled = false;
    group.add(line);
    return line;
  });

  const p = new Vector3();
  const q = new Vector3();
  const side = new Vector3();
  return {
    group,
    update(curve, t, pose, cockpit) {
      // Only at altitude, never inside the cockpit.
      const alt = pose.pos.y;
      mat.uniforms.uAlpha.value = Math.min(1, Math.max(0, (alt - 4.5) / 3)) * (1 - cockpit);
      if (mat.uniforms.uAlpha.value <= 0) {
        group.visible = false;
        return;
      }
      group.visible = true;
      lines.forEach((line, k) => {
        const off = k === 0 ? -0.4 : 0.4;
        const arr = line.geometry.attributes.position.array;
        for (let i = 0; i < SAMPLES; i++) {
          const tt = Math.max(0, t - (i / (SAMPLES - 1)) * SPAN);
          curve.getPoint(tt, p);
          curve.getPoint(Math.min(1, tt + 0.002), q);
          side.set(q.z - p.z, 0, p.x - q.x).normalize();
          arr[i * 3] = p.x + side.x * off;
          arr[i * 3 + 1] = p.y - 0.16;
          arr[i * 3 + 2] = p.z + side.z * off;
        }
        line.geometry.attributes.position.needsUpdate = true;
      });
    },
  };
}
