<script lang="ts">
  import IconWaveStack, { type TechnologyIcon } from './IconWaveStack.svelte';

  const icons: TechnologyIcon[] = [
    { name: 'npm', src: '/color-icons/npm-original.svg' },
    { name: 'Ubuntu', src: '/color-icons/Ubuntu.svg' },
    { name: 'JWT', src: '/color-icons/jwt-icon.svg' },
    { name: 'Nginx', src: '/color-icons/nginx.svg' },
    { name: 'Antigravity', src: '/color-icons/antigravity-color.svg' },
    { name: 'Codex', src: '/color-icons/codex-color.svg' },
    { name: 'Claude Code', src: '/color-icons/claude-code.svg' },
    { name: 'Cursor', src: '/color-icons/cursor-ai-code-icon.svg' },
    { name: 'PM2', src: '/color-icons/pm2-original.svg' },
    { name: 'Docker', src: '/color-icons/docker-icon.svg' },
    { name: 'Neon', src: '/color-icons/neon-icon.svg' },
    { name: 'Postman', src: '/color-icons/postman-original.svg' },
    { name: 'Zod', src: '/color-icons/zod.svg' },
    { name: 'GitHub', src: '/color-icons/github-original.svg' }
  ];
</script>

<IconWaveStack title="DevOps, Backend & Developer Tools" titleId="gap-3-core-full-stack-title" {icons} />
