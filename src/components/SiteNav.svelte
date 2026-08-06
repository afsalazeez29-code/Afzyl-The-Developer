<script lang="ts">
  let open = false;
  const close = () => (open = false);
</script>

<header class:open>
  <a class="mark" href="#top" aria-label="Afzyl — home" on:click={close}>AF.</a>
  <p class="availability"><span></span> Available for select projects</p>
  <nav aria-label="Main navigation">
    <a href="#work" on:click={close}>Work</a>
    <a href="#about" on:click={close}>About</a>
    <a href="#contact" on:click={close}>Contact</a>
  </nav>
  <button class="menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} on:click={() => (open = !open)}>
    <span></span><span></span>
  </button>
</header>

<style lang="scss">
  header { position: fixed; z-index: 50; inset: 0 0 auto; height: 78px; padding: 0 var(--gutter); display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; color: #f1f0eb; mix-blend-mode: difference; }
  .mark { font: 700 1rem/1 var(--sans); letter-spacing: -.04em; width: max-content; }
  .availability { justify-self: center; display: flex; align-items: center; gap: .6rem; margin: 0; font: 500 .68rem/1 var(--sans); text-transform: uppercase; letter-spacing: .12em; }
  .availability span { width: 6px; height: 6px; border-radius: 50%; background; currentColor; animation: pulse 2s ease-in-out infinite; }
  nav { justify-self: end; display: flex; gap: 2rem; font: 500 .72rem/1 var(--sans); text-transform: uppercase; letter-spacing: .11em; }
  nav a { position: relative; }
  nav a::after { content: ''; position: absolute; left: 0; right: 100%; bottom: -.45rem; height: 1px; background: currentColor; transition: right .35s ease; }
  nav a:hover::after { right: 0; }
  .menu { display: none; color: inherit; background: none; border: 0; }
  @keyframes pulse { 50% { opacity: .25; } }
  @media (max-width: 720px) {
    header { height: 64px; grid-template-columns: 1fr auto; }
    .availability { display: none; }
    .menu { display: grid; gap: 5px; width: 38px; padding: 10px; }
    .menu span { display: block; height: 1px; background: currentColor; transition: transform .3s; }
    nav { position: fixed; inset: 0; background: #28282B; color: #f1f0eb; flex-direction: column; justify-content: center; align-items: center; gap: 1.5rem; font-size: clamp(2.5rem, 12vw, 5rem); transform: translateY(-101%); transition: transform .5s cubic-bezier(.77,0,.18,1); mix-blend-mode: normal; }
    .open nav { transform: none; }
    .open .menu { z-index: 2; }
    .open .menu span:first-child { transform: translateY(3px) rotate(45deg); }
    .open .menu span:last-child { transform: translateY(-3px) rotate(-45deg); }
  }
  @media (prefers-reduced-motion: reduce) { .availability span { animation: none; } }
</style>
