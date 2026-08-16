<script lang="ts">
  // Blackhole.svelte — Svelte port of Blackhole.js (React -> Svelte migration)
  // 2D Canvas accretion disk with Z-depth sorted particle trails.
  // Does NOT initialize at all on screens <= 430px.
  // React hooks stripped; logic ported to onMount/onDestroy.

  import { onMount, onDestroy } from "svelte";

  // Props adapted from Blackhole.js defaults — colors shifted to portfolio accent
  export let showCenter: boolean = true;
  export let voidRadius: number = 40;
  export let voidX: number = 50;
  export let voidY: number = 50;
  export let particleCount: number = 600;
  export let particleSize: number = 10;
  export let colors: string[] = ["#FF192D", "#FF192D", "#FF192D", "#FF192D"];
  export let outerRadius: number = 100;
  export let tilt: number = 20;
  export let tiltSideway: number = 160;
  export let trail: number = 50;
  export let orbitSpeed: number = 5;
  export let pullSpeed: number = 1;

  let containerEl: HTMLDivElement;
  let bgCanvas: HTMLCanvasElement;
  let fgCanvas: HTMLCanvasElement;
  let animRef: number = 0;
  let initialized = false;

  type Particle = {
    angle: number;
    radius: number;
    height: number;
    speedOffset: number;
    colorIdx: number;
  };

  onMount(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 430) return;
    initBlackhole();
  });

  onDestroy(() => {
    if (
      typeof window !== "undefined" &&
      typeof cancelAnimationFrame !== "undefined"
    ) {
      cancelAnimationFrame(animRef);
    }
  });

  function initBlackhole() {
    if (initialized) return;
    initialized = true;

    // Canvas sizing via ResizeObserver
    const sizeRef = { w: 600, h: 600 };
    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const { width, height } = containerEl.getBoundingClientRect();
      const d = dpr();
      bgCanvas.width = width * d;
      bgCanvas.height = height * d;
      bgCanvas.style.width = `${width}px`;
      bgCanvas.style.height = `${height}px`;
      fgCanvas.width = width * d;
      fgCanvas.height = height * d;
      fgCanvas.style.width = `${width}px`;
      fgCanvas.style.height = `${height}px`;
      sizeRef.w = width;
      sizeRef.h = height;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(containerEl);
    resize();

    // Effective render values (ported from Blackhole.js)
    const PERSPECTIVE = 1300;
    const pSize =
      0.5 + (Math.max(1, Math.min(50, particleSize)) - 1) * (4 / 49);
    const pSpeed = Math.max(0, pullSpeed) / 2;
    const trailAlpha = Math.max(0.02, 1 - (Math.max(0, trail) / 50) * 0.98);

    // Particle init
    const outerRadFromSize = (w: number) => {
      const maxR = w / 2;
      const pct = Math.max(0, Math.min(100, outerRadius)) / 100;
      return voidRadius + pct * (maxR - voidRadius);
    };

    const pts: Particle[] = [];
    const initPts = (w: number) => {
      pts.length = 0;
      const outerR = outerRadFromSize(w);
      for (let i = 0; i < particleCount; i++) {
        const r =
          voidRadius + Math.pow(Math.random(), 2) * (outerR - voidRadius);
        pts.push({
          angle: Math.random() * Math.PI * 2,
          radius: r,
          height: (Math.random() - 0.5) * 16,
          speedOffset: 0.75 + Math.random() * 0.5,
          colorIdx: Math.floor(Math.random() * colors.length),
        });
      }
    };
    initPts(sizeRef.w);

    const ctx = bgCanvas.getContext("2d")!;
    const fgCtx = fgCanvas.getContext("2d")!;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;
      const { w, h } = sizeRef;
      const d = dpr();
      ctx.setTransform(d, 0, 0, d, 0, 0);
      fgCtx.setTransform(d, 0, 0, d, 0, 0);
      ctx.globalAlpha = 1;
      fgCtx.globalAlpha = 1;

      // Trail fade
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${trailAlpha})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      fgCtx.globalCompositeOperation = "destination-out";
      fgCtx.fillStyle = `rgba(0,0,0,${trailAlpha})`;
      fgCtx.fillRect(0, 0, w, h);
      fgCtx.globalCompositeOperation = "source-over";

      const outerR = outerRadFromSize(w);
      const voidCx = (voidX / 100) * w,
        voidCy = (voidY / 100) * h;
      const tiltRad = (tilt * Math.PI) / 180,
        tiltSwayRad = (tiltSideway * Math.PI) / 180;

      type PPt = {
        x: number;
        y: number;
        size: number;
        alpha: number;
        z: number;
        color: string;
      };
      const bg: PPt[] = [],
        fg: PPt[] = [];

      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];
        const spd = Math.sqrt(voidRadius / Math.max(pt.radius, 10));
        const lorb = orbitSpeed * spd * pt.speedOffset;
        const lpull = pSpeed * spd * pt.speedOffset;
        pt.angle += lorb * 0.012 * dt;
        pt.radius -= lpull * dt;
        if (pt.radius < voidRadius) {
          pt.radius =
            voidRadius +
            0.7 * (outerR - voidRadius) +
            Math.random() * 0.3 * (outerR - voidRadius);
          pt.angle = Math.random() * Math.PI * 2;
          pt.height = (Math.random() - 0.5) * 16;
          continue;
        }
        const cosA = Math.cos(pt.angle),
          sinA = Math.sin(pt.angle);
        const xb = pt.radius * cosA,
          yb = pt.height,
          zb = pt.radius * sinA;
        const x1 = xb,
          y1 = yb * Math.cos(tiltRad) + zb * Math.sin(tiltRad),
          z1 = -yb * Math.sin(tiltRad) + zb * Math.cos(tiltRad);
        const x3d = x1 * Math.cos(tiltSwayRad) - y1 * Math.sin(tiltSwayRad);
        const y3d = x1 * Math.sin(tiltSwayRad) + y1 * Math.cos(tiltSwayRad);
        const z3d = z1;
        const sca = PERSPECTIVE / (PERSPECTIVE + z3d);
        const px = voidCx + x3d * sca,
          py = voidCy + y3d * sca;
        if (px < -30 || px > w + 30 || py < -30 || py > h + 30) continue;
        const size = Math.max(0.3, pSize * sca);
        const alpha = Math.max(
          0.35,
          1 - ((z3d + outerR) / (2 * outerR)) * 0.45,
        );
        const color = colors[pt.colorIdx % colors.length];
        if (z3d >= 0) bg.push({ x: px, y: py, size, alpha, z: z3d, color });
        else fg.push({ x: px, y: py, size, alpha, z: z3d, color });
      }

      bg.sort((a, b) => b.z - a.z);
      fg.sort((a, b) => b.z - a.z);

      for (const p of bg) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Event horizon center
      if (showCenter) {
        const sphereGrad = ctx.createRadialGradient(
          voidCx - voidRadius * 0.25,
          voidCy - voidRadius * 0.3,
          voidRadius * 0.05,
          voidCx,
          voidCy,
          voidRadius,
        );
        sphereGrad.addColorStop(0, "#020d19");
        sphereGrad.addColorStop(0.65, "#020d19");
        sphereGrad.addColorStop(0.92, "#020d19");
        sphereGrad.addColorStop(1, "#020d19");
        ctx.globalAlpha = 1;
        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(voidCx, voidCy, voidRadius, 0, Math.PI * 2);
        ctx.fill();
        // Rim glow in portfolio red
        const rimGrad = ctx.createRadialGradient(
          voidCx,
          voidCy,
          voidRadius * 0.88,
          voidCx,
          voidCy,
          voidRadius * 1.12,
        );
        rimGrad.addColorStop(0, "#020d19");
        rimGrad.addColorStop(0.5, "#020d19");
        rimGrad.addColorStop(0.85, "#020d19");
        rimGrad.addColorStop(1, "#020d19");
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(voidCx, voidCy, voidRadius * 1.12, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of fg) {
        fgCtx.globalAlpha = p.alpha;
        fgCtx.fillStyle = p.color;
        fgCtx.beginPath();
        fgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fgCtx.fill();
      }
      fgCtx.globalAlpha = 1;

      animRef = requestAnimationFrame(draw);
    };

    animRef = requestAnimationFrame(draw);

    // Pause via IntersectionObserver
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          cancelAnimationFrame(animRef);
        } else {
          lastTime = performance.now();
          animRef = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 },
    );
    io.observe(containerEl);
  }
</script>

<div bind:this={containerEl} class="bh-container" aria-hidden="true">
  <canvas bind:this={bgCanvas} class="bh-canvas bh-bg"></canvas>
  <canvas bind:this={fgCanvas} class="bh-canvas bh-fg"></canvas>
</div>

<style>
  .bh-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
  .bh-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .bh-fg {
    pointer-events: none;
  }
</style>
