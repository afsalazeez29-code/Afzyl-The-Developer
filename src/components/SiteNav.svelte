<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let open = false;
  let navEl: HTMLElement;
  let activeIndex = 0;

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "PLAYGROUND", href: "#PROJECTS" },
    { label: "PROJECTS", href: "#playground" },
    { label: "CONTACT", href: "#contact" },
  ];

  const close = () => {
    open = false;
  };

  function handleOutsideClick(event: MouseEvent) {
    if (!open) return;

    const target = event.target as Node;

    if (navEl && !navEl.contains(target)) {
      close();
    }
  }

  onMount(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  onDestroy(() => {
    // Nothing required here.
  });
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
  <span></span>
</button>

  {#if open}
  <nav
    class="mobile-menu"
    aria-label="Mobile navigation"
    on:click|stopPropagation
  >
    <!-- CLOSE BUTTON -->
    <button
      class="mobile-menu-close"
      type="button"
      aria-label="Close menu"
      on:click={close}
    >
      X
    </button>

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

    padding: 0.1rem clamp(0.7rem, 1.5vw, 1px) 0.1rem 0.2rem;

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
    width: clamp(35px, 3.5vw, 40px);
    height: clamp(35px, 3.5vw, 40px);

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
  margin-left: auto;
  display: none;

  align-items: center;
  justify-content: center;
  flex-direction: row;

  gap: 3px;

  width: 34px;
  height: 34px;

  padding: 0;

  background: rgba(41, 35, 35, 0.08);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 50%;

  cursor: pointer;

  color: #fafafa;

  flex: 0 0 auto;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  span {
    display: block;

    width: 3.5px;
    height: 3.5px;

    background: currentColor;

    border-radius: 50%;

    transition: transform 0.2s ease;
  }
}

.hamburger:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.35);
}

 /* ================================
   MOBILE MENU
   ================================ */

.mobile-menu {
  position: absolute;

  top: calc(100% + 10px);

  left: 0;
  right: 0;

  padding: 3rem 0.65rem 0.65rem;  
  display: flex;
  flex-direction: column;

  gap: 0.35rem;

  z-index: 99;

  background: #020d19;

  border: 1px solid transparent;

  border-radius: 16px;

  background:
    linear-gradient(#020d19, #020d19) padding-box,
    linear-gradient(to right, #fafafa, #e12e0f) border-box;

  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.25);
}
.mobile-menu-close {
  position: absolute;

  top: 0.65rem;
  right: 0.7rem;

  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: 1px solid rgba(250, 250, 250, 0.35);
  border-radius: 50%;

  background: transparent;

  color: #fafafa;

  font-family: Arial, sans-serif;
  font-size: 1.45rem;
  font-weight: 300;
  line-height: 1;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-close:hover {
  border-color: transparent;

  background:
    linear-gradient(#020d19, #020d19) padding-box,
    linear-gradient(to right, #fafafa, #e12e0f) border-box;

  transform: rotate(90deg);
}

.mobile-link {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 42px;

  padding: 0.7rem 1rem;

  margin: 0;

  border-radius: 10px;

  font-family: var(--sans);

  font-size: 0.82rem;

  font-weight: 500;

  letter-spacing: 0.03em;

  color: #fafafa;

  text-decoration: none;
  text-align: center;

  background: transparent;

  border: 1px solid transparent;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.mobile-link:hover {
  border: 1px solid transparent;

  border-radius: 10px;

  background:
    linear-gradient(#020d19, #020d19) padding-box,
    linear-gradient(to right, #fafafa, #e12e0f) border-box;

  color: #fafafa;
}
.mobile-link:active {
  border: 1px solid transparent;

  background:
    linear-gradient(#fafafa, #fafafa) padding-box,
    linear-gradient(to right, #fafafa, #e12e0f) border-box;

  color: #020d19;
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
      height: 32px;

      padding: 0px;
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
