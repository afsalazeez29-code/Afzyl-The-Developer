<script lang="ts">
  // Process.svelte — Blueprint-accurate alternating process graph.
  // Desktop: 5 nodes on a horizontal line, alternating top/bottom layout.
  // Mobile (≤430px): clean vertical reading list; graph + images hidden.
  // GSAP ScrollTrigger used for reveal animations.

  import { onMount } from "svelte";

  const stages = [
    {
      num: "01",
      name: "RESEARCH",
      desc: "Understanding the problem, users, requirements, and technical direction before development begins.",
      astroHeading: "MASSIVE STAR",
      astroImg: "/data/massive-star.webp",
      side: "below", // image+heading top, phase content bottom
    },
    {
      num: "02",
      name: "DEFINE",
      desc: "Structuring requirements, user flows, architecture, and the core functionality of the product.",
      astroHeading: "CORE COLLAPSE",
      astroImg: "/data/core-collapse.webp",
      side: "above", // phase content top, image+heading bottom
    },
    {
      num: "03",
      name: "DESIGN",
      desc: "Creating the visual direction, interface structure, interactions, and overall user experience.",
      astroHeading: "SUPER-NOVA",
      astroImg: "/data/super-nova.webp",
      side: "below",
    },
    {
      num: "04",
      name: "DEVELOPMENT",
      desc: "Turning the concept into a responsive, scalable, and high-performance web application.",
      astroHeading: "HORIZON-BIRTH",
      astroImg: "/data/horizon-birth.webp",
      side: "above",
    },
    {
      num: "05",
      name: "TEST",
      desc: "Testing functionality, responsiveness, performance, and user experience across different devices.",
      astroHeading: "ACCRETION",
      astroImg: "/data/accretion.webp",
      side: "below",
    },
  ];

  let sectionEl: HTMLElement;

  onMount(async () => {
    const gsap = (await import("gsap")).default;
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const line = sectionEl.querySelector(".proc-track-line");
    const nodes = sectionEl.querySelectorAll(".proc-node");
    const tops = sectionEl.querySelectorAll(".proc-top-block");
    const bots = sectionEl.querySelectorAll(".proc-bot-block");

    if (line) {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionEl, start: "top 80%" },
      });
    }

    gsap.from(nodes, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: sectionEl, start: "top 75%" },
    });

    gsap.from([...tops, ...bots], {
      y: 16,
      opacity: 0,
      duration: 0.65,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: { trigger: sectionEl, start: "top 70%" },
    });
  });
</script>

<section
  bind:this={sectionEl}
  class="proc-section"
  aria-label="Development process"
>
  <!-- ── DESKTOP GRAPH (hidden on ≤430px) ─────────────────────────────────── -->
  <div class="proc-graph" aria-hidden="true">
    <!-- TOP ROW: alternating top content blocks -->
    <div class="proc-top-row">
      {#each stages as stage, i}
        <div class="proc-col">
          {#if stage.side === "below"}
            <!-- Image + Heading sits TOP for below-nodes (1, 3, 5) -->
            <div class="proc-top-block proc-astro">
              <img
                src={stage.astroImg}
                alt={stage.astroHeading}
                class="proc-astro-img"
                loading="lazy"
                width="72"
                height="72"
              />
              <span class="proc-astro-label">{stage.astroHeading}</span>
            </div>
          {:else}
            <!-- Phase card sits TOP for above-nodes (2, 4) -->
            <div class="proc-top-block proc-phase-card">
              <span class="proc-num">{stage.num}</span>
              <strong class="proc-name">{stage.name}</strong>
              <p class="proc-desc">{stage.desc}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- CENTRAL GRAPH LINE + NODES -->
    <div class="proc-track-wrap">
      <div class="proc-track-line"></div>
      <div class="proc-nodes-row">
        {#each stages as _stage, i}
          <div class="proc-col">
            <div class="proc-node" aria-label="Stage {i + 1}">
              <div class="proc-node-inner"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- BOTTOM ROW: alternating bottom content blocks -->
    <div class="proc-bot-row">
      {#each stages as stage, i}
        <div class="proc-col">
          {#if stage.side === "below"}
            <!-- Phase card sits BOTTOM for below-nodes (1, 3, 5) -->
            <div class="proc-bot-block proc-phase-card">
              <span class="proc-num">{stage.num}</span>
              <strong class="proc-name">{stage.name}</strong>
              <p class="proc-desc">{stage.desc}</p>
            </div>
          {:else}
            <!-- Image + Heading sits BOTTOM for above-nodes (2, 4) -->
            <div class="proc-bot-block proc-astro">
              <img
                src={stage.astroImg}
                alt={stage.astroHeading}
                class="proc-astro-img"
                loading="lazy"
                width="72"
                height="72"
              />
              <span class="proc-astro-label">{stage.astroHeading}</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <!-- /.proc-graph -->

  <!-- ── MOBILE VERTICAL LIST (visible only on ≤430px) ─────────────────────── -->
  <ol class="proc-mobile" aria-label="Development stages">
    {#each stages as stage}
      <li class="proc-mobile-stage">
        <div class="proc-mobile-node-wrap">
          <div class="proc-mobile-dot"></div>
          <div class="proc-mobile-track"></div>
        </div>
        <div class="proc-mobile-card">
          <span class="proc-num">{stage.num}</span>
          <strong class="proc-name">{stage.name}</strong>
          <p class="proc-desc">{stage.desc}</p>
        </div>
      </li>
    {/each}
  </ol>
</section>

<style>
  /* ── Section ──────────────────────────────────────────────────────────────── */
  .proc-section {
    padding: clamp(0rem, 0vw, 0rem) clamp(0rem, 5vw, 3rem);
    pointer-events: none;
    position: relative;
  }

  /* ── Header ──────────────────────────────────────────────────────────────── */
  .proc-header {
    margin-bottom: 0.1rem;
  }
  /* ── Desktop Graph ────────────────────────────────────────────────────────── */
  .proc-graph {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Each row is divided into 5 equal columns, matching the nodes */
  .proc-top-row,
  .proc-bot-row,
  .proc-nodes-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }

  .proc-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  /* ── Top row: min-height so content doesn't collapse ─────────────────────── */
  .proc-top-row {
    align-items: flex-end; /* push content to bottom of top row, near the line */
    min-height: 150px;
  }

  .proc-top-block {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 clamp(0.3rem, 1vw, 0.75rem);
    padding-bottom: clamp(0.75rem, 1.5vw, 1.25rem);
  }

  /* ── Bottom row ──────────────────────────────────────────────────────────── */
  .proc-bot-row {
    align-items: flex-start;
    min-height: clamp(140px, 16vw, 220px);
  }

  .proc-bot-block {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 clamp(0.3rem, 1vw, 0.75rem);
    padding-top: clamp(0.75rem, 1.5vw, 1.25rem);
  }

  /* ── Track (central horizontal line) ─────────────────────────────────────── */
  .proc-track-wrap {
    position: relative;
    height: 2px;
    margin: 0;
  }

  .proc-track-line {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      transparent,
      #ff192d 8%,
      #ff192d 70%,
      transparent
    );
  }

  /* Nodes row overlays the track line */
  .proc-nodes-row {
    position: absolute;
    inset: 0;
    transform: translateY(100%);
  }

  /* ── Node dot ─────────────────────────────────────────────────────────────── */
  .proc-node {
    width: clamp(0.9rem, 1.1vw, 1.15rem);
    height: clamp(0.9rem, 1.1vw, 1.15rem);
    border-radius: 50%;
    border: 1px solid #fafafa;
    background: #020d19;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 14px rgba(220, 70, 50, 0.5);
    position: relative;
    z-index: 2;
  }

  .proc-node-inner {
    width: 38%;
    height: 38%;
    border-radius: 50%;
    background: #ff192d;
  }

  /* ── Astronomical image + heading ─────────────────────────────────────────── */
  .proc-astro {
    gap: 0.35rem;
  }

  .proc-astro-img {
    width: clamp(60px, 6vw, 90px);
    height: clamp(60px, 6vw, 90px);
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(220, 70, 50, 0.4));
    border-radius: 50%;
  }

  .proc-astro-label {
    font: 600 clamp(0.58rem, 0.7vw, 0.72rem)/1.2 var(--sans, sans-serif);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fafafa;
    text-align: center;
  }

  /* ── Phase content card ───────────────────────────────────────────────────── */
  .proc-phase-card {
    border: 1px solid transparent;
    border-radius: 10px;

    background:
      linear-gradient(#020d19, #020d19) padding-box,
      linear-gradient(to right, #ff192d, #fafafa) border-box;

    color: #fafafa;

    backdrop-filter: blur(6px);
    padding: clamp(0.55rem, 1vw, 0.9rem) clamp(0.6rem, 1.2vw, 1.1rem);

    gap: 0.2rem;
    max-width: clamp(130px, 14vw, 195px);
  }

  /* ── Shared text tokens ───────────────────────────────────────────────────── */
  .proc-num {
    font: 700 clamp(0.6rem, 1vw, 0.7rem)/1 var(--sans, sans-serif);
    letter-spacing: 0.1em;
    color: #ff192d;
  }

  .proc-name {
    font: 700 clamp(0.68rem, 0.88vw, 0.84rem)/1.2 var(--sans, sans-serif);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fafafa;
  }

  .proc-desc {
    margin: 0;
    font: 400 clamp(0.58rem, 0.8vw, 0.9rem)/1.5 var(--sans, sans-serif);
    color: #fafafa;
  }

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

  .proc-mobile-node-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    margin-top: 0.3rem;
  }

  .proc-mobile-dot {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 2px solid #dc4632;
    background: #020d19;
    box-shadow: 0 0 8px rgba(220, 70, 50, 0.4);
    flex-shrink: 0;
  }

  .proc-mobile-track {
    width: 1.5px;
    flex: 1;
    min-height: 2.5rem;
    background: rgba(220, 70, 50, 0.3);
  }

  .proc-mobile-stage:last-child .proc-mobile-track {
    display: none;
  }

  .proc-mobile-card {
    background: rgba(2, 13, 25, 0.65);
    border: 1px solid rgba(241, 240, 235, 0.12);
    border-radius: 12px;
    backdrop-filter: blur(6px);
    padding: 0.8rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 1rem;
    flex: 1;
  }

  /* ── Mobile switch ────────────────────────────────────────────────────────── */
  @media (max-width: 430px) {
    .proc-graph {
      display: none;
    }
    .proc-mobile {
      display: flex;
    }
  }
</style>
