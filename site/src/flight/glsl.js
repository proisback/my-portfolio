// Shared GLSL. Every world material uses the same reveal logic so the
// blueprint-to-color fill moves across ground, buildings and clouds as one.

export const NOISE = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < FBM_OCTAVES; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}
`;

export const REVEAL_UNIFORMS = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform vec4 uWave;
uniform vec4 uLocal;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uNight;
uniform float uDusk;
uniform vec3 uSunDir;
`;

// 0 = blueprint ink on paper, 1 = full color.
// uReveal spreads color organically (an fbm threshold), the wave sweeps a
// ring outward with an ink-bleed edge, uLocal paints one small area.
export const REVEAL = /* glsl */ `
float revealMask(vec3 wp) {
  float t = fbm(wp.xz * 0.045 + 3.7);
  t = clamp((t - 0.22) / 0.56, 0.0, 1.0);
  float m = smoothstep(t - 0.06, t + 0.02, uReveal * 1.08 - 0.04);
  float bleed = fbm(wp.xz * 0.35) * 5.0;
  if (uWave.w > 0.0) {
    float d = distance(wp.xz, uWave.xz) + bleed;
    m = max(m, 1.0 - smoothstep(uWave.w - 7.0, uWave.w, d));
  }
  if (uLocal.w > 0.0) {
    float d = distance(wp.xz, uLocal.xz) + bleed * 0.35;
    m = max(m, (1.0 - smoothstep(uLocal.w * 0.55, uLocal.w, d)) * 0.92);
  }
  return clamp(m, 0.0, 1.0);
}

vec3 applyFog(vec3 col, vec3 wp, float m) {
  float d = distance(wp, cameraPosition);
  float f = smoothstep(uFogNear, uFogFar, d);
  return mix(col, mix(uPaper, uFogColor, m), f);
}

// World-space hatching that doesn't swim when the camera moves.
float hatch(vec2 p, float density, float shade) {
  float x = (p.x + p.y) * density;
  float v = abs(fract(x) - 0.5);
  float w = fwidth(x) * 0.75 + 0.0001;
  float hw = shade * 0.28;
  return (1.0 - smoothstep(hw - w, hw + w, v)) * step(0.01, shade);
}

// Hatching that keeps ~7px spacing on screen at any distance: pick the two
// nearest power-of-two densities and blend, like mipmapping the pattern.
float hatchLOD(vec2 p, float shade) {
  float px = max(length(fwidth(p)), 1e-5);
  float lod = log2(px * 7.0);
  float l0 = floor(lod);
  float d0 = exp2(-l0);
  return mix(hatch(p, d0, shade), hatch(p, d0 * 0.5, shade), fract(lod));
}
`;
