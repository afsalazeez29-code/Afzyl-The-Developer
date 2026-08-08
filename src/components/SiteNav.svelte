<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let open = false;
  let navEl: HTMLElement;
  let pillEl: HTMLDivElement;
  let activeIndex = 0;

  const navItems = [
    { label: 'Home',       href: '#home' },
    { label: 'Playground', href: '#playground' },
    { label: 'Process',    href: '#process' },
    { label: 'Contact',    href: '#contact' },
  ];

  const close = () => (open = false);

  // Pill sliding state
  let pillStyle = '';
  let links: HTMLAnchorElement[] = [];

  function movePillTo(el: HTMLAnchorElement) {
    if (!el || !navEl) return;
    const navRect = navEl.querySelector('.nav-center')?.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (!navRect) return;
    pillStyle = `left:${elRect.left - navRect.left}px;width:${elRect.width}px;`;
  }

  function onLinkEnter(i: number) {
    if (links[i]) movePillTo(links[i]);
  }

  function onNavLeave() {
    if (links[activeIndex]) movePillTo(links[activeIndex]);
  }

  onMount(() => {
    // Register ScrollTrigger only for navbar show/hide — no touching existing timelines
    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Start hidden
        gsap.set(navEl, { autoAlpha: 0, y: -20 });

        ScrollTrigger.create({
          start: '80px top',
          onEnter: () => gsap.to(navEl, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(navEl, { autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.in' }),
        });

        // Set initial pill on active item
        setTimeout(() => {
          if (links[activeIndex]) movePillTo(links[activeIndex]);
        }, 100);
      });
    });
  });

  onDestroy(() => {});
</script>

<header bind:this={navEl} class:open aria-label="Main navigation">

  <!-- BRAND -->
  <a class="brand" href="#home" on:click={close} aria-label="Afzyl Dev — home">
    <span class="brand-name">Afzyl</span><span class="brand-suffix">_Dev</span>
  </a>

  <!-- DESKTOP NAV -->
  <nav class="nav-center" aria-label="Site navigation" on:mouseleave={onNavLeave}>
    <!-- sliding pill highlight -->
    <div class="nav-pill" style={pillStyle} aria-hidden="true"></div>
    {#each navItems as item, i}
      <a
        class="nav-link"
        class:nav-link--active={activeIndex === i}
        href={item.href}
        bind:this={links[i]}
        on:mouseenter={() => onLinkEnter(i)}
        on:click={() => { activeIndex = i; close(); }}
        aria-current={activeIndex === i ? 'page' : undefined}
      >{item.label}</a>
    {/each}
  </nav>

  <!-- MOBILE HAMBURGER -->
  <button
    class="hamburger"
    type="button"
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    on:click={() => (open = !open)}
  >
    <span></span>
    <span></span>
  </button>

  <!-- MOBILE DROPDOWN -->
  {#if open}
    <nav class="mobile-menu" aria-label="Mobile navigation">
      {#each navItems as item, i}
        <a
          class="mobile-link"
          href={item.href}
          on:click={() => { activeIndex = i; close(); }}
        >{item.label}</a>
      {/each}
    </nav>
  {/if}

</header>

<style lang="scss">
  header {
    position: fixed;
    top: clamp(16px, 2.4vw, 26px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;

    width: clamp(320px, 80vw, 820px);
    height: clamp(52px, 6vw, 64px);

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(1rem, 2.5vw, 1.6rem);

    border-radius: 999px;

    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.96) 0%,
      rgba(250,250,250,0.84) 45%,
      rgba(245,245,245,0.78) 100%
    );
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border: 1px solid rgba(255,255,255,0.55);
    box-shadow:
      0 10px 35px rgba(0,0,0,0.16),
      inset 0 1px 0 rgba(255,255,255,0.7);
  }

  /* BRAND */
  .brand {
    font-family: var(--sans);
    font-size: clamp(0.82rem, 1.2vw, 0.95rem);
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #111111;
    text-decoration: none;
    flex: 0 0 auto;
    line-height: 1;
  }

  .brand-name {
    font-weight: 600;
  }

  .brand-suffix {
    font-weight: 400;
    opacity: 0.7;
  }

  /* DESKTOP NAV */
  .nav-center {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
  }

  .nav-pill {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: calc(100% + 10px);
    background: rgba(0,0,0,0.07);
    border-radius: 999px;
    transition: left 0.2s ease-out, width 0.2s ease-out;
    pointer-events: none;
    backdrop-filter: blur(4px);
  }

  .nav-link {
    position: relative;
    z-index: 1;
    padding: 0.45rem 0.85rem;
    font-family: var(--sans);
    font-size: clamp(0.72rem, 1vw, 0.82rem);
    font-weight: 500;
    letter-spacing: 0.03em;
    color: #020D19;
    text-decoration: none;
    border-radius: 999px;
    transition: color 0.15s ease;
    white-space: nowrap;
  }

  .nav-link--active {
    font-weight: 600;
    color: #020D19;
  }

  /* MOBILE */
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 8px;
    background: none;
    border: 0;
    cursor: pointer;
    width: 36px;
    color: #020D19;

    span {
      display: block;
      height: 1.5px;
      background: currentColor;
      border-radius: 2px;
      transition: transform 0.28s ease;
    }
  }

  .mobile-menu {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    border-radius: 20px;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.97) 0%,
      rgba(248,248,248,0.93) 100%
    );
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border: 1px solid rgba(255,255,255,0.55);
    box-shadow: 0 10px 35px rgba(0,0,0,0.14);
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0;
    z-index: 99;
  }

  .mobile-link {
    padding: 0.75rem 1.4rem;
    font-family: var(--sans);
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: #020D19;
    text-decoration: none;
    transition: background 0.15s ease;
    border-radius: 10px;
    margin: 0 0.4rem;

    &:hover {
      background: rgba(0,0,0,0.06);
    }
  }

  @media (max-width: 700px) {
    header {
      width: calc(100vw - 2rem);
      height: 52px;
    }

    .nav-center {
      display: none;
    }

    .hamburger {
      display: flex;
    }
  }

  @media (min-width: 701px) {
    .hamburger { display: none; }
    .mobile-menu { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-pill { transition: none; }
  }
</style>
