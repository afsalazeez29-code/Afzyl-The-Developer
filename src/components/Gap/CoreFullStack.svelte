<script lang="ts">
  import IconWaveStack, { type TechnologyIcon } from './IconWaveStack.svelte';

  const icons: TechnologyIcon[] = [
    { name: 'TypeScript', src: '/color-icons/typescript-original.svg' },
    { name: 'JavaScript', src: '/color-icons/javascript-original.svg' },
    { name: 'Python', src: '/color-icons/python-original.svg' },
    { name: 'React', src: '/color-icons/react-original.svg' },
    { name: 'Next.js', src: '/color-icons/nextjs-original.svg' },
    { name: 'Node.js', src: '/color-icons/nodejs-icon-svgrepo-com.svg' },
    { name: 'Express', src: '/color-icons/express-original.svg' },
    { name: 'PostgreSQL', src: '/color-icons/postgresql-original.svg' },
    { name: 'Prisma', src: '/color-icons/prisma-original.svg' },
    { name: 'MongoDB', src: '/color-icons/mongodb-original.svg' },
    { name: 'AWS', src: '/color-icons/amazonwebservices-original-wordmark.svg' },
    { name: 'Git', src: '/color-icons/git-original.svg' },
    { name: 'GSAP', src: '/color-icons/gsap%20(1).svg' },
    { name: 'Three.js', src: '/color-icons/threejs-original.svg' }
  ];
</script>

<IconWaveStack title="Core Full-Stack Development" titleId="core-full-stack-title" {icons} />
