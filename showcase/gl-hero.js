/* gl-hero.js — Three.js custom-shader aurora hero (showcase only)
   Fallback: if WebGL is unavailable, the CSS aurora of the main site still shows through
   (the .hero background is inherited) — nothing breaks. */
import * as THREE from './vendor/three.module.min.js';

(function () {
  const host = document.getElementById('gl');
  if (!host) { console.warn('gl-hero: #gl host missing'); return; }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
  } catch (e) { console.warn('gl-hero: WebGL unavailable', e); host.remove(); return; }
  renderer.setPixelRatio(Math.min(1.6, window.devicePixelRatio || 1));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uAccent: { value: new THREE.Color('#3d8bff') },
    uAccent2: { value: new THREE.Color('#3fd6a4') },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uRes;
      uniform vec3 uAccent;
      uniform vec3 uAccent2;

      // cheap 2D value noise
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(in vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) { v += a*noise(p); p = p*2.03 + 17.3; a *= 0.5; }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        // aspect corrected
        vec2 p = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

        float t = uTime * 0.055;
        float drift = uScroll * 0.8;

        // two moving fbm fields, one per accent color
        float n1 = fbm(p*1.8 + vec2(t*1.1 + drift, -t*0.7));
        float n2 = fbm(p*2.4 - vec2(t*0.6, t*0.9 - drift*0.6));

        float glow1 = smoothstep(0.42, 0.85, n1);
        float glow2 = smoothstep(0.48, 0.92, n2);

        // ridges: contour-like bands from the noise, subtle
        float bands = abs(fract(n1*4.0 + t*0.35) - 0.5);
        float ridge = smoothstep(0.06, 0.0, bands) * 0.16;

        // vignette so text stays readable
        float vig = smoothstep(1.25, 0.35, length((uv - vec2(0.5,0.42)) * vec2(1.15, 1.35)));

        vec3 col = vec3(0.020, 0.027, 0.047);           // deep base (#05070c-ish)
        col += uAccent  * glow1 * 0.42;
        col += uAccent2 * glow2 * 0.30;
        col += (uAccent + uAccent2) * ridge;

        // tiny grain to kill banding
        float grain = (hash(uv * 1234.5 + fract(uTime)) - 0.5) * 0.028;
        col += grain;

        col *= vig;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthTest: false, depthWrite: false,
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const w = host.clientWidth || window.innerWidth, h = host.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Headless / blocked-GPU guard: if the context is lost right away, remove the host
  // so the CSS aurora shows instead (page must never look broken).
  renderer.domElement.addEventListener('webglcontextlost', function () { host.remove(); });

  // Scroll-reactive: as you scroll past the hero, the field drifts and dims
  let scroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const vh = window.innerHeight || 1;
    scroll = Math.min(1.6, y / vh);
    uniforms.uScroll.value = scroll;
  }, { passive: true });

  // Pause rendering once the hero is fully off-screen (battery/CPU save)
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(host);

  const clock = new THREE.Clock();
  function tick() {
    if (visible) {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) tick();
})();
