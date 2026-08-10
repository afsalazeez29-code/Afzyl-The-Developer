<script lang="ts">
  // Page 2 Orbital System — Orchestrator
  // Manages the global canvas, rings, and core.
  // Each orbital domain is a self-contained child component.

  import EngineeringOrbit from "./EngineeringOrbit.svelte";
  import BackendOrbit from "./BackendOrbit.svelte";
  import FrontendOrbit from "./FrontendOrbit.svelte";
  import DatabaseOrbit from "./DatabaseOrbit.svelte";
  import ArchitectureOrbit from "./ArchitectureOrbit.svelte";
  import SunOrbit from "./SunOrbit.svelte";
</script>

<div
  class="p2-os-canvas"
  aria-label="AFZYL Full-Stack Developer orbital architecture"
>
  <!-- RINGS -->
  <div class="p2-ring p2-ring--mid" aria-hidden="true"></div>
  <div class="p2-ring p2-ring--outer" aria-hidden="true"></div>

  <!-- SUN CORE — fiery particle sphere at the orbital origin -->
  <div class="p2-sun-core" aria-hidden="true">
    <SunOrbit sphereColor="rgba(220, 70, 50, 0.75)" />
  </div>

  <!-- OUTER NODES -->
  <div class="p2-nodes" aria-label="Skill areas">
    <div class="p2-os-node p2-os-node--engineering">
      <EngineeringOrbit />
    </div>
    <div class="p2-os-node p2-os-node--backend">
      <BackendOrbit />
    </div>
    <div class="p2-os-node p2-os-node--frontend">
      <FrontendOrbit />
    </div>
    <div class="p2-os-node p2-os-node--database">
      <DatabaseOrbit />
    </div>
    <div class="p2-os-node p2-os-node--architecture">
      <ArchitectureOrbit />
    </div>
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════════
     CANVAS — GLOBAL COORDINATE ANCHOR
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

  /* ═══════════════════════════════════════════════════════════════════════════
     RINGS
     ═══════════════════════════════════════════════════════════════════════════ */

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

  .p2-ring--mid {
    width: 30vw;
    height: 30vw;
  }

  .p2-ring--outer {
    width: 40vw;
    height: 40vw;
  }
  .p2-nodes {
    margin: 0;
    padding: 0;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SUN CORE — centered particle sphere
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-sun-core {
    --sun-x: -3.5vw;
    --sun-y: -3vw;

    position: absolute;
    left: var(--sun-x);
    top: var(--sun-y);

    transform: translate(-50%, -50%);

    width: clamp(10rem, 13vw, 16rem);
    height: clamp(10rem, 13vw, 16rem);

    pointer-events: auto;
    z-index: 5;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     GLOBAL MODULE POSITIONING (OWNED BY ORBITALSYSTEM)
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-os-node {
    position: absolute;
    top: 0;
    left: 0;
  }

  .p2-os-node--engineering {
    transform: translate(35%, calc(-50% - 18vw));
  }

  .p2-os-node--frontend {
    transform: translate(calc(-60% + 20vw), calc(-13% - 2vw));
  }

  .p2-os-node--database {
    transform: translate(calc(192% - 12vw), calc(-50% + 13.74vw));
  }

  .p2-os-node--backend {
    transform: translate(calc(-20% - 20vw), calc(90% - 1vw));
  }

  .p2-os-node--architecture {
    transform: translate(calc(-50% - 14vw), calc(-50% - 13.74vw));
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

    .p2-sun-core {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      width: clamp(8rem, 40vw, 12rem);
      height: clamp(8rem, 40vw, 12rem);
      margin: 0 auto 0.5rem;
    }

    .p2-core {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      width: 7rem;
      height: 7rem;
    }

    .p2-nodes {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.6rem;
    }

    .p2-os-node {
      position: relative;
      top: auto;
      left: auto;
      transform: none !important;
    }
  }
</style>
