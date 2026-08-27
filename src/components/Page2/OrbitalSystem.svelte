<script lang="ts">
  // Page 2 Orbital System — Orchestrator
  // Manages the global canvas, rings, and core for desktop,
  // and coordinates the 3-screen mobile layout (Screen 2, 3, 4).
  // Reuses existing orbital domain child components without data duplication.

  import EngineeringOrbit from "./EngineeringOrbit.svelte";
  import BackendOrbit from "./BackendOrbit.svelte";
  import FrontendOrbit from "./FrontendOrbit.svelte";
  import DatabaseOrbit from "./DatabaseOrbit.svelte";
  import ArchitectureOrbit from "./ArchitectureOrbit.svelte";
  import SunOrbit from "./SunOrbit.svelte";
</script>

<!-- ═══════════════════════════════════════════════════════════════
     DESKTOP ORBITAL SYSTEM CANVAS (> 430px)
     ═══════════════════════════════════════════════════════════════ -->
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

<!-- ═══════════════════════════════════════════════════════════════
     MOBILE THREE CONSECUTIVE SCREENS (<= 430px)
     Screen 2: /Mimages/MHero-BG2.webp (Person composition + Tech Sphere Description)
     Screen 3: /Mimages/MHero-BG2-(2).webp (Frontend + Engineering + Backend)
     Screen 4: /Mimages/MHero-BG2-(2).webp (Database + Architecture with 8 pills)
     ═══════════════════════════════════════════════════════════════ -->
<div class="p2-mobile-screens" aria-label="Mobile orbital technology screens">
  <!-- SCREEN 2: BACKGROUND PERSON COMPOSITION (Tech Sphere Description is at top in index.astro) -->
  <div class="p2-mobile-screen p2-screen-intro"></div>

  <!-- SCREEN 3: FRONTEND + ENGINEERING + BACKEND ORBITS -->
  <div class="p2-mobile-screen p2-screen-orbits-1">
    <div class="p2-m-orbit-box p2-m-orbit-frontend">
      <FrontendOrbit />
    </div>
    <div class="p2-m-orbit-box p2-m-orbit-engineering">
      <EngineeringOrbit />
    </div>
    <div class="p2-m-orbit-box p2-m-orbit-backend">
      <BackendOrbit />
    </div>
  </div>

  <!-- SCREEN 4: DATABASE + ARCHITECTURE ORBITS -->
  <div class="p2-mobile-screen p2-screen-db-arch">
    <div class="p2-m-orbit-box p2-m-orbit-database">
      <DatabaseOrbit />
    </div>
    <div class="p2-m-orbit-box p2-m-orbit-architecture">
      <ArchitectureOrbit />
    </div>
  </div>
</div>

<style>
  /* ═══════════════════════════════════════════════════════════════════════════
     DESKTOP CANVAS — GLOBAL COORDINATE ANCHOR
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
     MOBILE SCREENS — HIDDEN BY DEFAULT ON DESKTOP
     ═══════════════════════════════════════════════════════════════════════════ */

  .p2-mobile-screens {
    display: none;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TABLET (431px–900px)
     ═══════════════════════════════════════════════════════════════════════════ */

  @media (min-width: 431px) and (max-width: 900px) {
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

  /* ═══════════════════════════════════════════════════════════════════════════
     MOBILE (320px–430px) — THREE CONSECUTIVE VERTICAL SCREENS
     ═══════════════════════════════════════════════════════════════════════════ */

  @media (max-width: 430px) {
    .p2-os-canvas {
      display: none !important;
    }

    .p2-mobile-screens {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .p2-mobile-screen {
      position: relative;
      width: 100%;
      min-height: 100svh;
      box-sizing: border-box;
      overflow: hidden;
    }
    .p2-screen-intro {
      position: relative;

      height: calc(100vw * 1601 / 1083);
      min-height: 0;

      background: #020d19 url("/Mimages/MHero-BG2.webp") center top / 100% auto
        no-repeat;
    }
    /* ── SCREEN 3: MHero-BG2-(2).webp (Frontend + Engineering + Backend Orbits) ── */
    .p2-screen-orbits-1 {
      background: #020d19 url("/Mimages/MHero-BG2-(3).webp") center top / cover
        no-repeat;
      min-height: max(100svh, 1050px);
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      padding: 3rem 0 3.5rem;
      gap: 6rem;
    }

    .p2-m-orbit-frontend,
    .p2-m-orbit-engineering,
    .p2-m-orbit-backend {
      position: relative;
      width: min(100%, 340px);
      height: 290px;
      display: grid;
      place-items: center;
      pointer-events: auto;
    }

    /* ── SCREEN 4: MHero-BG2-(2).webp (Database + Architecture Orbits) ── */
   .p2-screen-db-arch {
  background: #020d19 url("/Mimages/MHero-BG2-(2).webp") center top / cover
    no-repeat;

  min-height: max(100svh, 740px);

  display: flex;
  flex-direction: column;

  justify-content: flex-start;

  align-items: center;

  padding: 2rem 0 2rem;

  gap: 1rem;
}

    .p2-m-orbit-database {
      position: relative;
      width: min(100%, 340px);
      height: 290px;
      display: grid;
      place-items: center;
      pointer-events: auto;
    }

    .p2-m-orbit-architecture {
      position: relative;
      width: min(100%, 390px);
      min-height: 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: auto;
      padding-top: 4rem;
    }
  }
</style>
