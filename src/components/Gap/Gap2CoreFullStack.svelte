<script lang="ts">
  import IconWaveStack, { type TechnologyIcon } from './IconWaveStack.svelte';

  const icons: TechnologyIcon[] = [
    { name: 'Tailwind CSS', src: '/color-icons/tailwindcss-original.svg' },
    { name: 'HTML5', src: '/color-icons/html5-original.svg' },
    { name: 'CSS3', src: '/color-icons/css3-original.svg' },
    { name: 'Axios', src: '/color-icons/axios-plain.svg' },
    { name: 'Framer', src: '/color-icons/framermotion-original.svg' },
    { name: 'Astro', src: '/color-icons/astro-original.svg' },
    { name: 'Figma', src: '/color-icons/figma-original.svg' },
    { name: 'Svelte', src: '/color-icons/svelte-original.svg' },
    { name: 'React Router', src: '/color-icons/reactrouter-original.svg' },
    { name: 'Cloudflare', src: '/color-icons/cloudflare-original.svg' },
    { name: 'Cloudinary', src: '/color-icons/cloudinary-icon.svg' },
    { name: 'Vercel', src: '/color-icons/vercel-original.svg' },
    { name: 'Bootstrap', src: '/color-icons/bootstrap-original.svg' },
    { name: 'Vite', src: '/color-icons/Vite.js.svg' }
  ];
</script>

<IconWaveStack title="Frontend & Modern Web" titleId="gap-2-core-full-stack-title" {icons} />
