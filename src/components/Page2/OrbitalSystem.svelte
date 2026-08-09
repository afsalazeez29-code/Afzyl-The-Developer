<script lang="ts">
  // Page 2 Orbital System Component
  // All elements share one coordinate system: the .p2-os-canvas
  // which is anchored at the orbital center (33%, 50%) of the section.
</script>

<div
  class="p2-os-canvas"
  aria-label="AFZYL Full-Stack Developer orbital architecture"
>
  <!-- CONCENTRIC RINGS -->
  <div class="p2-ring p2-ring--inner" aria-hidden="true"></div>
  <div class="p2-ring p2-ring--mid" aria-hidden="true"></div>
  <div class="p2-ring p2-ring--outer" aria-hidden="true"></div>

  <!-- CENTER CORE -->
  <div class="p2-core">
    <span class="p2-core-name">AFZYL</span>
    <span class="p2-core-role">FULL-STACK<br />DEVELOPER</span>
  </div>
  <!-- 5 ORBITAL NODES — positioned on the outer ring -->
  <ul class="p2-nodes" aria-label="Skill areas">
    <!-- 12 o'clock -->
    <li class="p2-node p2-node--top">
      <span class="p2-node-label">ENGINEERING</span>
      <span class="p2-node-sub">DevOps / Tools</span>
    </li>
    <!-- 9 o'clock -->
    <li class="p2-node p2-node--left">
      <span class="p2-node-label">BACKEND</span>
      <span class="p2-node-sub">Node / API</span>
    </li>
    <!-- 3 o'clock -->
    <li class="p2-node p2-node--right">
      <span class="p2-node-label">FRONTEND</span>
      <span class="p2-node-sub">React / UI</span>
    </li>
    <!-- ~7 o'clock -->
    <li class="p2-node p2-node--bl">
      <span class="p2-node-label">DATABASE</span>
      <span class="p2-node-sub">Data / Cloud</span>
    </li>
    <!-- ~5 o'clock -->
    <li class="p2-node p2-node--br">
      <span class="p2-node-label">ARCHITECTURE</span>
      <span class="p2-node-sub">System Design</span>
    </li>
  </ul>
</div>

<style>
  /* Zero-dimension anchor at the orbital center */
  .p2-os-canvas {
    position: absolute;
    /* 33% from left of the 2560px image, 50% vertically */
    left: 33%;
    top: 50%;
    width: 0;
    height: 0;
    z-index: 21;
    pointer-events: none;
  }

  /* ---- RINGS ---- */
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

  /* Mid ring ~17% of section width */
  .p2-ring--mid {
    width: 30vw;
    height: 30vw;
  }

  /* Outer ring ~27% of section width */
  .p2-ring--outer {
    width: 40vw;
    height: 40vw;
  }

  /* ---- CORE ---- */
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

  /* ---- NODES ---- */
  /* Outer ring radius = 13.5vw from center */
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
    /* Each node is translated to its clock position below */
  }

  /* ---- 5 EQUALLY SPACED OUTER ORBIT NODES ---- */

  /* Outer orbit = 34vw → radius = 17vw */

  /* ENGINEERING — 12 o'clock */
  .p2-node--top {
    transform: translate(-50%, calc(-50% - 19vw));
  }

  /* FRONTEND — 72° clockwise from top */
  .p2-node--right {
    transform: translate(calc(-140% + 19vw), calc(-50% - 5.25vw));
  }

  /* ARCHITECTURE — 144° clockwise from top */
  .p2-node--br {
    transform: translate(calc(-50% + 14vw), calc(-50% + 13.74vw));
  }

  /* DATABASE — 216° clockwise from top */
  .p2-node--bl {
    transform: translate(calc(-50% - 14vw), calc(-50% + 13.74vw));
  }

  /* BACKEND — 288° clockwise from top */
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
  /* ---- MOBILE RESPONSIVE ---- */
  @media (max-width: 900px) {
    /* On mobile, revert to a centered column stack */
    .p2-os-canvas {
      /* reset the anchor to be a normal block container */
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

    /* Rings hidden on mobile — too small to render well */
    .p2-ring {
      display: none;
    }

    /* Reset all absolute positioning to normal flow */
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
  }
</style>
