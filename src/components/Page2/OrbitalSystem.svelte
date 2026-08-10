<script lang="ts">
  // Page 2 Orbital System Component
  // All elements share one coordinate system: the .p2-os-canvas
  // which is anchored at the orbital center (33%, 50%) of the section.

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNOLOGY DATA
  // ═══════════════════════════════════════════════════════════════════════════

  const frontend = [
    // CIRCLE 1
    { name: "JavaScript", icon: "/color-icons/javascript-original.svg" },
    { name: "GSAP", icon: "/color-icons/gsap (1).svg" },
    { name: "TypeScript", icon: "/color-icons/typescript-original.svg" },
    { name: "Astro", icon: "/color-icons/astro-original.svg" },
    { name: "React", icon: "/color-icons/react-original.svg" },
    { name: "Next.js", icon: "/color-icons/nextjs-original.svg" },
    { name: "SCSS", icon: "/color-icons/sass-svgrepo-com.svg" },
    { name: "Three.js", icon: "/color-icons/threejs-original.svg" },

    // CIRCLE 2
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

  const backend = [
    { name: "Node.js", icon: "/color-icons/nodejs-icon-svgrepo-com.svg" },
    { name: "Express", icon: "/color-icons/express-original.svg" },
    { name: "Axios", icon: "/color-icons/axios-plain.svg" },
    { name: "Postman", icon: "/color-icons/postman-original.svg" },
    { name: "Zod", icon: "/color-icons/zod.svg" },
    { name: "JWT", icon: "/color-icons/jwt-icon.svg" },
  ];

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

  const database = [
    { name: "PostgreSQL", icon: "/color-icons/postgresql-original.svg" },
    { name: "MongoDB", icon: "/color-icons/mongodb-original.svg" },
    { name: "Prisma", icon: "/color-icons/prisma-original.svg" },
    {
      name: "AWS",
      icon: "/color-icons/amazonwebservices-original-wordmark.svg",
    },
    { name: "Neon", icon: "/color-icons/neon-icon.svg" },
    { name: "Cloudinary", icon: "/color-icons/cloudinary-icon.svg" },
    { name: "Cloudflare", icon: "/color-icons/cloudflare-original.svg" },
    { name: "Vercel", icon: "/color-icons/vercel-original.svg" },
  ];

  const archProps = [
    "System Design",
    "Scalability",
    "Security",
    "API Architecture",
    "Database Architecture",
    "Cloud Architecture",
    "Performance",
    "Maintainability",
  ];

  const frontendPositions = [
    // ═══════════════════════════════════════════════
    // CIRCLE 1 — 8 NODES — radius 5
    // Equal spacing = 360 ÷ 8 = 45°
    // ═══════════════════════════════════════════════
    { angle: 0, radius: 5 }, // JavaScript
    { angle: 45, radius: 5 }, // GSAP
    { angle: 90, radius: 5 }, // TypeScript
    { angle: 135, radius: 5 }, // Astro
    { angle: 180, radius: 5 }, // React
    { angle: 225, radius: 5 }, // Next.js
    { angle: 270, radius: 5 }, // SCSS
    { angle: 315, radius: 5 }, // Three.js

    // ═══════════════════════════════════════════════
    // CIRCLE 2 — 10 NODES — radius 10
    // Equal spacing = 360 ÷ 10 = 36°
    // ═══════════════════════════════════════════════
    { angle: 0, radius: 9 }, // HTML5
    { angle: 36, radius: 9 }, // CSS3
    { angle: 72, radius: 9 }, // Bootstrap
    { angle: 108, radius: 9 }, // Tailwind CSS
    { angle: 144, radius: 9 }, // React Router
    { angle: 180, radius: 9 }, // Framer
    { angle: 216, radius: 9 }, // Figma
    { angle: 252, radius: 9 }, // Python
    { angle: 288, radius: 9 }, // Vite
    { angle: 324, radius: 9 }, // Svelte
  ];
  const backendPositions = [
    // ═══════════════════════════════════════════════
    // INNER CIRCLE — 3 NODES — radius 4.5
    // Equal spacing = 360 ÷ 3 = 120°
    // ═══════════════════════════════════════════════
    { angle: 0, radius: 4.5 }, // Express
    { angle: 120, radius: 4.5 }, // Node.js
    { angle: 240, radius: 4.5 }, // Axios

    // ═══════════════════════════════════════════════
    // OUTER CIRCLE — 3 NODES — radius 9
    // Offset = 120 ÷ 2 = 60°
    // ═══════════════════════════════════════════════
    { angle: 60, radius: 7 }, // Postman
    { angle: 180, radius: 7 }, // Zod
    { angle: 300, radius: 7 }, // JWT
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
    // OUTER CIRCLE — 6 NODES — radius 9
    // Equal spacing = 360 ÷ 6 = 60°
    // ═══════════════════════════════════════════════
    { angle: 30, radius: 8 }, // Antigravity
    { angle: 90, radius: 8 }, // Claude Code
    { angle: 150, radius: 8 }, // Codex
    { angle: 210, radius: 8 }, // Cursor
    { angle: 270, radius: 8 }, // Trae
    { angle: 330, radius: 8 }, // GitHub
  ];
  const databasePositions = [
    // ═══════════════════════════════════════════════
    // INNER CIRCLE — 4 NODES — radius 5.5
    // Equal spacing = 360 ÷ 4 = 90°
    // ═══════════════════════════════════════════════
    { angle: 0, radius: 5 }, // PostgreSQL
    { angle: 90, radius: 5 }, // MongoDB
    { angle: 180, radius: 5 }, // Cloudinary
    { angle: 270, radius: 5 }, // AWS

    // ═══════════════════════════════════════════════
    // OUTER CIRCLE — 4 NODES — radius 9
    // Offset by half of 90° = 45°
    // ═══════════════════════════════════════════════
    { angle: 45, radius: 9 }, // Neon
    { angle: 135, radius: 9 }, // Prisma
    { angle: 225, radius: 9 }, // Cloudflare
    { angle: 315, radius: 9 }, // Vercel
  ];
  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHITECTURE BOX POSITIONS
  // Edit x / y individually.
  // ═══════════════════════════════════════════════════════════════════════════

  const archPositions = [
    { x: 0, y: -5.5 }, // System Design
    { x: 3.9, y: -3.9 }, // Scalability
    { x: 5.5, y: 0 }, // Security
    { x: 3.9, y: 3.9 }, // API Architecture
    { x: 0, y: 5.5 }, // Database Architecture
    { x: -3.9, y: 3.9 }, // Cloud Architecture
    { x: -5.5, y: 0 }, // Performance
    { x: -3.9, y: -3.9 }, // Maintainability
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // POSITION HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  function subNodeStyle(
    i: number,
    positions: { angle: number; radius: number }[],
  ): string {
    const position = positions[i];

    return `
      --angle:${position.angle}deg;
      --radius:${position.radius}vw;
    `;
  }

  function archBoxStyle(i: number): string {
    const position = archPositions[i];

    return `
      --arch-x:${position.x}vw;
      --arch-y:${position.y}vw;
    `;
  }
</script>

<div
  class="p2-os-canvas"
  aria-label="AFZYL Full-Stack Developer orbital architecture"
>
  <!-- RINGS -->
  <div class="p2-ring p2-ring--inner" aria-hidden="true"></div>
  <div class="p2-ring p2-ring--mid" aria-hidden="true"></div>
  <div class="p2-ring p2-ring--outer" aria-hidden="true"></div>

  <!-- CENTER CORE -->
  <div class="p2-core">
    <span class="p2-core-name">AFZYL</span>
    <span class="p2-core-role">FULL-STACK<br />DEVELOPER</span>
  </div>

  <!-- OUTER NODES -->
  <ul class="p2-nodes" aria-label="Skill areas">
    <!-- ENGINEERING -->
    <li class="p2-node p2-node--top">
      <span class="p2-node-label">ENGINEERING</span>
      <span class="p2-node-sub">DevOps / Tools</span>

      <div class="p2-suborbit p2-suborbit--engineering" aria-hidden="true">
        <div class="p2-suborbit-ring p2-suborbit-ring--engineering"></div>

        <div class="p2-suborbit-spinner p2-spinner--engineering">
          {#each engineering as tech, i}
            <div
              class="p2-subnode"
              style={subNodeStyle(i, engineeringPositions)}
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
    </li>

    <!-- BACKEND -->
    <li class="p2-node p2-node--left">
      <span class="p2-node-label">BACKEND</span>
      <span class="p2-node-sub">Node / API</span>

      <div class="p2-suborbit p2-suborbit--backend" aria-hidden="true">
        <div class="p2-suborbit-ring p2-suborbit-ring--backend"></div>

        <div class="p2-suborbit-spinner p2-spinner--backend">
          {#each backend as tech, i}
            <div
              class="p2-subnode"
              style={subNodeStyle(i, backendPositions)}
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
    </li>

    <!-- FRONTEND -->
    <li class="p2-node p2-node--right">
      <span class="p2-node-label">FRONTEND</span>
      <span class="p2-node-sub">React / UI</span>

      <div class="p2-suborbit p2-suborbit--frontend" aria-hidden="true">
        <div class="p2-suborbit-ring p2-suborbit-ring--frontend"></div>

        <div class="p2-suborbit-spinner p2-spinner--frontend">
          {#each frontend as tech, i}
            <div
              class="p2-subnode"
              style={subNodeStyle(i, frontendPositions)}
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
    </li>

    <!-- DATABASE -->
    <li class="p2-node p2-node--bl">
      <span class="p2-node-label">DATABASE</span>
      <span class="p2-node-sub">Data / Cloud</span>

      <div class="p2-suborbit p2-suborbit--db" aria-hidden="true">
        <div class="p2-suborbit-ring p2-suborbit-ring--db"></div>

        <div class="p2-suborbit-spinner p2-spinner--db">
          {#each database as tech, i}
            <div
              class="p2-subnode"
              style={subNodeStyle(i, databasePositions)}
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
    </li>

    <!-- ARCHITECTURE -->
    <li class="p2-node p2-node--br">
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
    </li>
  </ul>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════════
     EXISTING ORBIT SYSTEM
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-os-canvas {
    position: absolute;
    left: 33%;
    top: 50%;
    width: 0;
    height: 0;
    z-index: 21;
    pointer-events: none;
  }

  .p2-ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid rgba(200, 40, 30, 0.55);
    box-shadow: 0 0 18px rgba(200, 40, 30, 0.12);
    transform: translate(-50%, -50%);
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .p2-ring--inner {
    width: 20vw;
    height: 20vw;
  }

  .p2-ring--mid {
    width: 30vw;
    height: 30vw;
  }

  .p2-ring--outer {
    width: 40vw;
    height: 40vw;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     CORE
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-core {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: clamp(6rem, 8vw, 9rem);
    height: clamp(6rem, 8vw, 9rem);
    border: 2px solid rgba(180, 40, 30, 0.9);
    border-radius: 50%;
    background: rgba(22, 4, 4, 0.9);
    text-align: center;
    gap: 0.2rem;
    line-height: 1.1;
    box-shadow: 0 0 40px rgba(200, 50, 30, 0.3);
    pointer-events: auto;
  }

  .p2-core-name {
    font: 700 clamp(0.75rem, 1.2vw, 1rem)/1 var(--heading);
    color: #fff;
    letter-spacing: 0.04em;
  }

  .p2-core-role {
    font: 500 clamp(0.45rem, 0.7vw, 0.6rem)/1.3 var(--sans);
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     MAIN NODES
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-nodes {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .p2-node {
    position: absolute;
    top: 0;
    left: 0;
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

  .p2-node--top {
    transform: translate(-50%, calc(-50% - 19vw));
  }

  .p2-node--right {
    transform: translate(calc(-140% + 19vw), calc(-50% - 5.25vw));
  }

  .p2-node--br {
    transform: translate(calc(-50% + 14vw), calc(-50% + 13.74vw));
  }

  .p2-node--bl {
    transform: translate(calc(-50% - 14vw), calc(-50% + 13.74vw));
  }

  .p2-node--left {
    transform: translate(calc(40% - 19vw), calc(-50% - 5.25vw));
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

  /* ═══════════════════════════════════════════════════════════════════════════
     SUB ORBITS
     ═══════════════════════════════════════════════════════════════════════════ */

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
    border: 1px dashed rgba(200, 40, 30, 0.18);
    transform: translate(-50%, -50%);
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .p2-suborbit-ring--frontend {
    width: 16vw;
    height: 16vw;
  }

  .p2-suborbit-ring--engineering {
    width: 14vw;
    height: 14vw;
  }

  .p2-suborbit-ring--db {
    width: 11vw;
    height: 11vw;
  }

  .p2-suborbit-ring--backend {
    width: 9vw;
    height: 9vw;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ROTATION — UNCHANGED
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-suborbit-spinner {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  /* TEMPORARILY DISABLED — restore animation later */
  .p2-spinner--frontend {
    animation: none;
  }

  .p2-spinner--engineering {
    animation: none;
  }

  .p2-spinner--db {
    animation: none;
  }

  .p2-spinner--backend {
    animation: none;
  }

  @keyframes p2-orbit {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     INDIVIDUAL SUB-NODES
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-subnode {
    position: absolute;
    top: 0;
    left: 0;

    width: clamp(2.2rem, 3vw, 3.4rem);
    height: clamp(2.2rem, 3vw, 3.4rem);

    margin: calc(clamp(2.2rem, 3vw, 3.4rem) / -2);

    pointer-events: auto;
    cursor: default;

    /*
      INDIVIDUAL POSITION CONTROL

      --angle  = individual angle
      --radius = individual distance

      Every node can now have a completely different
      angle + radius while the same rotation animation remains.
    */

    transform: rotate(var(--angle)) translateX(var(--radius))
      rotate(calc(-1 * var(--angle)));
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SUB NODE CIRCLE
     ═══════════════════════════════════════════════════════════════════════════ */

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

  /* ═══════════════════════════════════════════════════════════════════════════
     TOOLTIP
     ═══════════════════════════════════════════════════════════════════════════ */

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

  /* ═══════════════════════════════════════════════════════════════════════════
     ARCHITECTURE BOXES
     ═══════════════════════════════════════════════════════════════════════════ */

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

    transform: translate(
      calc(-50% + var(--arch-x)),
      calc(-50% + var(--arch-y))
    );

    animation: p2-arch-float 4s ease-in-out infinite;

    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease,
      background 0.3s ease;
  }

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

  .p2-arch-box-text {
    font: 500 clamp(0.38rem, 0.55vw, 0.52rem) / 1 var(--sans, sans-serif);

    color: rgba(220, 160, 150, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  @keyframes p2-arch-float {
    0%,
    100% {
      filter: brightness(1);
    }

    50% {
      filter: brightness(1.15);
    }
  }

  .p2-arch-box:hover {
    border-color: rgba(220, 70, 50, 0.55);
    box-shadow: 0 0 8px rgba(200, 40, 30, 0.25);
    background: rgba(22, 5, 5, 0.92);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     MOBILE
     ═══════════════════════════════════════════════════════════════════════════ */

  @media (max-width: 900px) {
    .p2-os-canvas {
      position: relative;
      left: auto;
      top: auto;
      width: 100%;
      height: auto;

      display: flex;
      flex-direction: column;
      align-items: center;

      gap: 1.2rem;
      padding: 2rem 1rem 3rem;
    }

    .p2-ring {
      display: none;
    }

    .p2-core,
    .p2-node {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
    }

    .p2-core {
      width: 7rem;
      height: 7rem;
    }

    .p2-nodes {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.6rem;
    }

    .p2-node {
      width: 5rem;
      height: 5rem;
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

      animation: none;
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

    .p2-node {
      border-radius: 0.5rem;

      width: auto !important;
      height: auto !important;

      min-width: 5rem;
      padding: 0.5rem;
    }
  }
</style>
