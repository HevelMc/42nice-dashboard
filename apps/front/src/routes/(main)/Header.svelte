<script lang="ts">
  import { api } from '$lib/api';
  import { onMount } from 'svelte';
  import Marquee from 'svelte-fast-marquee';

  let motd = $state('');

  onMount(() => {
    let interval: NodeJS.Timeout;

    fetchMotd();
    interval = setInterval(() => {
      fetchMotd();
    }, 1000 * 10);

    return () => clearInterval(interval);
  });

  async function fetchMotd() {
    const res = await api.get('/motd');
    motd = res.data.content;
  }
</script>

<nav class="flex h-24 w-full shrink-0 items-center gap-8 border-b border-border px-8">
  <img src="/logo.svg" alt="logo" class="h-12 invert dark:invert-0" />
  <div class="w-full">
    <Marquee pauseOnHover={true} speed={30} gradient={true} style="--gradientColor: hsl(var(--background));">
      <span class="text-3xl text-foreground">{motd}</span>
    </Marquee>
  </div>
  <h1 class="text-4xl text-foreground">
    {new Date().toLocaleTimeString('fr-FR').slice(0, 5)}
  </h1>
</nav>

<style>
  :global(.gradient::before) {
    left: -20px !important;
  }
  :global(.gradient::after) {
    right: -20px !important;
  }
</style>
