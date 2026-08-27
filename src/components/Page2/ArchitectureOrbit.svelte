<script lang="ts">
  // ═══════════════════════════════════════════════════════════════
  // ARCHITECTURE CONCEPT DATA — LOCKED
  // ═══════════════════════════════════════════════════════════════

  const archProps = [
  // Row 1 — Core Architecture
  "System Design",
  "API Architecture",
  "Database Architecture",
  "Cloud Architecture",

  // Row 2 — System Qualities
  "Scalability",
  "Security",
  "Performance",

  // Row 3 — Long-Term Quality
  "Maintainability",
];
  // ═══════════════════════════════════════════════════════════════
  // ARCHITECTURE BOX POSITIONS
  //
  // X = left / right
  // Y = up / down
  //
  // Negative X  → LEFT
  // Positive X  → RIGHT
  // Negative Y  → UP
  // Positive Y  → DOWN
  //
  // These are intentionally compact so the boxes don't spread
  // too far apart.
  // ═══════════════════════════════════════════════════════════════

  const archPositions = [
    { x: -10, y: -8.0 }, // System Design
    { x: -10, y: -5.7 }, // Scalability
    { x: -10, y: -3.4 }, // Security
    { x: -10, y: -1.1 }, // API Architecture
    { x: -10, y: 1.4 }, // Database Architecture
    { x: -10, y: 3.8 }, // Cloud Architecture
    { x: -10, y: 6.1 }, // Performance
    { x: -10, y: 8.4 }, // Maintainability
  ];

  // ═══════════════════════════════════════════════════════════════
  // CONNECTOR LINE SETTINGS
  //
  // Each line starts from the center of the Architecture node
  // and points toward its corresponding box.
  // ═══════════════════════════════════════════════════════════════

  const connectorData = [
    { length: 12.8, angle: -141.3 }, // System Design
    { length: 11.5, angle: -150.3 }, // Scalability
    { length: 10.6, angle: -161.2 }, // Security
    { length: 10.1, angle: -173.7 }, // API Architecture
    { length: 10.1, angle: 172.0 }, // Database Architecture
    { length: 10.7, angle: 159.2 }, // Cloud Architecture
    { length: 11.7, angle: 148.6 }, // Performance
    { length: 13.1, angle: 140.0 }, // Maintainability
  ];

  function archBoxStyle(i: number): string {
    const p = archPositions[i];

    return `
      --arch-x: ${p.x}vw;
      --arch-y: ${p.y}vw;
    `;
  }

  function archLineStyle(i: number): string {
    const line = connectorData[i];

    return `
      --line-length: ${line.length}vw;
      --line-angle: ${line.angle}deg;
    `;
  }
</script>

<!-- ═══════════════════════════════════════════════════════════════
     ARCHITECTURE NODE
     Positioned by parent OrbitalSystem.svelte.
     DO NOT CHANGE ITS GLOBAL POSITION HERE.
     ═══════════════════════════════════════════════════════════════ -->

<div class="p2-node">
  <span class="p2-node-label">ARCHITECTURE</span>
  <!-- ═══════════════════════════════════════════════════════════
       DESKTOP CONNECTOR LINES + CONCEPT BOXES
       ═══════════════════════════════════════════════════════════ -->

  <div class="p2-arch-system" aria-label="Architecture concepts">
    <!-- CONNECTOR LINES -->
    <div class="p2-arch-lines" aria-hidden="true">
      {#each archProps as _, i}
        <span class="p2-arch-line" style={archLineStyle(i)}></span>
      {/each}
    </div>

    <!-- CONCEPT BOXES -->
    <div class="p2-arch-boxes">
      {#each archProps as prop, i}
        <div
          class="p2-arch-box"
          style={archBoxStyle(i)}
          role="note"
          aria-label={prop}
        >
          <span class="p2-arch-box-text">
            {prop}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════
     MOBILE ARCHITECTURE SYSTEM (<= 430px)
     ═══════════════════════════════════════════════════════════ -->
<div class="p2-m-arch-wrapper" aria-label="Architecture concepts">
  <!-- Lines connect the node to the 4 / 3 / 1 card hierarchy. -->
  <svg class="p2-m-arch-svg" viewBox="0 0 100 198" preserveAspectRatio="none" aria-hidden="true">
    <g class="p2-m-arch-connectors">
      <path d="M50 0V16H12.5M50 16H87.5M12.5 16V32M37.5 16V32M62.5 16V32M87.5 16V32" />
      <path d="M12.5 66V82H87.5M37.5 66V82M62.5 66V82M87.5 66V82M24 82V98M50 82V98M76 82V98" />      <path d="M24 132V148H76M50 132V148M76 132V148M50 148V164" />
    </g>
  </svg>

  <div class="p2-m-arch-pills">
    {#each [archProps.slice(0, 4), archProps.slice(4, 7), archProps.slice(7)] as tier, tierIndex}
      <div
        class="p2-m-arch-tier"
        class:p2-m-arch-tier--four={tierIndex === 0}
        class:p2-m-arch-tier--three={tierIndex === 1}
        class:p2-m-arch-tier--one={tierIndex === 2}
      >
        {#each tier as prop}
          <div class="p2-m-arch-pill" role="note" aria-label={prop}>
            <span class="p2-m-arch-pill-text">{prop}</span>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════
     MAIN ARCHITECTURE NODE
     ═══════════════════════════════════════════════════════════════ */

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

    background: #020d19;

    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 50%;

    pointer-events: auto;

    z-index: 10;
  }

  /* ═══════════════════════════════════════════════════════════════
     ARCHITECTURE TITLE
     ═══════════════════════════════════════════════════════════════ */

  .p2-node-label {
    font: 600 clamp(0.45rem, 0.65vw, 0.62rem) / 1 var(--sans);

    color: #fafafa;
    text-transform: uppercase;

    letter-spacing: 0.07em;
  }
  /* ═══════════════════════════════════════════════════════════════
     ARCHITECTURE SYSTEM
     
     This entire system is anchored at the center of the
     Architecture node.
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-system {
    position: absolute;

    top: 50%;

    left: 50%;

    width: 0;

    height: 0;

    pointer-events: none;

    overflow: visible;
  }

  /* ═══════════════════════════════════════════════════════════════
     CONNECTOR LINES
     
     Every line starts from the Architecture node center and
     points toward its corresponding concept box.
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-lines {
    position: absolute;

    top: 0;

    left: 0;

    width: 0;

    height: 0;

    pointer-events: none;

    z-index: 0;
  }

  .p2-arch-line {
    position: absolute;

    top: 0;

    left: 0;

    display: block;

    width: var(--line-length);

    height: 1px;

    background: rgba(200, 40, 30, 0.42);

    transform-origin: left center;

    transform: rotate(var(--line-angle));

    pointer-events: none;
  }

  /* ═══════════════════════════════════════════════════════════════
     CONCEPT BOX CONTAINER
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-boxes {
    position: absolute;

    top: 0;

    left: 0;

    width: 0;

    height: 0;

    pointer-events: none;

    z-index: 2;
  }

  /* ═══════════════════════════════════════════════════════════════
     CONCEPT BOX
     
     Approximately 40% larger than the previous version.
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-box {
    position: absolute;

    display: flex;

    align-items: center;

    justify-content: center;

    box-sizing: border-box;

    min-height: 1.45rem;

    padding: 0.3rem 0.84rem;

    background: #020d19;

    border: 1px solid rgba(255, 255, 255, 0.65);

    border-radius: 5px;

    white-space: nowrap;

    pointer-events: auto;

    cursor: default;

    transform: translate(
      calc(-50% + var(--arch-x)),
      calc(-50% + var(--arch-y))
    );

    animation: p2-arch-float 4s ease-in-out infinite;

    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease,
      background 0.3s ease,
      transform 0.3s ease;
  }

  /* ═══════════════════════════════════════════════════════════════
     BOX TEXT
     
     40% larger than the previous text size.
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-box-text {
    font: 500 clamp(0.8rem, 0.77vw, 0.73rem) / 1 var(--sans, sans-serif);

    color: #fafafa;

    text-transform: uppercase;

    letter-spacing: 0.055em;
  }

  /* ═══════════════════════════════════════════════════════════════
     INDIVIDUAL FLOAT DELAYS
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-box:nth-child(1) {
    animation-delay: 0s;
  }

  .p2-arch-box:nth-child(2) {
    animation-delay: 0.5s;
  }

  .p2-arch-box:nth-child(3) {
    animation-delay: 1s;
  }

  .p2-arch-box:nth-child(4) {
    animation-delay: 1.5s;
  }

  .p2-arch-box:nth-child(5) {
    animation-delay: 2s;
  }

  .p2-arch-box:nth-child(6) {
    animation-delay: 2.5s;
  }

  .p2-arch-box:nth-child(7) {
    animation-delay: 3s;
  }

  .p2-arch-box:nth-child(8) {
    animation-delay: 3.5s;
  }

  /* ═══════════════════════════════════════════════════════════════
     SUBTLE FLOAT / BRIGHTNESS
     ═══════════════════════════════════════════════════════════════ */

  @keyframes p2-arch-float {
    0%,
    100% {
      filter: brightness(1);
    }

    50% {
      filter: brightness(1.12);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     HOVER
     ═══════════════════════════════════════════════════════════════ */

  .p2-arch-box:hover {
    border-color: rgba(220, 70, 50, 0.75);

    box-shadow: 0 0 10px rgba(200, 40, 30, 0.3);

    background: rgba(22, 5, 5, 0.95);
  }

  .p2-m-arch-wrapper {
    display: none;
  }

  /* ═══════════════════════════════════════════════════════════
     TABLET
     ═══════════════════════════════════════════════════════════ */

  @media (min-width: 431px) and (max-width: 900px) {
    .p2-node {
      border-radius: 0.5rem;

      width: auto !important;

      height: auto !important;

      min-width: 5rem;

      padding: 0.5rem;
    }

    .p2-arch-system {
      position: static;

      width: auto;

      height: auto;

      margin-top: 0.4rem;
    }

    /* Hide connector lines on tablet */

    .p2-arch-lines {
      display: none;
    }

    .p2-arch-boxes {
      position: static;

      width: auto;

      height: auto;

      display: flex;

      flex-wrap: wrap;

      justify-content: center;

      gap: 0.5rem;

      padding: 10rem;
    }

    .p2-arch-box {
      position: static;

      transform: none !important;

      animation: none;

      min-height: auto;

      padding: 2rem 2rem;
    }

    .p2-arch-box-text {
      font-size: 0.52rem;
    }
  }
  /* ═══════════════════════════════════════════════════════════
   MOBILE SCREEN 4 — ARCHITECTURE SYSTEM DESIGN PILLS
   ═══════════════════════════════════════════════════════════ */
  @media (max-width: 430px) {
    /* ─────────────────────────────────────────
     CENTER ARCHITECTURE NODE
     ───────────────────────────────────────── */

    .p2-node {
      width: 6rem;
      height: 6rem;
      padding: 0.2rem;
    }

    .p2-node-label {
      font-size: clamp(0.62rem, 2.5vw, 0.68rem);
    }
    /* ─────────────────────────────────────────
     ARCHITECTURE DESKTOP SYSTEM HIDDEN
     ───────────────────────────────────────── */

    .p2-arch-system {
      display: none !important;
    }

    /* ─────────────────────────────────────────
     MOBILE ARCHITECTURE WRAPPER
     ───────────────────────────────────────── */

    .p2-m-arch-wrapper {
      display: block;
      position: absolute;
      top: 100%;
      left: 50%;
      width: min(94vw, 380px);
      height: 198px;
      margin-top: 0;
      transform: translateX(-50%);
      pointer-events: auto;
    }

    /* ─────────────────────────────────────────
     CONNECTOR LINES
     ───────────────────────────────────────── */

    .p2-m-arch-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;

      overflow: visible;

      display: block;

      pointer-events: none;
      z-index: 0;
    }

    .p2-m-arch-connectors {
      fill: none;
      stroke: rgba(200, 40, 30, 0.55);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }

    /* ─────────────────────────────────────────
     SYSTEM DESIGN PILLS
     ───────────────────────────────────────── */

    .p2-m-arch-pills {
      display: grid;
      grid-template-rows: 32px 34px 32px 34px 32px 34px;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
    }

    .p2-m-arch-tier {
  display: grid;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1.5vw, 0.45rem);
  width: 100%;
  height: 34px;
  margin-inline: auto;
}

    .p2-m-arch-tier--four {
      grid-row: 2;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .p2-m-arch-tier--three {
      grid-row: 4;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      width: 76%;
    }

    .p2-m-arch-tier--one {
      grid-row: 6;
      grid-template-columns: minmax(0, 1fr);
      width: 48%;
    }

    /* ─────────────────────────────────────────
     INDIVIDUAL PILLS
     ───────────────────────────────────────── */

    .p2-m-arch-pill {
      display: flex;

      align-items: center;
      justify-content: center;

      background: #020d19;

      border: 1px solid rgba(255, 255, 255, 0.65);

      border-radius: 3px;

      min-height: clamp(1.75rem, 7.5vw, 2.1rem);
      padding: 0.28rem 0.18rem;

      box-sizing: border-box;

      cursor: default;

      transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        background-color 0.25s ease;
    }

    /* ─────────────────────────────────────────
     PILL HOVER / FOCUS
     ───────────────────────────────────────── */

    .p2-m-arch-pill:hover,
    .p2-m-arch-pill:focus {
      border-color: rgba(220, 70, 50, 0.75);

      box-shadow: 0 0 8px rgba(200, 40, 30, 0.35);

      background: rgba(22, 5, 5, 0.95);
    }

    /* ─────────────────────────────────────────
     VERTICAL PILL TEXT
     ───────────────────────────────────────── */

    .p2-m-arch-pill-text {
      font: 600 clamp(0.4rem, 1.6vw, 0.57rem) / 1.12 var(--sans, sans-serif);

      color: #fafafa;

      text-transform: uppercase;

      letter-spacing: 0.04em;

      text-align: center;
      white-space: normal;
    }
  }
</style>
