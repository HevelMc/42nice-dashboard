<script lang="ts">
  import { onMount } from 'svelte';
  import LineComponent, { type Line } from './Line.svelte';
  import { api } from '$lib/api';

  let lines: Line[] = [];

  function fetchLines() {
    api
      .get('/lines')
      .then((res) => {
        lines = res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onMount(() => {
    fetchLines();

    const interval = setInterval(() => {
      fetchLines();
    }, 10000);

    return () => clearInterval(interval);
  });
</script>

<div class="flex w-full flex-col items-center gap-4 pb-8">
  <h1 class="text-3xl font-bold">Trams & Bus</h1>

  <div class="flex flex-col gap-4">
    {#each lines as line}
      <LineComponent {...line} />
    {/each}
  </div>
</div>
