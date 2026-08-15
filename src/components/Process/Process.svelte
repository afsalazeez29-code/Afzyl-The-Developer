<script lang="ts">
  // Process.svelte — Portfolio process timeline
  // CSS + Svelte + GSAP only (no Three.js, no canvas, no new library).
  // Desktop: horizontal alternating timeline.
  // Tablet (<= 900px): compressed two-row arrangement.
  // Mobile (<= 430px): full vertical track-with-nodes.
  // GSAP + ScrollTrigger used for reveal animations.

  import { onMount } from "svelte";

  const stages = [
    { num: "01", name: "RESEARCH",    desc: "Understanding the problem, users, requirements, and technical direction before development begins." },
    { num: "02", name: "DEFINE",      desc: "Structuring requirements, user flows, architecture, and the core functionality of the product." },
    { num: "03", name: "DESIGN",      desc: "Creating the visual direction, interface structure, interactions, and overall user experience." },
    { num: "04", name: "DEVELOPMENT", desc: "Turning the concept into a responsive, scalable, and high-performance web application." },
    { num: "05", name: "TEST",        desc: "Testing functionality, responsiveness, performance, and user experience across different devices." },
  ];

  let sectionEl: HTMLElement;

  onMount(async () => {
    const gsap = (await import("gsap")).default;
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const nodes = sectionEl.querySelectorAll(".proc-node");
    const cards = sectionEl.querySelectorAll(".proc-card");
    const line  = sectionEl.querySelector(".proc-track-line");

    // Animate timeline line reveal
    if (line) {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionEl, start: "top 80%" },
      });
    }

    // Stagger node + card reveals
    gsap.from(nodes, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: sectionEl, start: "top 75%" },
    });

    gsap.from(cards, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: sectionEl, start: "top 70%" },
    });
  });
</script>

<section bind:this={sectionEl} class="proc-section" aria-label="Development process">

  <!-- HEADER -->
  <div class="proc-header">
    <p class="proc-eyebrow">PROCESS</p>
    <h2 class="proc-title">How I Build</h2>
  </div>

  <!-- DESKTOP / TABLET HORIZONTAL TIMELINE -->
  <div class="proc-timeline" aria-hidden="true">

    <!-- Horizontal track line -->
    <div class="proc-track">
      <div class="proc-track-line"></div>
    </div>

    <!-- Stage items -->
    <ol class="proc-stages" aria-label="Development stages">
      {#each stages as stage, i}
        <li class="proc-stage {i % 2 === 0 ? 'proc-stage--below' : 'proc-stage--above'}">

          <!-- Card sits above or below the track -->
          <div class="proc-card" class:proc-card--above={i % 2 !== 0}>
            <span class="proc-card-num">{stage.num}</span>
            <strong class="proc-card-name">{stage.name}</strong>
            <p class="proc-card-desc">{stage.desc}</p>
          </div>

          <!-- Connector line from track to card -->
          <div class="proc-connector {i % 2 === 0 ? 'proc-connector--down' : 'proc-connector--up'}"></div>

          <!-- Track node dot -->
          <div class="proc-node" aria-label="Stage {stage.num}">
            <div class="proc-node-inner"></div>
          </div>

        </li>
      {/each}
    </ol>

  </div>

  <!-- MOBILE VERTICAL TIMELINE -->
  <ol class="proc-mobile" aria-label="Development stages">
    {#each stages as stage}
      <li class="proc-mobile-stage">
        <div class="proc-mobile-node">
          <div class="proc-mobile-dot"></div>
          <div class="proc-mobile-track"></div>
        </div>
        <div class="proc-mobile-card">
          <span class="proc-card-num">{stage.num}</span>
          <strong class="proc-card-name">{stage.name}</strong>
          <p class="proc-card-desc">{stage.desc}</p>
        </div>
      </li>
    {/each}
  </ol>

</section>

<style>
  /* ── Section ──────────────────────────────────────────────────────────────── */
  .proc-section {
    padding: clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 4rem);
    pointer-events: none;
  }

  /* ── Header ──────────────────────────────────────────────────────────────── */
  .proc-header {
    margin-bottom: clamp(1.5rem, 3vw, 3rem);
  }

  .proc-eyebrow {
    margin: 0 0 0.4rem;
    font: 700 clamp(0.7rem,0.9vw,0.82rem)/1 var(--sans, sans-serif);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #DC4632;
  }

  .proc-title {
    margin: 0;
    font: 700 clamp(1.8rem,3.5vw,3rem)/1.05 var(--heading, sans-serif);
    letter-spacing: -0.02em;
    color: #f1f0eb;
  }

  /* ── Desktop horizontal timeline ─────────────────────────────────────────── */
  .proc-timeline {
    position: relative;
  }

  .proc-track {
    position: relative;
    height: 2px;
    margin: 6rem 0;
  }

  .proc-track-line {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent, rgba(220,70,50,0.6) 10%, rgba(220,70,50,0.6) 90%, transparent);
  }

  .proc-stages {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .proc-stage {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  /* ── Nodes ───────────────────────────────────────────────────────────────── */
  .proc-node {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: 2px solid #DC4632;
    background: #020D19;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    box-shadow: 0 0 12px rgba(220,70,50,0.45);
  }

  .proc-node-inner {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: #DC4632;
  }

  /* ── Connectors ──────────────────────────────────────────────────────────── */
  .proc-connector {
    width: 1.5px;
    background: rgba(220,70,50,0.35);
    height: clamp(2.5rem, 4vw, 4rem);
  }

  /* ── Cards ───────────────────────────────────────────────────────────────── */
  .proc-card {
    background: rgba(2,13,25,0.72);
    border: 1px solid rgba(241,240,235,0.13);
    border-radius: 12px;
    backdrop-filter: blur(6px);
    padding: clamp(0.7rem,1.2vw,1.1rem) clamp(0.8rem,1.4vw,1.3rem);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-width: clamp(140px, 16vw, 200px);
    text-align: left;
  }

  .proc-card-num {
    font: 700 clamp(0.62rem,0.75vw,0.72rem)/1 var(--sans, sans-serif);
    letter-spacing: 0.1em;
    color: #DC4632;
  }

  .proc-card-name {
    font: 700 clamp(0.72rem,0.9vw,0.85rem)/1.2 var(--sans, sans-serif);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #f1f0eb;
  }

  .proc-card-desc {
    margin: 0;
    font: 400 clamp(0.62rem,0.78vw,0.72rem)/1.5 var(--sans, sans-serif);
    color: rgba(241,240,235,0.65);
  }

  /* Cards above/below track via connector ordering */
  .proc-stage--below { flex-direction: column; }
  .proc-stage--above { flex-direction: column-reverse; }

  /* ── Mobile list (hidden on desktop) ─────────────────────────────────────── */
  .proc-mobile {
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: column;
    gap: 0;
  }

  .proc-mobile-stage {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .proc-mobile-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  .proc-mobile-dot {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 2px solid #DC4632;
    background: #020D19;
    box-shadow: 0 0 8px rgba(220,70,50,0.4);
    flex-shrink: 0;
  }

  .proc-mobile-track {
    width: 1.5px;
    flex: 1;
    min-height: 2.5rem;
    background: rgba(220,70,50,0.3);
  }

  .proc-mobile-stage:last-child .proc-mobile-track {
    display: none;
  }

  .proc-mobile-card {
    background: rgba(2,13,25,0.65);
    border: 1px solid rgba(241,240,235,0.12);
    border-radius: 12px;
    backdrop-filter: blur(6px);
    padding: 0.8rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 1rem;
    flex: 1;
  }

  /* ── Responsive ──────────────────────────────────────────────────────────── */

  /* Tablet: compress into 3+2 rows */
  @media (max-width: 900px) {
    .proc-stages {
      flex-wrap: wrap;
      position: static;
      transform: none;
    }
    .proc-stage {
      flex: 0 0 33.33%;
    }
    .proc-track { display: none; }
  }

  /* Mobile: switch to vertical layout */
  @media (max-width: 430px) {
    .proc-timeline { display: none; }
    .proc-mobile { display: flex; }
  }
</style>
