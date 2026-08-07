<script context="module" lang="ts">
  let scrollTriggerRegistered = false;

  export type TechnologyIcon = {
    name: string;
    src: string;
  };
</script>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let title = 'Core Full-Stack';
  export let titleId = 'core-full-stack-title';
  export let icons: TechnologyIcon[] = [];

  let section: HTMLElement;
  let list: HTMLUListElement;
  let floatingAnimation: gsap.core.Tween | undefined;
  let triggers: ScrollTrigger[] = [];
  let reduceMotion: MediaQueryList | undefined;

  const state = { phase: 0 };

  onMount(() => {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-bouncer]'));

    if (reduceMotion.matches || items.length === 0) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    if (!scrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRegistered = true;
    }

    let positions: number[] = [];
    let screenWidth = window.innerWidth;
    const setters = items.map((item) => gsap.quickSetter(item, 'y', 'px'));

    const measure = () => {
      const listRect = list.getBoundingClientRect();
      screenWidth = window.innerWidth || listRect.width || 1;
      positions = items.map((item) => {
        const itemRect = item.getBoundingClientRect();
        return itemRect.left - listRect.left + itemRect.width / 2;
      });
    };

    const updateWave = () => {
      items.forEach((_, index) => {
        const angle = ((positions[index] + state.phase) / screenWidth) * Math.PI * 2;
        setters[index](Math.sin(angle) * 24);
      });
    };

    const setInitialPositions = () => {
      measure();
      gsap.set(items, { x: 0, opacity: 1, force3D: true });
      updateWave();
    };

    const startFloatingAnimation = () => {
      floatingAnimation = gsap.to(state, {
        phase: screenWidth,
        duration: 7,
        ease: 'none',
        repeat: -1,
        onUpdate: updateWave
      });
    };

    const handleResize = () => {
      measure();
      if (floatingAnimation) {
        floatingAnimation.vars.phase = screenWidth;
      }
      updateWave();
      ScrollTrigger.refresh();
    };

    setInitialPositions();
    window.addEventListener('resize', handleResize);

    triggers = [
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => {
          if (floatingAnimation) {
            floatingAnimation.play();
          } else {
            startFloatingAnimation();
          }
        }
      }),
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => floatingAnimation?.play(),
        onLeave: () => floatingAnimation?.pause(),
        onEnterBack: () => floatingAnimation?.play(),
        onLeaveBack: () => floatingAnimation?.pause()
      })
    ];

    return () => {
      window.removeEventListener('resize', handleResize);
      floatingAnimation?.kill();
      triggers.forEach((trigger) => trigger.kill());
      gsap.set(items, { clearProps: 'transform,opacity' });
    };
  });

  onDestroy(() => {
    floatingAnimation?.kill();
    triggers.forEach((trigger) => trigger.kill());
  });
</script>

<section class="core-stack" bind:this={section} aria-labelledby={titleId}>
  <p class="eyebrow" id={titleId}>{title}</p>
  <ul class="icon-list" bind:this={list} aria-label={`${title} technologies`}>
    {#each icons as icon}
      <li data-bouncer>
        <span class="bouncer" translate="no">
          <img src={icon.src} alt={icon.name} loading="lazy" decoding="async" />
        </span>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  .core-stack {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    min-height: inherit;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: clamp(.9rem, 1.8vw, 1.4rem);
    padding: clamp(1.25rem, 3vw, 2.5rem) 0;
    color: #171717;
    background: #E9E7DF;
    overflow: hidden;
    pointer-events: none;
  }

  .eyebrow {
    margin: 0;
    color: rgba(23, 23, 23, .72);
    font: 600 clamp(.68rem, .8vw, .82rem)/1 var(--mono);
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .icon-list {
    width: min(100%, 1240px);
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: clamp(.3rem, .65vw, .55rem);
    list-style: none;
    will-change: transform;
  }

  .icon-list li {
    flex: 0 0 auto;
    list-style: none;
    opacity: 1;
    will-change: transform;
  }

  .bouncer {
    width: 98px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border: 1px solid rgba(17, 17, 17, .72);
    border-radius: 50%;
    background: #FBFBFB;
    box-shadow: 0 18px 42px rgba(17, 17, 17, .08);
    backface-visibility: hidden;
  }

  .bouncer img {
    display: block;
    width: 52%;
    height: 52%;
    object-fit: contain;
    user-select: none;
  }

  @media (max-width: 900px) {
    .core-stack {
      gap: 1rem;
      padding-inline: max(1rem, var(--gutter));
    }

    .icon-list {
      width: min(100%, 680px);
      overflow: visible;
    }

    .bouncer {
      width: clamp(2.65rem, 7vw, 4.4rem);
    }
  }

  @media (max-width: 600px) {
    .icon-list {
      gap: .25rem;
    }

    .bouncer {
      width: clamp(2rem, 6.7vw, 3.1rem);
      box-shadow: 0 10px 24px rgba(17, 17, 17, .07);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .icon-list li {
      transform: none !important;
    }
  }
</style>
