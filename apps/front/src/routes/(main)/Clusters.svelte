<script lang="ts">
  import { api } from '$lib/api';
  import { onMount } from 'svelte';

  let clusters: Record<string, { current: number; max: number; color: string }> = {
    c1: { current: 0, max: 48, color: 'text-[#2aabb3] dark:text-[#66F6FF]' },
    c2: { current: 0, max: 72, color: 'text-[#059759] dark:text-[#02B76A]' },
    c3: { current: 0, max: 12, color: 'text-[#d44545] dark:text-[#FF6666]' },
    c4: { current: 0, max: 12, color: 'text-[#f89c2a] dark:text-[#FFE766]' }
  };

  async function fetchClusters() {
    await api
      .get('/intra/clusters')
      .then((res) => {
        const data = res.data;

        for (const cluster in data) {
          clusters[cluster].current = data[cluster];
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onMount(() => {
    fetchClusters();

    setInterval(() => {
      fetchClusters();
    }, 1000 * 60);
  });
</script>

<div class="flex w-full flex-col items-center gap-4">
  <h1 class="text-3xl font-bold">Clusters</h1>

  <div class="flex w-full flex-col gap-4">
    {#each Object.entries(clusters) as [key, cluster]}
      <div class="my-auto flex items-center justify-center gap-x-3">
        <p class="text-4xl {cluster.color}">{key}</p>
        <div class="text-4xl text-foreground">
          <span class="font-bold">{cluster.current.toString().padStart(2, '0')}</span>
          <span class="text-muted-foreground">/</span>
          <span class="font-bold">{cluster.max}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
