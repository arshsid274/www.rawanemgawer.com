"use client";

/**
 * MagicCarousel — WebGL2 particle-scatter portfolio carousel.
 *
 * Ported from magic_crousal.html: identical state machine, per-slide phase
 * damping, parallax mapping, and shader pipeline, with REA projects as the
 * data source. CSS lives in MagicCarousel.module.css.
 *
 * Behaviour:
 *   • Scroll within the section advances through the slides.
 *   • Each slide has its own gaussian-weighted "phase" that crossfades
 *     against neighbours via the particle scatter shader.
 *   • If WebGL2 isn't available, the component falls back to the plain
 *     `<img>` crossfade behind the canvas.
 */

import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/content";
import styles from "./MagicCarousel.module.css";

// ── Data shape ────────────────────────────────────────────────────────────
interface Slide {
  name: string;
  status: string;
  caption: string;
  usage: string;
  object: string;
  src: string;
}

const SLIDES: Slide[] = PROJECTS.map((p) => ({
  name: p.title,
  status: p.category,
  caption: p.blurb,
  usage: p.location,
  object: p.year,
  src: p.image,
}));

// Per-slide character drift positions (the in/out skew direction for each
// place-name animation). Deterministic, mirrors original variety.
const DRIFT: Array<{ dx: number; dy: number }> = [
  { dx: 0, dy: 1 },
  { dx: -1, dy: -0.25 },
  { dx: 0, dy: 1 },
  { dx: -0.75, dy: 0.5 },
  { dx: 1, dy: -0.25 },
  { dx: 0, dy: -0.75 },
  { dx: 1, dy: 1 },
  { dx: -0.5, dy: -0.5 },
];

// Tuning constants from the original ImageCircleScatter reference.
const ORIGINAL = {
  sigma: 0.16,
  parallaxScale: 1.2,
  parallaxStrength: 0.12,
  randomness: 1.9,
  scatterDistance: 13.0,
  particleBaseScale: 1.4142,
  maxParticleScale: 50.0,
  hoverSpeed: 0.5,
  hoverAmplitude: 0.5,
  affectRatio: 1.0,
  riseMs: 85,
  fallMs: 420,
  scrollLerpHz: 9.0,
  maxActiveLayers: 4,
  // Fraction of the scroll window between two slide anchors that is used
  // for the scatter transition. The remaining 90% holds the active photo
  // fully assembled. Window is centred on the midpoint between anchors.
  scatterFraction: 0.1,
};

// ── Shaders ───────────────────────────────────────────────────────────────
const VSHADER = `#version 300 es
precision highp float;
precision mediump int;
layout(location = 0) in vec2 a_corner;
uniform vec2  u_grid;
uniform float u_phase;
uniform vec2  u_resolution;
uniform float u_randomness;
uniform float u_scatterDistance;
uniform float u_particleBaseScale;
uniform vec2  u_coverScale;
uniform float u_parallaxOffset;
uniform float u_parallaxStrength;
uniform float u_parallaxScale;
uniform float u_hoverSpeed;
uniform float u_hoverAmplitude;
uniform float u_affectRatio;
uniform float u_time;
out vec2 v_local;
out vec2 v_sampleUV;
out float v_scale;
float hash2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float rayExitDistance(vec2 posClip, vec2 dirClip) {
  float big = 1e6;
  float tx = big, ty = big;
  if (abs(dirClip.x) > 0.00001) {
    float bx = dirClip.x > 0.0 ? 1.16 : -1.16;
    tx = (bx - posClip.x) / dirClip.x;
    if (tx < 0.0) tx = big;
  }
  if (abs(dirClip.y) > 0.00001) {
    float by = dirClip.y > 0.0 ? 1.16 : -1.16;
    ty = (by - posClip.y) / dirClip.y;
    if (ty < 0.0) ty = big;
  }
  if (tx == big && ty == big) return 0.0;
  if (tx == big) return ty;
  if (ty == big) return tx;
  return min(tx, ty);
}
void main() {
  float cols = u_grid.x;
  float rows = u_grid.y;
  int instanceID = gl_InstanceID;
  float cellX = float(instanceID % int(cols));
  float cellY = float(instanceID / int(cols));
  vec2 cell = vec2(cellX, cellY);
  vec2 clipSpaceSize = vec2(2.0) / u_grid;
  vec2 cellCenterClip = (cell / u_grid) * 2.0 - 1.0 + (clipSpaceSize * 0.5);
  cellCenterClip.y *= -1.0;
  float rowForUV = rows - 1.0 - cellY;
  vec2 sampleUV = (vec2(cellX, rowForUV) + 0.5) / u_grid;

  float p = clamp(u_phase, 0.0, 1.0);
  p = smoothstep(0.0, 1.0, p);
  float affectRatio = clamp(u_affectRatio, 0.0, 1.0);
  float affectMask = step(hash2(cell + vec2(31.7, 79.3)), affectRatio);
  p *= affectMask;

  float randomAmp = clamp(u_randomness, 0.0, 3.0);
  vec2 microJitter = vec2(hash2(cell + vec2(1.3, 5.7)) - 0.5, hash2(cell + vec2(8.9, 2.1)) - 0.5);
  vec2 clipJitter = microJitter * clipSpaceSize * randomAmp * mix(0.01, 0.75, p);

  vec2 hover = vec2(
    sin(u_time * u_hoverSpeed + hash2(cell + vec2(11.1, 3.7)) * 6.28),
    cos(u_time * u_hoverSpeed * 0.8 + hash2(cell + vec2(22.2, 9.1)) * 6.28)
  );
  vec2 hoverOffset = hover * clipSpaceSize * u_hoverAmplitude * p;
  cellCenterClip += clipJitter + hoverOffset;

  float ps = max(1.0, u_parallaxScale);
  vec2 uv = (sampleUV - 0.5) / ps + 0.5;
  uv = (uv - 0.5) * u_coverScale + 0.5;
  uv += vec2(0.0, -u_parallaxOffset * u_parallaxStrength);
  v_sampleUV = uv;

  vec2 offset = vec2(0.0);
  float randomAngle = hash2(cell * vec2(1.11, 3.73) + vec2(19.17, 4.11)) * 6.2831853;
  float screenAspect = u_resolution.x / u_resolution.y;

  vec2 radialDir = length(cellCenterClip) > 0.0001
    ? normalize(cellCenterClip)
    : vec2(cos(randomAngle), sin(randomAngle));
  vec2 dir = normalize(mix(vec2(cos(randomAngle), sin(randomAngle)), radialDir, 0.65));
  float chaos = clamp(randomAmp / 1.2, 0.0, 2.2);
  float angJ = (hash2(cell + vec2(47.7, 9.3)) - 0.5) * (1.2 * chaos);
  angJ += (hash2(cell * vec2(2.13, 0.97) + vec2(5.1, 13.3)) - 0.5) * (0.55 * chaos);
  float ca = cos(angJ);
  float sa = sin(angJ);
  mat2 rot = mat2(ca, -sa, sa, ca);
  vec2 dir2 = normalize(rot * dir);

  float scatterSpeed = mix(0.76, 1.36, hash2(cell + vec2(9.13, 2.71)));
  float scatterP = smoothstep(0.0, 1.0, pow(p, scatterSpeed));
  vec2 dirClip = vec2(dir2.x, dir2.y * screenAspect);
  float exitDist = rayExitDistance(cellCenterClip, dirClip);
  float distMul = mix(1.5, 2.5, hash2(cell + vec2(5.31, 7.77)));
  float overshoot = mix(0.1, 0.5, hash2(cell + vec2(2.03, 0.33)));
  overshoot += clamp(u_scatterDistance, 0.5, 80.0) * 0.08;
  float scatterDist = (exitDist + overshoot) * distMul;
  vec2 jitter = vec2(
    hash2(cell + vec2(1.00, 13.07)) - 0.5,
    hash2(cell + vec2(1.73, 17.91)) - 0.5
  );
  float jitterMul = mix(0.1, 1.15, hash2(cell + vec2(6.17, 4.49)));
  jitter *= jitterMul;
  vec2 ortho = vec2(-dir2.y, dir2.x);
  float wanderAmp = exitDist * mix(0.02, 0.22, hash2(cell + vec2(3.37, 8.33)));
  float wanderSign = hash2(cell + vec2(1.41, 5.55)) > 0.5 ? 1.0 : -1.0;
  float wanderT = scatterP * (1.0 - scatterP) * 4.0;
  vec2 wander = ortho * wanderAmp * wanderSign * wanderT * scatterP;
  offset = (dir2 * scatterDist + jitter) * scatterP + wander;

  vec2 offsetClip = vec2(offset.x, offset.y * screenAspect);
  float travelDist = length(offset);
  float scale = 1.0 + travelDist * 0.15;
  if (scale < 0.0) scale = 0.0;
  v_scale = scale;

  float finalScale = u_particleBaseScale * scale;
  vec2 rotatedCorner = a_corner;
  float zDepth = 0.9 - clamp(travelDist * 1.5, 0.0, 1.0);

  gl_Position = vec4(cellCenterClip + offsetClip + (rotatedCorner * clipSpaceSize * 0.5 * finalScale), zDepth, 1.0);
  v_local = rotatedCorner;
}`;

const FSHADER = `#version 300 es
precision highp float;
precision mediump int;
uniform sampler2D u_tex;
uniform vec2  u_grid;
uniform float u_maxParticleScale;
uniform float u_particleBaseScale;
uniform vec2  u_coverScale;
uniform float u_parallaxScale;
in vec2  v_local;
in vec2  v_sampleUV;
in float v_scale;
out vec4 outColor;
void main() {
  if (v_scale > u_maxParticleScale) discard;
  if (v_scale < 0.001) discard;
  float ps = max(1.0, u_parallaxScale);
  float uvScale = (u_particleBaseScale * max(v_scale, 0.0)) / ps;
  vec2 uvOffset = v_local * (0.5 / u_grid) * uvScale * u_coverScale;
  vec2 uv = v_sampleUV + uvOffset;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
  vec4 texColor = texture(u_tex, uv);
  if (texColor.a < 0.05) discard;
  outColor = texColor;
}`;

// ── Component ─────────────────────────────────────────────────────────────
export function MagicCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const scatterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scatter = scatterRef.current;
    const canvas = canvasRef.current;
    if (!section || !scatter || !canvas) return;

    // ── 1) DOM refs via the section root ────────────────────────────────
    const dots = Array.from(section.querySelectorAll<HTMLElement>(`.${styles.path} .${styles.i}`));
    const places = Array.from(section.querySelectorAll<HTMLElement>(`.${styles.place}`));
    const lineEl = section.querySelector<HTMLElement>(`.${styles.path} .${styles.line}`);
    const statusEl = section.querySelector<HTMLElement>(`.${styles.status}`);
    const captionEl = section.querySelector<HTMLElement>(`.${styles.caption}`);
    const usageEl = section.querySelector<HTMLElement>(`.${styles.usage}`);
    const objectEl = section.querySelector<HTMLElement>(`.${styles.object}`);
    const bgImgs = Array.from(scatter.querySelectorAll<HTMLImageElement>(`.${styles.bgImg}`));

    if (!lineEl || !statusEl || !captionEl || !usageEl || !objectEl) return;

    // Split place-name labels into per-char spans with deterministic-ish delay.
    places.forEach((el) => {
      const text = el.getAttribute("data-text") ?? "";
      el.innerHTML = "";
      text.split("").forEach((c) => {
        const span = document.createElement("span");
        span.className = styles.ch ?? "ch";
        span.style.setProperty("--char-random", String(Math.random() * 10));
        span.textContent = c === " " ? " " : c;
        el.appendChild(span);
      });
    });

    let currentIndex = 0;
    const infoTimers: ReturnType<typeof setTimeout>[] = [];
    const infoEls: Array<{ el: HTMLElement; key: keyof Slide }> = [
      { el: statusEl, key: "status" },
      { el: captionEl, key: "caption" },
      { el: usageEl, key: "usage" },
      { el: objectEl, key: "object" },
    ];

    const setInfo = (idx: number) => {
      const data = SLIDES[idx];
      if (!data) return;
      // cancel any in-flight info transitions
      while (infoTimers.length) {
        const t = infoTimers.pop();
        if (t !== undefined) clearTimeout(t);
      }
      infoEls.forEach(({ el, key }, i) => {
        el.classList.add(styles.leaving);
        const t = setTimeout(() => {
          el.textContent = data[key];
          el.classList.remove(styles.leaving);
          el.classList.add(styles.entering);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => el.classList.remove(styles.entering));
          });
        }, 200 + i * 80);
        infoTimers.push(t);
      });
    };

    const setActiveDom = (idx: number) => {
      if (idx === currentIndex) return;
      currentIndex = idx;
      dots.forEach((d, i) => d.classList.toggle(styles.active, i === idx));
      places.forEach((p, i) => p.classList.toggle(styles.active, i === idx));
      bgImgs.forEach((b, i) => b.classList.toggle(styles.active, i === idx));
      setInfo(idx);
    };

    // ── 2) Per-slide state machine driver ───────────────────────────────
    const N = SLIDES.length;
    const windowFrac = 1 / Math.max(1, N - 1);

    const slideState = SLIDES.map((_, k) => ({
      anchor: N > 1 ? k / (N - 1) : 0,
      phase: 1,
      weight: 0,
      parallax: 0,
    }));
    slideState[0].phase = 0;

    const driver = {
      targetProgress: 0,
      displayedProgress: 0,
      index: 0,
      layers: [] as Array<{ index: number; phase: number; weight: number; parallax: number }>,
    };

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

    const syncFromScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      let scrolled = -rect.top;
      if (scrolled < 0) scrolled = 0;
      if (scrolled > total) scrolled = total;
      driver.targetProgress = total > 0 ? scrolled / total : 0;
    };
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    syncFromScroll();
    driver.displayedProgress = driver.targetProgress;

    let lastTickTime = 0;
    let stateRaf = 0;
    const tick = (now: number) => {
      stateRaf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, lastTickTime ? (now - lastTickTime) / 1000 : 0.016);
      lastTickTime = now;

      const kScroll = 1 - Math.exp(-ORIGINAL.scrollLerpHz * dt);
      driver.displayedProgress += (driver.targetProgress - driver.displayedProgress) * kScroll;

      const U = driver.displayedProgress;
      const W = windowFrac;
      const sigma = ORIGINAL.sigma;

      // 10% scatter window centred on the midpoint between adjacent
      // anchors: phase = 0 (assembled) when |d|/W < 0.45, ramps 0→1 from
      // 0.45→0.55, phase = 1 (scattered) when |d|/W > 0.55.
      const halfWin = ORIGINAL.scatterFraction / 2;
      const winStart = 0.5 - halfWin;
      const winLen = ORIGINAL.scatterFraction;

      let bestWeight = -1;
      let bestIdx = driver.index;
      for (let k = 0; k < slideState.length; k++) {
        const s = slideState[k];
        const d = U - s.anchor;
        const ad = Math.abs(d);
        const adNorm = clamp01(ad / W);
        const targetPhase = easeInOutCubic(clamp01((adNorm - winStart) / winLen));
        const tau = targetPhase > s.phase ? ORIGINAL.riseMs : ORIGINAL.fallMs;
        const kPh = 1 - Math.exp(-(dt * 1000) / tau);
        s.phase += (targetPhase - s.phase) * kPh;
        s.phase = clamp01(s.phase);
        s.weight = Math.exp(-(d * d) / (2 * sigma * sigma)) * (1 - s.phase);
        s.parallax = Math.max(-1.2, Math.min(1.2, d / W));
        if (s.weight > bestWeight) {
          bestWeight = s.weight;
          bestIdx = k;
        }
      }

      driver.layers = slideState
        .map((s, k) => ({ index: k, phase: s.phase, weight: s.weight, parallax: s.parallax }))
        .filter((L) => L.weight > 0.01 || L.phase < 0.95)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, ORIGINAL.maxActiveLayers)
        .sort((a, b) => b.phase - a.phase);

      if (bestIdx !== driver.index) {
        driver.index = bestIdx;
        setActiveDom(driver.index);
      }

      const smart = Math.max(0, (driver.displayedProgress - 1 / 8)) / (1 - 1 / 8);
      lineEl.style.setProperty("--smart-progress", smart.toFixed(4));
    };
    stateRaf = requestAnimationFrame(tick);

    // ── 3) WebGL2 particle scatter ──────────────────────────────────────
    type GLResources = {
      gl: WebGL2RenderingContext;
      program: WebGLProgram;
      vs: WebGLShader;
      fs: WebGLShader;
      vao: WebGLVertexArrayObject;
      cornerBuf: WebGLBuffer;
      textures: Array<WebGLTexture | null>;
      U: Record<string, WebGLUniformLocation | null>;
    };
    let glRes: GLResources | null = null;
    let glRaf = 0;

    const fail = (msg: string) => {
      // eslint-disable-next-line no-console
      console.warn("[MagicCarousel]", msg);
      scatter.classList.add(styles.glFailed);
    };

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: true,
      alpha: true,
    });
    if (!gl) {
      fail("WebGL2 not available — falling back to plain image crossfade.");
    } else {
      const compile = (type: number, source: string, label: string) => {
        const sh = gl.createShader(type);
        if (!sh) return null;
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
          // eslint-disable-next-line no-console
          console.error(`[MagicCarousel] ${label} compile error:\n${gl.getShaderInfoLog(sh)}`);
          gl.deleteShader(sh);
          return null;
        }
        return sh;
      };
      const vs = compile(gl.VERTEX_SHADER, VSHADER, "VS");
      const fs = compile(gl.FRAGMENT_SHADER, FSHADER, "FS");
      if (!vs || !fs) {
        fail("shader compile failed");
      } else {
        const program = gl.createProgram();
        if (!program) {
          fail("createProgram failed");
        } else {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.bindAttribLocation(program, 0, "a_corner");
          gl.linkProgram(program);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            // eslint-disable-next-line no-console
            console.error(`[MagicCarousel] link error:\n${gl.getProgramInfoLog(program)}`);
            fail("program link failed");
          } else {
            gl.useProgram(program);

            const U: Record<string, WebGLUniformLocation | null> = {};
            [
              "u_grid",
              "u_phase",
              "u_resolution",
              "u_randomness",
              "u_scatterDistance",
              "u_particleBaseScale",
              "u_coverScale",
              "u_parallaxOffset",
              "u_parallaxStrength",
              "u_parallaxScale",
              "u_hoverSpeed",
              "u_hoverAmplitude",
              "u_affectRatio",
              "u_time",
              "u_tex",
              "u_maxParticleScale",
            ].forEach((n) => {
              U[n] = gl.getUniformLocation(program, n);
            });

            const vao = gl.createVertexArray();
            if (!vao) {
              fail("VAO alloc failed");
            } else {
              gl.bindVertexArray(vao);
              const cornerBuf = gl.createBuffer();
              if (!cornerBuf) {
                fail("VBO alloc failed");
              } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuf);
                gl.bufferData(
                  gl.ARRAY_BUFFER,
                  new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
                  gl.STATIC_DRAW,
                );
                gl.enableVertexAttribArray(0);
                gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                gl.clearColor(245 / 255, 241 / 255, 234 / 255, 1.0);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

                const textures: Array<WebGLTexture | null> = new Array(SLIDES.length).fill(null);
                const imgMeta: Array<{ w: number; h: number } | null> = new Array(SLIDES.length).fill(null);

                const makeTex = (image: HTMLImageElement): WebGLTexture | null => {
                  const tex = gl.createTexture();
                  if (!tex) return null;
                  gl.bindTexture(gl.TEXTURE_2D, tex);
                  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                  gl.generateMipmap(gl.TEXTURE_2D);
                  return tex;
                };

                const loadImage = (i: number) =>
                  new Promise<void>((resolve) => {
                    const domImg = bgImgs[i];
                    if (!domImg) {
                      resolve();
                      return;
                    }
                    const upload = () => {
                      try {
                        if (!domImg.naturalWidth) {
                          resolve();
                          return;
                        }
                        textures[i] = makeTex(domImg);
                        imgMeta[i] = { w: domImg.naturalWidth, h: domImg.naturalHeight };
                      } catch (e) {
                        // eslint-disable-next-line no-console
                        console.warn("[MagicCarousel] texture upload failed for", SLIDES[i].src, e);
                      }
                      resolve();
                    };
                    if (domImg.complete && domImg.naturalWidth) {
                      upload();
                    } else {
                      domImg.addEventListener("load", upload, { once: true });
                      domImg.addEventListener(
                        "error",
                        () => {
                          // eslint-disable-next-line no-console
                          console.warn("[MagicCarousel] img failed:", SLIDES[i].src);
                          resolve();
                        },
                        { once: true },
                      );
                    }
                  });

                let gridCols = 1;
                let gridRows = 1;
                let instanceCount = 1;
                let cssW = 0;
                let cssH = 0;
                let dpr = 1;

                const recomputeGrid = () => {
                  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
                  const target = isMobile ? 50000 : 220000;
                  const aspect = cssW / cssH;
                  const rows = Math.max(60, Math.round(Math.sqrt(target / aspect)));
                  const cols = Math.max(60, Math.round(rows * aspect));
                  gridCols = cols;
                  gridRows = rows;
                  instanceCount = cols * rows;
                };

                const resize = () => {
                  const rect = canvas.getBoundingClientRect();
                  cssW = Math.max(1, rect.width);
                  cssH = Math.max(1, rect.height);
                  dpr = Math.min(window.devicePixelRatio || 1, 2);
                  canvas.width = Math.floor(cssW * dpr);
                  canvas.height = Math.floor(cssH * dpr);
                  gl.viewport(0, 0, canvas.width, canvas.height);
                  recomputeGrid();
                };
                resize();
                window.addEventListener("resize", resize);

                const tStart = performance.now();
                const frame = () => {
                  glRaf = requestAnimationFrame(frame);
                  gl.clear(gl.COLOR_BUFFER_BIT);
                  const layers = driver.layers;
                  if (!layers || !layers.length) return;

                  gl.bindVertexArray(vao);
                  gl.useProgram(program);
                  const canvasA = cssW / cssH;
                  const t = (performance.now() - tStart) * 0.001;

                  gl.uniform2f(U.u_grid!, gridCols, gridRows);
                  gl.uniform2f(U.u_resolution!, canvas.width, canvas.height);
                  gl.uniform1f(U.u_randomness!, ORIGINAL.randomness);
                  gl.uniform1f(U.u_scatterDistance!, ORIGINAL.scatterDistance);
                  gl.uniform1f(U.u_particleBaseScale!, ORIGINAL.particleBaseScale);
                  gl.uniform1f(U.u_maxParticleScale!, ORIGINAL.maxParticleScale);
                  gl.uniform1f(U.u_parallaxStrength!, ORIGINAL.parallaxStrength);
                  gl.uniform1f(U.u_parallaxScale!, ORIGINAL.parallaxScale);
                  gl.uniform1f(U.u_hoverSpeed!, ORIGINAL.hoverSpeed);
                  gl.uniform1f(U.u_hoverAmplitude!, ORIGINAL.hoverAmplitude);
                  gl.uniform1f(U.u_affectRatio!, ORIGINAL.affectRatio);
                  gl.uniform1f(U.u_time!, t);

                  for (const L of layers) {
                    const tex = textures[L.index];
                    if (!tex) continue;
                    const meta = imgMeta[L.index] ?? { w: 1920, h: 1080 };
                    const imageA = meta.w / meta.h;
                    const coverX = canvasA < imageA ? canvasA / imageA : 1;
                    const coverY = imageA < canvasA ? imageA / canvasA : 1;
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.uniform1i(U.u_tex!, 0);
                    gl.uniform2f(U.u_coverScale!, coverX, coverY);
                    gl.uniform1f(U.u_phase!, L.phase);
                    gl.uniform1f(U.u_parallaxOffset!, L.parallax);
                    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, instanceCount);
                  }
                };

                // eslint-disable-next-line no-console
                console.log(`[MagicCarousel] WebGL2 init — loading ${SLIDES.length} textures`);
                Promise.all(SLIDES.map((_, i) => loadImage(i))).then(() => {
                  const ok = textures.filter(Boolean).length;
                  // eslint-disable-next-line no-console
                  console.log(`[MagicCarousel] ${ok}/${SLIDES.length} textures ready`);
                  if (ok === 0) {
                    fail("no textures loaded — keeping <img> fallback visible");
                    return;
                  }
                  resize();
                  syncFromScroll();
                  glRaf = requestAnimationFrame(frame);
                });

                glRes = { gl, program, vs, fs, vao, cornerBuf, textures, U };
                // resize listener for glRes cleanup below relies on closure.
                const resizeForCleanup = resize;
                // Hold onto the resize listener so cleanup can detach it.
                (glRes as unknown as { resize: () => void }).resize = resizeForCleanup;
              }
            }
          }
        }
      }
    }

    // ── 4) Cleanup ──────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
      if (stateRaf) cancelAnimationFrame(stateRaf);
      if (glRaf) cancelAnimationFrame(glRaf);
      while (infoTimers.length) {
        const t = infoTimers.pop();
        if (t !== undefined) clearTimeout(t);
      }
      if (glRes) {
        const { gl: g, program, vs, fs, vao, cornerBuf, textures } = glRes;
        const r = (glRes as unknown as { resize?: () => void }).resize;
        if (r) window.removeEventListener("resize", r);
        textures.forEach((t) => t && g.deleteTexture(t));
        g.deleteBuffer(cornerBuf);
        g.deleteVertexArray(vao);
        g.deleteProgram(program);
        g.deleteShader(vs);
        g.deleteShader(fs);
        g.bindBuffer(g.ARRAY_BUFFER, null);
        g.bindVertexArray(null);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="magic-carousel" className={styles.cParticles} aria-label="Selected projects">
      <div className={styles.stick}>
        <div ref={scatterRef} className={styles.scatterContainer}>
          {SLIDES.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.src}
              className={`${styles.bgImg} ${i === 0 ? styles.active : ""}`}
              data-i={i}
              src={slide.src}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
          <canvas ref={canvasRef} className={styles.webglCanvas} />
        </div>

        <div className={styles.path}>
          <span className={styles.line} />
          {SLIDES.map((slide, i) => (
            <div key={i} className={`${styles.i} ${i === 0 ? styles.active : ""}`} data-i={i}>
              <span>{i + 1}</span>
              <span className={styles.iLabel}>{slide.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.contentWrap}>
          <span className={styles.placeName}>
            {SLIDES.map((slide, i) => {
              const drift = DRIFT[i] ?? { dx: 0, dy: 1 };
              return (
                <span
                  key={slide.src}
                  className={`${styles.place} ${i === 0 ? styles.active : ""}`}
                  data-i={i}
                  data-text={slide.name}
                  style={{
                    ["--dx" as string]: drift.dx,
                    ["--dy" as string]: drift.dy,
                  } as React.CSSProperties}
                />
              );
            })}
          </span>
          <span className={`${styles.info} ${styles.status}`}>{SLIDES[0].status}</span>
          <span className={`${styles.info} ${styles.caption}`}>{SLIDES[0].caption}</span>
          <span className={`${styles.info} ${styles.usage}`}>{SLIDES[0].usage}</span>
          <span className={`${styles.info} ${styles.object}`}>{SLIDES[0].object}</span>
        </div>
      </div>
    </section>
  );
}
