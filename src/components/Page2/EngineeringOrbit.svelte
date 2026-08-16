<script lang="ts">
  // ── Engineering technology data — LOCKED ────────────────────────────────────
  const engineering = [
    // INNER CIRCLE
    { name: "npm", icon: "/color-icons/npm-original.svg" },
    { name: "PM2", icon: "/color-icons/pm2-original.svg" },
    { name: "Nginx", icon: "/color-icons/nginx.svg" },
    { name: "Ubuntu", icon: "/color-icons/Ubuntu.svg" },
    { name: "Docker", icon: "/color-icons/docker-icon.svg" },
    { name: "Git", icon: "/color-icons/git-original.svg" },

    // OUTER CIRCLE
    { name: "Antigravity", icon: "/color-icons/antigravity-color.svg" },
    { name: "Claude Code", icon: "/color-icons/claude-code.svg" },
    { name: "Codex", icon: "/color-icons/codex-color.svg" },
    { name: "Cursor", icon: "/color-icons/cursor-ai-code-icon.svg" },
    { name: "Trae", icon: "/color-icons/trae-color.svg" },
    { name: "GitHub", icon: "/color-icons/github-original.svg" },
  ];

  const engineeringPositions = [
    // ═══════════════════════════════════════════════
    // INNER CIRCLE — 6 NODES — radius 5
    // Equal spacing = 360 ÷ 6 = 60°
    // ═══════════════════════════════════════════════
    { angle: 0, radius: 5 }, // npm
    { angle: 60, radius: 5 }, // PM2
    { angle: 120, radius: 5 }, // Nginx
    { angle: 180, radius: 5 }, // Ubuntu
    { angle: 240, radius: 5 }, // Docker
    { angle: 300, radius: 5 }, // Git

    // ═══════════════════════════════════════════════
    // OUTER CIRCLE — 6 NODES — radius 8
    // Equal spacing = 360 ÷ 6 = 60°
    // ═══════════════════════════════════════════════
    { angle: 30, radius: 9 }, // Antigravity
    { angle: 90, radius: 9 }, // Claude Code
    { angle: 150, radius: 9 }, // Codex
    { angle: 210, radius: 9 }, // Cursor
    { angle: 270, radius: 9 }, // Trae
    { angle: 330, radius: 9 }, // GitHub
  ];

  function subNodeStyle(i: number): string {
    const p = engineeringPositions[i];
    return `--angle:${p.angle}deg; --radius:${p.radius}vw;`;
  }
</script>

<!-- ENGINEERING node — positioned by parent OrbitalSystem -->
<div class="p2-node">
  <span class="p2-node-label">ENGINEERING</span>
  <span class="p2-node-sub">DevOps / Tools</span>

  <div class="p2-suborbit p2-suborbit--engineering" aria-hidden="true">
    <div class="p2-suborbit-ring p2-suborbit-ring--engineering-inner"></div>
    <div class="p2-suborbit-ring p2-suborbit-ring--engineering-outer"></div>

    <!-- Inner ring — Clockwise -->
    <div class="p2-suborbit-spinner p2-spinner--engineering-inner">
      {#each engineering.slice(0, 6) as tech, i}
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
    <div class="p2-suborbit-spinner p2-spinner--engineering-outer">
      {#each engineering.slice(6) as tech, i}
        <div
          class="p2-subnode"
          style={subNodeStyle(i + 6)}
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
  /* ── Main node shared styles (scoped to this component) ── */
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

  /* ── Sub-orbit anchor ── */
  .p2-suborbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  /* ── Orbit ring ── */
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

  /* Inner circle — radius 5vw → diameter 10vw */
  .p2-suborbit-ring--engineering-inner {
    width: 10vw;
    height: 10vw;
  }

  /* Outer circle — radius 8vw → diameter 16vw */
  .p2-suborbit-ring--engineering-outer {
    width: 18vw;
    height: 18vw;
  }

  /* ── Spinner ── */
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
  .p2-spinner--engineering-inner {
    animation: p2-orbit-cw 38s linear infinite;
  }

  .p2-spinner--engineering-inner .p2-subnode-icon {
    animation: p2-orbit-ccw 38s linear infinite;
  }

  /* Outer ring — Counter-Clockwise */
  .p2-spinner--engineering-outer {
    animation: p2-orbit-ccw 48s linear infinite;
  }

  .p2-spinner--engineering-outer .p2-subnode-icon {
    animation: p2-orbit-cw 48s linear infinite;
  }

  /* ── Sub-node ── */
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

  /* ── Tooltip ── */
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
    transition: opacity 0.55s ease;
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

  /* ── Mobile ── */
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
</style>
