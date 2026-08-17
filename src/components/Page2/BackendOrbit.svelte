<script lang="ts">
  // ── Backend technology data — LOCKED ────────────────────────────────────────
  const backend = [
    { name: "Express", icon: "/color-icons/express-original.svg" },
    { name: "Node.js", icon: "/color-icons/nodejs-icon-svgrepo-com.svg" },
    { name: "Axios", icon: "/color-icons/axios-plain.svg" },
    { name: "Postman", icon: "/color-icons/postman-original.svg" },
    { name: "Zod", icon: "/color-icons/zod.svg" },
    { name: "JWT", icon: "/color-icons/jwt-icon.svg" },
  ];

  const backendPositions = [
    // ═══════════════════════════════════════════════
    // INNER CIRCLE — 3 NODES — radius 4.5
    // Equal spacing = 360 ÷ 3 = 120°
    // ═══════════════════════════════════════════════
    { angle: 0, radius: 5 }, // Express
    { angle: 120, radius: 5 }, // Node.js
    { angle: 240, radius: 5 }, // Axios

    // ═══════════════════════════════════════════════
    // OUTER CIRCLE — 3 NODES — radius 7
    // Offset = 120 ÷ 2 = 60°
    // ═══════════════════════════════════════════════
    { angle: 60, radius: 9 }, // Postman
    { angle: 180, radius: 9 }, // Zod
    { angle: 300, radius: 9 }, // JWT
  ];

  function subNodeStyle(i: number): string {
    const p = backendPositions[i];
    return `--angle:${p.angle}deg; --radius:${p.radius}vw;`;
  }
</script>

<!-- BACKEND node — positioned by parent OrbitalSystem -->
<div class="p2-node">
  <span class="p2-node-label">BACKEND</span>
  <span class="p2-node-sub">Node / API</span>

  <div class="p2-suborbit p2-suborbit--backend" aria-hidden="true">
    <div class="p2-suborbit-ring p2-suborbit-ring--backend-inner"></div>
    <div class="p2-suborbit-ring p2-suborbit-ring--backend-outer"></div>

    <!-- Inner ring — Clockwise -->
    <div class="p2-suborbit-spinner p2-spinner--backend-inner">
      {#each backend.slice(0, 3) as tech, i}
        <div
          class="p2-subnode"
          style={subNodeStyle(i)}
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
          <span class="p2-subnode-tooltip">{tech.name}</span>
        </div>
      {/each}
    </div>

    <!-- Outer ring — Counter-Clockwise -->
    <div class="p2-suborbit-spinner p2-spinner--backend-outer">
      {#each backend.slice(3) as tech, i}
        <div
          class="p2-subnode"
          style={subNodeStyle(i + 3)}
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
          <span class="p2-subnode-tooltip">{tech.name}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .p2-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    background: #020d19;
    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 50%;
    width: clamp(3.8rem, 6vw, 6rem);
    height: clamp(3.8rem, 6vw, 6rem);
    justify-content: center;
    text-align: center;
    padding: 0.4rem;
    pointer-events: auto;
  }

  .p2-node-label {
    font: 600 clamp(0.45rem, 0.65vw, 0.62rem)/1 var(--sans);
    color: #fafafa;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .p2-node-sub {
    font: 400 clamp(0.4rem, 0.58vw, 0.55rem)/1.3 var(--sans);
    color: rgba(255, 255, 255, 0.65);
  }

  .p2-suborbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .p2-suborbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid rgba(200, 40, 30, 0.55);
    box-shadow: 0 0 18px rgba(200, 40, 30, 0.12);
    transform: translate(-50%, -50%);
    top: 0;
    left: 0;
    pointer-events: none;
    box-sizing: border-box;
  }

  /* Inner circle — radius 4.5vw → diameter 9vw */
  .p2-suborbit-ring--backend-inner {
    width: 10vw;
    height: 10vw;
  }

  /* Outer circle — radius 7vw → diameter 14vw */
  .p2-suborbit-ring--backend-outer {
    width: 18vw;
    height: 18vw;
  }

  .p2-suborbit-spinner {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }

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

  /* Inner ring — Clockwise */
  .p2-spinner--backend-inner {
    animation: p2-orbit-cw 38s linear infinite;
  }

  .p2-spinner--backend-inner .p2-subnode-icon {
    animation: p2-orbit-ccw 38s linear infinite;
  }

  /* Outer ring — Counter-Clockwise */
  .p2-spinner--backend-outer {
    animation: p2-orbit-ccw 48s linear infinite;
  }

  .p2-spinner--backend-outer .p2-subnode-icon {
    animation: p2-orbit-cw 48s linear infinite;
  }

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
    z-index: 2;
  }

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

  .p2-subnode-icon {
    width: 75%;
    height: 75%;
    object-fit: contain;
    display: block;
    pointer-events: none;
    user-select: none;
  }

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
    font: 500 clamp(0.42rem, 0.6vw, 0.58rem)/1.4 var(--sans, sans-serif);
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

  .p2-subnode:hover .p2-subnode-counter,
  .p2-subnode:focus .p2-subnode-counter,
  .p2-subnode:focus-within .p2-subnode-counter {
    border-color: rgba(220, 70, 50, 0.7);
    box-shadow: 0 0 10px rgba(200, 40, 30, 0.35);
    transform: scale(1.18);
  }

  .p2-subnode:focus-visible {
    outline: 2px solid rgba(220, 80, 60, 0.8);
    outline-offset: 2px;
    border-radius: 50%;
  }

  @media (min-width: 431px) and (max-width: 900px) {
    .p2-node {
      border-radius: 0.5rem;
      width: auto !important;
      height: auto !important;
      min-width: 5rem;
      padding: 0.5rem;
    }

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
  /* ── Mobile Screen 3: True Circular Rotating Orbit ── */
  @media (max-width: 430px) {
    /* ─────────────────────────────────────────
     CENTER NODE
     ───────────────────────────────────────── */

    .p2-node {
      width: 6rem;
      height: 6rem;
      padding: 0.2rem;
    }

    .p2-node-label {
      font-size: 0.85rem;
    }

    .p2-node-sub {
      font-size: 0.5rem;
    }

    /* ─────────────────────────────────────────
     INNER ORBIT
     ───────────────────────────────────────── */

    .p2-suborbit-ring--backend-inner {
      width: 190px;
      height: 190px;
    }

    /* ─────────────────────────────────────────
     OUTER ORBIT
     ───────────────────────────────────────── */

    .p2-suborbit-ring--backend-outer {
      width: 310px;
      height: 310px;
    }

    /* ─────────────────────────────────────────
     TECHNOLOGY NODES
     ───────────────────────────────────────── */

    .p2-subnode {
      width: 3rem;
      height: 3rem;

      /* Half of 3rem */
      margin: -1.5rem;
    }

    /* ─────────────────────────────────────────
     INNER ORBIT RADIUS
     ───────────────────────────────────────── */

    .p2-spinner--backend-inner .p2-subnode {
      transform: rotate(var(--angle)) translateX(95px)
        rotate(calc(-1 * var(--angle)));
    }

    /* ─────────────────────────────────────────
     OUTER ORBIT RADIUS
     ───────────────────────────────────────── */

    .p2-spinner--backend-outer .p2-subnode {
      transform: rotate(var(--angle)) translateX(155px)
        rotate(calc(-1 * var(--angle)));
    }
  }
</style>
