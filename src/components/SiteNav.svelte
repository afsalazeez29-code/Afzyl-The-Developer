<script lang="ts">
  import { onDestroy } from "svelte";

  let open = false;
  let navEl: HTMLElement;
  let activeIndex = 0;

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "PLAYGROUND", href: "#PROJECTS" },
    { label: "PROJECTS", href: "#playground" },
    { label: "CONTACT", href: "#contact" },
  ];

  const close = () => (open = false);

  onDestroy(() => {});
</script>

<header bind:this={navEl} class:open aria-label="Main navigation">
  <!-- BRAND / PROFILE PILL -->
  <a
    class="brand profile-pill"
    href="https://github.com/afsalazeez29-code"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Afsal S Azeez GitHub Profile"
  >
    <img
      class="profile-avatar"
      src="/Portraits/Avatar.webp"
      alt="Afsal S Azeez"
    />
    <span class="profile-name">Afsal S Azeez</span>
  </a>

  <!-- DESKTOP NAV -->
  <nav class="nav-center" aria-label="Site navigation">
    {#each navItems as item, i}
      <a
        class="nav-link"
        class:nav-link--active={activeIndex === i}
        href={item.href}
        on:click={() => {
          activeIndex = i;
          close();
        }}
        aria-current={activeIndex === i ? "page" : undefined}
      >
        {item.label}
      </a>
    {/each}
  </nav>

  <!-- MOBILE HAMBURGER -->
  <button
    class="hamburger"
    type="button"
    aria-label={open ? "Close menu" : "Open menu"}
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
          on:click={() => {
            activeIndex = i;
            close();
          }}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  {/if}
</header>

<style lang="scss">
  header {
    position: fixed;
    top: clamp(10px, 2vw, 16px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;

    width: clamp(320px, 96vw, 1800px);
    height: clamp(40px, 4vw, 48px);

    display: flex;
    align-items: center;

    padding: 0;

    border-radius: 999px;

    background: transparent;

    border: 1.3px solid rgba(2, 13, 25, 0.55);

    box-shadow: none;
  }

  /* ================================
     BRAND / PROFILE
     ================================ */

  .brand.profile-pill {
    display: flex;
    align-items: center;

    gap: clamp(0.4rem, 1vw, 0.6rem);

    padding: 0.3rem clamp(0.7rem, 1.5vw, 1px) 0.3rem 0.3rem;

    background: rgba(41, 35, 35, 0.08);

    border: 1px solid rgba(255, 255, 255, 0.2);

    border-radius: 999px;

    font-family: var(--sans);
    font-size: clamp(0.78rem, 1vw, 0.92rem);
    font-weight: 500;

    color: #fafafa;

    text-decoration: none;

    flex: 0 0 auto;

    line-height: 1;

    transition:
      background 0.2s ease,
      border-color 0.2s ease;
  }

  .brand.profile-pill:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.35);
  }

  .profile-avatar {
    width: clamp(24px, 3.5vw, 40px);
    height: clamp(24px, 3.5vw, 40px);

    border-radius: 50%;

    object-fit: cover;

    margin-left: -1px;
  }

  .profile-name {
    margin-right: 0.2rem;
  }

  /* ================================
     DESKTOP NAVIGATION
     ================================ */

  .nav-center {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    flex: 1;

    margin-left: clamp(3rem, 8vw, 10rem);

    max-width: none;
  }

  /* ================================
     NAVIGATION LINKS
     ================================ */

  .nav-link {
    position: relative;

    display: inline-block;

    padding: 0.4rem clamp(0.65rem, 1vw, 0.95rem);

    font-family: var(--sans);

    font-size: clamp(0.68rem, 0.85vw, 0.8rem);

    font-weight: 500;

    letter-spacing: 0.03em;

    color: #fafafa;

    text-decoration: none;

    white-space: nowrap;

    transition:
      color 0.2s ease,
      opacity 0.2s ease;
  }

  /* Bottom-only animated underline */
  .nav-link::after {
    content: "";

    position: absolute;

    width: 100%;
    height: 2px;

    left: 0;
    bottom: -5px;

    background: linear-gradient(to right, #fafafa, #ff192d);

    transform: scaleX(0);

    transform-origin: left;

    transition: transform 0.2s ease-out;
  }

  /* Hover underline */
  .nav-link:hover::after {
    transform: scaleX(1);
  }

  /* Active navigation item */
  .nav-link--active {
    font-weight: 600;
    color: #fafafa;
  }

  /* ================================
     MOBILE HAMBURGER
     ================================ */

  .hamburger {
    display: none;

    flex-direction: column;

    gap: 5px;

    padding: 7px;

    background: none;

    border: 0;

    cursor: pointer;

    width: 34px;

    color: #fafafa;

    span {
      display: block;

      height: 1.5px;

      background: currentColor;

      border-radius: 2px;

      transition: transform 0.28s ease;
    }
  }

  /* ================================
     MOBILE MENU
     ================================ */

  .mobile-menu {
    position: absolute;

    top: calc(100% + 10px);

    left: 0;
    right: 0;

    border-radius: 20px;

    background: rgba(250, 250, 250, 0.96);

    backdrop-filter: blur(18px) saturate(140%);

    -webkit-backdrop-filter: blur(18px) saturate(140%);

    border: 1px solid rgba(255, 255, 255, 0.65);

    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.14);

    display: flex;

    flex-direction: column;

    padding: 0.7rem 0;

    z-index: 99;
  }

  .mobile-link {
    padding: 0.7rem 1.3rem;

    font-family: var(--sans);

    font-size: 0.86rem;

    font-weight: 500;

    letter-spacing: 0.03em;

    color: #fafafa;

    text-decoration: none;

    transition: background 0.15s ease;

    border-radius: 10px;

    margin: 0 0.35rem;

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }

  /* ================================
     RESPONSIVE
     ================================ */

  @media (max-width: 1200px) {
    header {
      width: calc(100vw - 3rem);

      height: 44px;
    }
  }

  @media (max-width: 900px) {
    header {
      width: calc(100vw - 2.5rem);

      height: 43px;
    }

    .nav-link {
      padding: 0.38rem 0.65rem;
    }
  }

  @media (max-width: 700px) {
    header {
      width: calc(100vw - 1.5rem);

      height: 42px;

      padding: 0 0.7rem;
    }

    .nav-center {
      display: none;
    }

    .hamburger {
      display: flex;
    }
  }

  @media (max-width: 400px) {
    header {
      width: calc(100vw - 1rem);

      height: 40px;

      padding: 0 0.6rem;
    }

    .brand {
      font-size: 0.76rem;
    }

    .hamburger {
      width: 32px;

      padding: 6px;
    }
  }

  @media (min-width: 701px) {
    .hamburger {
      display: none;
    }

    .mobile-menu {
      display: none;
    }
  }

  /* ================================
     REDUCED MOTION
     ================================ */

  @media (prefers-reduced-motion: reduce) {
    .nav-link::after {
      transition: none;
    }
  }
</style>
