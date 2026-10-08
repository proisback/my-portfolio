import {
  WebGLRenderer, Scene, PerspectiveCamera, Vector3, Mesh, CircleGeometry, ShaderMaterial,
} from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { U, setTimeOfDay } from './uniforms.js';
import { setQuality, disposeShared } from './materials.js';
import { buildGround, buildRoute } from './ground.js';
import { buildSky } from './sky.js';
import { buildCities, CHIMNEYS, XLRI, LIGHTHOUSE } from './cities.js';
import { buildPlane } from './plane.js';
import { buildClouds } from './clouds.js';
import { buildPath, planePose, createPose, composeCamera, BANKS, P } from './path.js';
import { S, buildChoreography, destroyChoreography } from './choreography.js';
import { CITY } from './places.js';

const LABELS = [
  { code: 'BOM', name: 'Mumbai', pos: CITY.BOM, y: 0.4 },
  { code: 'IXW', name: 'Jamshedpur', pos: CITY.IXW, y: 0.4 },
  { code: 'MAA', name: 'Chennai', pos: CITY.MAA, y: 0.4 },
  { code: 'XLRI', name: 'Jamshedpur', pos: XLRI, y: 1.4, small: true },
  { code: 'Lighthouse', name: 'Marina', pos: LIGHTHOUSE, y: 3.0, small: true },
];

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function shadowMesh() {
  const mat = new ShaderMaterial({
    uniforms: { uAlpha: { value: 0.3 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float uAlpha; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.13, 0.16, 0.25, uAlpha * (1.0 - smoothstep(0.2, 1.0, d))); }',
    transparent: true,
    depthWrite: false,
  });
  const m = new Mesh(new CircleGeometry(1, 24), mat);
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 2;
  return m;
}

export function startFlight({ tier, canvas, stage, journey, veil, onFail }) {
  setQuality(tier);
  const renderer = new WebGLRenderer({
    canvas,
    antialias: tier === 'full',
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
  });
  let dprCap = tier === 'full' ? 2 : 1.5;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.08, 900);

  const curve = buildPath();
  const ground = buildGround(tier);
  const route = buildRoute(curve, tier === 'full' ? 1100 : 700);
  const sky = buildSky();
  const cities = buildCities();
  const aircraft = buildPlane();
  const { clouds, smoke } = buildClouds(tier, BANKS, CHIMNEYS);
  const shadow = shadowMesh();
  scene.add(sky, ground, route, cities.group, aircraft.group, clouds, smoke, shadow);

  const pose = createPose();
  const waveCenter = curve.getPoint(P(35.3));

  // City labels, projected from 3D into crisp DOM text.
  const labelLayer = document.createElement('div');
  labelLayer.className = 'city-labels';
  stage.appendChild(labelLayer);
  const labels = LABELS.map((l) => {
    const el = document.createElement('div');
    el.className = 'city-label' + (l.small ? ' city-label--small' : '');
    el.innerHTML = `<b>${l.code}</b><span>${l.name}</span>`;
    labelLayer.appendChild(el);
    return { ...l, el, world: new Vector3(l.pos.x, l.y, l.pos.z), shown: false };
  });
  const proj = new Vector3();

  let width = 0;
  let height = 0;
  // On wide screens the cards sit on the left, so the scene's focus shifts right.
  let shiftPx = 0;
  let appliedShift = NaN;
  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    shiftPx = width >= 900 ? width * 0.15 : 0;
    appliedShift = NaN;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.userData.fovScale = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 0.8 : 1;
    camera.updateProjectionMatrix();
  }
  resize();

  ScrollTrigger.config({ ignoreMobileResize: true });
  buildChoreography(journey);
  let lastW = window.innerWidth;
  let rebuildTimer;
  const onResize = () => {
    resize();
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => {
      buildChoreography(journey);
      ScrollTrigger.refresh();
    }, 180);
  };
  window.addEventListener('resize', onResize);
  document.fonts?.ready.then(() => {
    buildChoreography(journey);
    ScrollTrigger.refresh();
  });

  let last = performance.now();
  let time = 0;
  let raf = 0;
  let ready = false;
  let lastVeilNight = false;
  let dead = false;

  // Frame-time guard: drop resolution, then bail to the 2D route map.
  let sample = 0;
  let frames = 0;
  let warm = 0;
  let downgraded = false;

  function fail(reason) {
    if (dead) return;
    console.debug('[flight] falling back:', reason);
    dispose();
    onFail?.(reason);
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;

    U.uTime.value = time;
    U.uReveal.value = S.reveal;
    U.uLocal.value.set(XLRI.x, 0, XLRI.z, S.local);
    U.uWave.value.set(waveCenter.x, 0, waveCenter.z, S.waveR > 0.05 ? S.waveR : -1);
    setTimeOfDay(S.tod);
    const colorAmount = Math.max(smooth(0.3, 0.95, S.reveal), Math.min(1, S.waveR / 110));
    sky.material.uniforms.uSkyM.value = colorAmount;
    route.material.uniforms.uProgress.value = S.t;

    planePose(curve, S.t, pose, dt);
    aircraft.group.position.copy(pose.pos);
    aircraft.group.quaternion.copy(pose.quatRolled);
    aircraft.update(time, S.cockpit);
    shadow.position.set(pose.pos.x, 0.03, pose.pos.z);
    shadow.scale.setScalar(0.9 + pose.pos.y * 0.25);
    shadow.material.uniforms.uAlpha.value = 0.32 * (1 - smooth(0.5, 9, pose.pos.y)) * (1 - S.cockpit);

    const near = S.cockpit > 0.15 ? 0.004 : 0.08;
    if (camera.near !== near) {
      camera.near = near;
      camera.far = near < 0.01 ? 420 : 900;
      camera.updateProjectionMatrix();
    }
    composeCamera(camera, pose, S, aircraft.eye);
    const shift = shiftPx * S.shift;
    if (!(Math.abs(shift - appliedShift) < 0.5)) {
      camera.setViewOffset(width, height, -shift, 0, width, height);
      appliedShift = shift;
    }
    sky.position.copy(camera.position);
    cities.update(time, colorAmount);

    veil.style.opacity = S.veil.toFixed(3);
    const veilNight = U.uNight.value > 0.5;
    if (veilNight !== lastVeilNight) {
      veil.style.background = veilNight ? '#141B33' : '';
      lastVeilNight = veilNight;
    }

    const labelAlpha = (1 - S.veil) * (1 - smooth(0.05, 0.4, S.cockpit));
    for (const l of labels) {
      proj.copy(l.world).project(camera);
      const dist = camera.position.distanceTo(l.world);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1 && dist < (l.small ? 16 : 34) && dist > 2;
      const a = vis ? labelAlpha * (1 - smooth(l.small ? 10 : 24, l.small ? 16 : 34, dist)) : 0;
      if (a > 0.01) {
        const x = (proj.x * 0.5 + 0.5) * width;
        const y = (-proj.y * 0.5 + 0.5) * height;
        l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        l.el.style.opacity = a.toFixed(3);
        l.shown = true;
      } else if (l.shown) {
        l.el.style.opacity = '0';
        l.shown = false;
      }
    }

    renderer.render(scene, camera);

    if (!ready) {
      ready = true;
      stage.classList.add('is-ready');
      document.documentElement.classList.add('has-3d');
    }

    warm += dt;
    if (warm > 2) {
      sample += dt;
      frames++;
      if (sample > 3) {
        const avg = sample / frames;
        sample = frames = 0;
        if (avg > 1 / 26 && !downgraded) {
          downgraded = true;
          dprCap = 1;
          renderer.setPixelRatio(1);
          resize();
        } else if (avg > 1 / 20 && downgraded) {
          fail('slow');
        }
      }
    }
  }

  function start() {
    if (raf || dead) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { rootMargin: '100px' });
  io.observe(journey);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);

  const onLost = (e) => {
    e.preventDefault();
    fail('context-lost');
  };
  canvas.addEventListener('webglcontextlost', onLost);

  function dispose() {
    dead = true;
    stop();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('resize', onResize);
    canvas.removeEventListener('webglcontextlost', onLost);
    destroyChoreography();
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      if (o.material && !Array.isArray(o.material)) o.material.dispose();
    });
    disposeShared();
    renderer.dispose();
    labelLayer.remove();
    stage.classList.remove('is-ready');
    document.documentElement.classList.remove('has-3d');
  }

  start();
  return { dispose, S };
}
