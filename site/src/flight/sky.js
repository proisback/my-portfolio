import { SphereGeometry, Mesh, ShaderMaterial, BackSide, Vector3 } from 'three';
import { U } from './uniforms.js';

const vert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
  gl_Position.z = gl_Position.w * 0.99999;
}`;

const frag = /* glsl */ `
uniform vec3 uSkyTop;
uniform vec3 uSkyHorizon;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uSunDir;
uniform vec3 uMoonDir;
uniform float uNight;
uniform float uSkyM;
uniform float uTime;
varying vec3 vDir;
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y, -1.0, 1.0);
  vec3 sky = mix(uSkyHorizon, uSkyTop, pow(smoothstep(-0.02, 0.6, h), 0.75));

  float sun = smoothstep(0.9975, 0.999, dot(d, normalize(uSunDir)));
  float glow = pow(max(dot(d, normalize(uSunDir)), 0.0), 24.0) * 0.35;
  sky += (sun * 0.6 + glow) * vec3(1.0, 0.86, 0.6) * (1.0 - uNight);

  vec2 sp = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0))) * 140.0;
  float star = step(0.9965, hash12(floor(sp))) * smoothstep(0.05, 0.35, h);
  star *= 0.6 + 0.4 * sin(uTime * 2.0 + hash12(floor(sp)) * 40.0);
  sky += star * uNight * vec3(0.9, 0.92, 1.0);
  float moon = smoothstep(0.9988, 0.9993, dot(d, normalize(uMoonDir)));
  float moonGlow = pow(max(dot(d, normalize(uMoonDir)), 0.0), 60.0) * 0.25;
  sky += (moon * 0.9 + moonGlow) * vec3(1.0, 0.96, 0.85) * uNight;

  vec3 bp = mix(uPaper * 0.985, uPaper, smoothstep(0.0, 0.25, h));
  float rule = 1.0 - smoothstep(0.0, fwidth(h) * 1.5, abs(h - 0.004));
  bp = mix(bp, uInk, rule * 0.25);
  float sunInk = smoothstep(0.9965, 0.9970, dot(d, normalize(uSunDir))) - smoothstep(0.9974, 0.9979, dot(d, normalize(uSunDir)));
  bp = mix(bp, uInk, sunInk * 0.45);

  gl_FragColor = vec4(mix(bp, sky, uSkyM), 1.0);
  #include <colorspace_fragment>
}`;

export function buildSky() {
  const mat = new ShaderMaterial({
    uniforms: {
      uSkyTop: U.uSkyTop,
      uSkyHorizon: U.uSkyHorizon,
      uPaper: U.uPaper,
      uInk: U.uInk,
      uSunDir: U.uSunDir,
      uNight: U.uNight,
      uTime: U.uTime,
      uMoonDir: { value: new Vector3(0.35, 0.42, 0.6).normalize() },
      uSkyM: { value: 0 },
    },
    vertexShader: vert,
    fragmentShader: frag,
    side: BackSide,
    depthWrite: false,
  });
  const mesh = new Mesh(new SphereGeometry(500, 48, 24), mat);
  mesh.name = 'sky';
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;
  return mesh;
}
