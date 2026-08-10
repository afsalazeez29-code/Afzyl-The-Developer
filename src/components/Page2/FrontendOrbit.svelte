<script lang="ts">
  // ═══════════════════════════════════════════════════════════════
  // FRONTEND TECHNOLOGIES — LOCKED
  // ═══════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────
  // CIRCLE 1 — 8 TECHNOLOGIES
  // 360 ÷ 8 = 45°
  // ─────────────────────────────────────────────────────────────
  const frontendCircle1 = [
    { name: "JavaScript", icon: "/color-icons/javascript-original.svg" },
    { name: "GSAP", icon: "/color-icons/gsap (1).svg" },
    { name: "TypeScript", icon: "/color-icons/typescript-original.svg" },
    { name: "Astro", icon: "/color-icons/astro-original.svg" },
    { name: "React", icon: "/color-icons/react-original.svg" },
    { name: "Next.js", icon: "/color-icons/nextjs-original.svg" },
    { name: "SCSS", icon: "/color-icons/sass-svgrepo-com.svg" },
    { name: "Three.js", icon: "/color-icons/threejs-original.svg" },
  ];

  // ─────────────────────────────────────────────────────────────
  // CIRCLE 2 — 10 TECHNOLOGIES
  // 360 ÷ 10 = 36°
  // ─────────────────────────────────────────────────────────────
  const frontendCircle2 = [
    { name: "HTML5", icon: "/color-icons/html5-original.svg" },
    { name: "CSS3", icon: "/color-icons/css3-original.svg" },
    { name: "Bootstrap", icon: "/color-icons/bootstrap-original.svg" },
    { name: "Tailwind CSS", icon: "/color-icons/tailwindcss-original.svg" },
    { name: "React Router", icon: "/color-icons/reactrouter-original.svg" },
    { name: "Framer", icon: "/color-icons/framermotion-original.svg" },
    { name: "Figma", icon: "/color-icons/figma-original.svg" },
    { name: "Python", icon: "/color-icons/python-original.svg" },
    { name: "Vite", icon: "/color-icons/Vite.js.svg" },
    { name: "Svelte", icon: "/color-icons/svelte-original.svg" },
  ];

  // ═══════════════════════════════════════════════════════════════
  // CIRCLE 1 POSITIONS
  // 8 nodes / 45° equal spacing
  // ═══════════════════════════════════════════════════════════════

  const frontendCircle1Positions = [
    { angle: 0, radius: 5 },
    { angle: 45, radius: 5 },
    { angle: 90, radius: 5 },
    { angle: 135, radius: 5 },
    { angle: 180, radius: 5 },
    { angle: 225, radius: 5 },
    { angle: 270, radius: 5 },
    { angle: 315, radius: 5 },
  ];

  // ═══════════════════════════════════════════════════════════════
  // CIRCLE 2 POSITIONS
  // 10 nodes / 36° equal spacing
  // ═══════════════════════════════════════════════════════════════

  const frontendCircle2Positions = [
    { angle: 0, radius: 9 },
    { angle: 36, radius: 9 },
    { angle: 72, radius: 9 },
    { angle: 108, radius: 9 },
    { angle: 144, radius: 9 },
    { angle: 180, radius: 9 },
    { angle: 216, radius: 9 },
    { angle: 252, radius: 9 },
    { angle: 288, radius: 9 },
    { angle: 324, radius: 9 },
  ];

  // ═══════════════════════════════════════════════════════════════
  // POSITION HELPERS
  // ═══════════════════════════════════════════════════════════════

  function circle1NodeStyle(i: number): string {
    const position = frontendCircle1Positions[i];

    return `
      --angle: ${position.angle}deg;
      --radius: ${position.radius}vw;
    `;
  }

  function circle2NodeStyle(i: number): string {
    const position = frontendCircle2Positions[i];

    return `
      --angle: ${position.angle}deg;
      --radius: ${position.radius}vw;
    `;
  }
</script>

<!-- ═══════════════════════════════════════════════════════════
     FRONTEND NODE
     Positioned by the parent OrbitalSystem
     ═══════════════════════════════════════════════════════════ -->

<div class="p2-node">
  <span class="p2-node-label">FRONTEND</span>
  <span class="p2-node-sub">React / UI</span>

  <!-- ═════════════════════════════════════════════════════════
       CIRCLE 1 — 8 TECHNOLOGIES
       ═════════════════════════════════════════════════════════ -->

  <div class="p2-suborbit p2-suborbit--frontend-circle1" aria-hidden="true">
    <div class="p2-suborbit-ring p2-suborbit-ring--frontend-circle1"></div>

    <div class="p2-suborbit-spinner p2-spinner--frontend-circle1">
      {#each frontendCircle1 as tech, i}
        <div
          class="p2-subnode"
          style={circle1NodeStyle(i)}
          title={tech.name}
          role="img"
          aria-label={tech.name}
          tabindex="0"
        >
          <div class="p2-subnode-counter">
            <img
              src={tech.icon}
              alt={tech.name}
              class="p2-subnode-icon"
              loading="lazy"
              draggable="false"
            />
          </div>

          <span class="p2-subnode-tooltip">
            {tech.name}
          </span>
        </div>
      {/each}
    </div>
  </div>

  <!-- ═════════════════════════════════════════════════════════
       CIRCLE 2 — 10 TECHNOLOGIES
       ═════════════════════════════════════════════════════════ -->

  <div class="p2-suborbit p2-suborbit--frontend-circle2" aria-hidden="true">
    <div class="p2-suborbit-ring p2-suborbit-ring--frontend-circle2"></div>

    <div class="p2-suborbit-spinner p2-spinner--frontend-circle2">
      {#each frontendCircle2 as tech, i}
        <div
          class="p2-subnode"
          style={circle2NodeStyle(i)}
          title={tech.name}
          role="img"
          aria-label={tech.name}
          tabindex="0"
        >
          <div class="p2-subnode-counter">
            <img
              src={tech.icon}
              alt={tech.name}
              class="p2-subnode-icon"
              loading="lazy"
              draggable="false"
            />
          </div>

          <span class="p2-subnode-tooltip">
            {tech.name}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════
     FRONTEND MAIN NODE
     ═══════════════════════════════════════════════════════════ */

  .p2-node {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 0.2rem;

    width: clamp(3.8rem, 6vw, 6rem);
    height: clamp(3.8rem, 6vw, 6rem);

    padding: 0.4rem;

    text-align: center;

    background: rgba(15, 3, 3, 0.85);

    border: 1px solid rgba(180, 40, 30, 0.5);

    border-radius: 50%;

    pointer-events: auto;

    z-index: 10;
  }

  /* ═══════════════════════════════════════════════════════════
     FRONTEND TEXT
     ═══════════════════════════════════════════════════════════ */

  .p2-node-label {
    font: 600 clamp(0.45rem, 0.65vw, 0.62rem) / 1 var(--sans);

    color: rgba(220, 80, 60, 0.95);

    text-transform: uppercase;

    letter-spacing: 0.07em;
  }

  .p2-node-sub {
    font: 400 clamp(0.4rem, 0.58vw, 0.55rem) / 1.3 var(--sans);

    color: rgba(255, 255, 255, 0.65);
  }

  /* ═══════════════════════════════════════════════════════════
     SHARED ORBIT CONTAINER
     ═══════════════════════════════════════════════════════════ */

  .p2-suborbit {
    position: absolute;

    top: 50%;
    left: 50%;

    width: 0;
    height: 0;

    pointer-events: none;
  }

  /* ═══════════════════════════════════════════════════════════
   FRONTEND SUB-ORBIT RINGS
   ═══════════════════════════════════════════════════════════ */

  .p2-suborbit-ring {
    position: absolute;

    top: 0;
    left: 0;

    border-radius: 50%;

    transform: translate(-50%, -50%);

    pointer-events: none;

    z-index: 0;

    box-sizing: border-box;
  }

  /* ═══════════════════════════════════════════════════════════
   CIRCLE 1
   8 TECHNOLOGIES
   Radius = 5vw
   Diameter = 10vw
   ═══════════════════════════════════════════════════════════ */

  .p2-suborbit-ring--frontend-circle1 {
    width: 10vw;
    height: 10vw;

    border: 1.5px solid rgba(200, 40, 30, 0.55);

    box-shadow: 0 0 18px rgba(200, 40, 30, 0.12);
  }

  /* ═══════════════════════════════════════════════════════════
   CIRCLE 2
   10 TECHNOLOGIES
   Radius = 9vw
   Diameter = 18vw
   ═══════════════════════════════════════════════════════════ */

  .p2-suborbit-ring--frontend-circle2 {
    width: 18vw;
    height: 18vw;

    border: 1.5px solid rgba(200, 40, 30, 0.55);

    box-shadow: 0 0 18px rgba(200, 40, 30, 0.12);
  }

  /* ═══════════════════════════════════════════════════════════
     ANIMATIONS — ROTATION & UPRIGHT COUNTER-ROTATION
     ═══════════════════════════════════════════════════════════ */

  @keyframes p2-orbit-cw {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes p2-orbit-ccw {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  .p2-suborbit-spinner {
    position: absolute;

    top: 0;
    left: 0;

    width: 0;
    height: 0;
  }

  /* Inner ring (Circle 1) — Clockwise */
  .p2-spinner--frontend-circle1 {
    animation: p2-orbit-cw 38s linear infinite;
  }

  .p2-spinner--frontend-circle1 .p2-subnode-icon {
    animation: p2-orbit-ccw 38s linear infinite;
  }

  /* Outer ring (Circle 2) — Counter-Clockwise */
  .p2-spinner--frontend-circle2 {
    animation: p2-orbit-ccw 48s linear infinite;
  }

  .p2-spinner--frontend-circle2 .p2-subnode-icon {
    animation: p2-orbit-cw 48s linear infinite;
  }

  /* ═══════════════════════════════════════════════════════════
     TECHNOLOGY NODES
     ═══════════════════════════════════════════════════════════ */

  .p2-subnode {
    position: absolute;

    top: 0;
    left: 0;

    width: clamp(2.2rem, 3vw, 3.4rem);
    height: clamp(2.2rem, 3vw, 3.4rem);

    margin: calc(clamp(2.2rem, 3vw, 3.4rem) / -2);

    pointer-events: auto;

    cursor: default;

    transform: rotate(var(--angle)) translateX(var(--radius))
      rotate(calc(-1 * var(--angle)));
  }

  /* ═══════════════════════════════════════════════════════════
     ICON CIRCLE
     ═══════════════════════════════════════════════════════════ */

  .p2-subnode-counter {
    position: relative;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #fafafa;

    border: 1px solid #020d19;

    border-radius: 50%;

    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  /* ═══════════════════════════════════════════════════════════
     TECHNOLOGY ICON
     ═══════════════════════════════════════════════════════════ */

  .p2-subnode-icon {
    width: 75%;
    height: 75%;

    object-fit: contain;

    display: block;

    pointer-events: none;

    user-select: none;
  }

  /* ═══════════════════════════════════════════════════════════
     TOOLTIP
     ═══════════════════════════════════════════════════════════ */

  .p2-subnode-tooltip {
    position: absolute;

    bottom: calc(100% + 0.4rem);

    left: 50%;

    transform: translateX(-50%);

    white-space: nowrap;

    background: rgba(18, 3, 3, 0.92);

    border: 1px solid rgba(200, 40, 30, 0.4);

    border-radius: 4px;

    padding: 0.15rem 0.45rem;

    font: 500 clamp(0.42rem, 0.6vw, 0.58rem) / 1.4 var(--sans, sans-serif);

    color: rgba(255, 210, 200, 0.9);

    letter-spacing: 0.05em;

    pointer-events: none;

    opacity: 0;

    transition: opacity 0.25s ease;

    z-index: 30;
  }

  .p2-subnode:hover .p2-subnode-tooltip,
  .p2-subnode:focus .p2-subnode-tooltip,
  .p2-subnode:focus-within .p2-subnode-tooltip {
    opacity: 1;
  }

  /* ═══════════════════════════════════════════════════════════
     HOVER EFFECT
     ═══════════════════════════════════════════════════════════ */

  .p2-subnode:hover .p2-subnode-counter,
  .p2-subnode:focus .p2-subnode-counter,
  .p2-subnode:focus-within .p2-subnode-counter {
    border-color: rgba(220, 70, 50, 0.7);

    box-shadow: 0 0 10px rgba(200, 40, 30, 0.35);

    transform: scale(1.18);
  }

  /* ═══════════════════════════════════════════════════════════
     KEYBOARD ACCESSIBILITY
     ═══════════════════════════════════════════════════════════ */

  .p2-subnode:focus-visible {
    outline: 2px solid rgba(220, 80, 60, 0.8);

    outline-offset: 2px;

    border-radius: 50%;
  }

  /* ═══════════════════════════════════════════════════════════
     MOBILE
     ═══════════════════════════════════════════════════════════ */

  @media (max-width: 900px) {
    .p2-node {
      width: auto !important;
      height: auto !important;

      min-width: 5rem;

      padding: 0.5rem;

      border-radius: 0.5rem;
    }

    /* ─────────────────────────────────────────────────────────
       Disable orbital positioning on mobile
       ───────────────────────────────────────────────────────── */

    .p2-suborbit {
      position: relative;

      top: auto;
      left: auto;

      width: auto;
      height: auto;

      overflow: visible;
    }

    .p2-suborbit-ring {
      display: none;
    }

    /* ─────────────────────────────────────────────────────────
       Convert both circles into responsive icon rows
       ───────────────────────────────────────────────────────── */

    .p2-suborbit-spinner {
      position: static;

      width: auto;
      height: auto;

      display: flex;

      flex-wrap: wrap;

      justify-content: center;

      gap: 0.3rem;

      padding: 0.4rem 0.2rem;

      animation: none !important;
    }

    .p2-subnode-icon {
      animation: none !important;
    }

    /* ─────────────────────────────────────────────────────────
       Reset orbital transforms
       ───────────────────────────────────────────────────────── */

    .p2-subnode {
      position: static;

      width: 2rem;
      height: 2rem;

      margin: 0;

      transform: none !important;
    }

    .p2-subnode-counter {
      transform: none;
    }

    .p2-subnode-tooltip {
      bottom: auto;

      top: calc(100% + 0.3rem);

      font-size: 0.45rem;
    }
  }
</style>
