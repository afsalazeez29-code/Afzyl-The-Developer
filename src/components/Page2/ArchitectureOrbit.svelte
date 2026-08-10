<script lang="ts">
  // ── Architecture concept data — LOCKED ───────────────────────────────────────
  const archProps = [
    "System Design",
    "Scalability",
    "Security",
    "API Architecture",
    "Database Architecture",
    "Cloud Architecture",
    "Performance",
    "Maintainability",
  ]; // 8 concept boxes — NO circular icon nodes

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHITECTURE BOX POSITIONS
  // Edit x / y individually.
  // ═══════════════════════════════════════════════════════════════════════════
  const archPositions = [
    { x: 0,    y: -5.5 }, // System Design
    { x: 3.9,  y: -3.9 }, // Scalability
    { x: 5.5,  y: 0    }, // Security
    { x: 3.9,  y: 3.9  }, // API Architecture
    { x: 0,    y: 5.5  }, // Database Architecture
    { x: -3.9, y: 3.9  }, // Cloud Architecture
    { x: -5.5, y: 0    }, // Performance
    { x: -3.9, y: -3.9 }, // Maintainability
  ];

  function archBoxStyle(i: number): string {
    const p = archPositions[i];
    return `--arch-x:${p.x}vw; --arch-y:${p.y}vw;`;
  }
</script>

<!-- ARCHITECTURE node — positioned by parent OrbitalSystem -->
<div class="p2-node">
  <span class="p2-node-label">ARCHITECTURE</span>
  <span class="p2-node-sub">System Design</span>

  <div class="p2-arch-boxes" aria-label="Architecture concepts">
    {#each archProps as prop, i}
      <div
        class="p2-arch-box"
        style={archBoxStyle(i)}
        role="note"
        aria-label={prop}
      >
        <span class="p2-arch-box-text">{prop}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .p2-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    background: rgba(15, 3, 3, 0.85);
    border: 1px solid rgba(180, 40, 30, 0.5);
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
    color: rgba(220, 80, 60, 0.95);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .p2-node-sub {
    font: 400 clamp(0.4rem, 0.58vw, 0.55rem)/1.3 var(--sans);
    color: rgba(255, 255, 255, 0.65);
  }

  /* ── Architecture boxes ── */
  .p2-arch-boxes {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .p2-arch-box {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(14, 2, 2, 0.85);
    border: 1px solid rgba(180, 40, 30, 0.28);
    border-radius: 4px;
    padding: 0.22rem 0.6rem;
    white-space: nowrap;
    pointer-events: auto;
    cursor: default;
    transform: translate(calc(-50% + var(--arch-x)), calc(-50% + var(--arch-y)));
    animation: p2-arch-float 4s ease-in-out infinite;
    transition:
      border-color 0.3s ease,
      box-shadow   0.3s ease,
      background   0.3s ease;
  }

  .p2-arch-box:nth-child(1) { animation-delay: 0s;   }
  .p2-arch-box:nth-child(2) { animation-delay: 0.5s; }
  .p2-arch-box:nth-child(3) { animation-delay: 1s;   }
  .p2-arch-box:nth-child(4) { animation-delay: 1.5s; }
  .p2-arch-box:nth-child(5) { animation-delay: 2s;   }
  .p2-arch-box:nth-child(6) { animation-delay: 2.5s; }
  .p2-arch-box:nth-child(7) { animation-delay: 3s;   }
  .p2-arch-box:nth-child(8) { animation-delay: 3.5s; }

  .p2-arch-box-text {
    font: 500 clamp(0.38rem, 0.55vw, 0.52rem)/1 var(--sans, sans-serif);
    color: rgba(220, 160, 150, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  @keyframes p2-arch-float {
    0%,  100% { filter: brightness(1);    }
    50%        { filter: brightness(1.15); }
  }

  .p2-arch-box:hover {
    border-color: rgba(220, 70, 50, 0.55);
    box-shadow: 0 0 8px rgba(200, 40, 30, 0.25);
    background: rgba(22, 5, 5, 0.92);
  }

  /* ── Mobile ── */
  @media (max-width: 900px) {
    .p2-node {
      border-radius: 0.5rem;
      width: auto !important;
      height: auto !important;
      min-width: 5rem;
      padding: 0.5rem;
    }

    .p2-arch-boxes {
      position: static;
      width: auto;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.3rem 0;
    }

    .p2-arch-box {
      position: static;
      transform: none !important;
      animation: none;
      padding: 0.15rem 0.4rem;
    }
  }
</style>
