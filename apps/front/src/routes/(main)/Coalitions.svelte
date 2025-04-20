<script lang="ts">
  import { api } from '$lib/api';
  import { onMount } from 'svelte';
  import type { CoalitionItem } from './Coalition.svelte';
  import CoalitionComponent from './Coalition.svelte';
  let coalitions: CoalitionItem[] = [];

  onMount(() => {
    let interval: NodeJS.Timeout;

    setTimeout(() => {
      fetchCoalitions();
      interval = setInterval(
        () => {
          fetchCoalitions();
        },
        1000 * 60 * 30
      );
    }, 4000);

    return () => clearInterval(interval);
  });

  async function fetchCoalitions() {
    await api
      .get('/intra/coalitions')
      .then((res) => {
        let size = res.data.length;
        coalitions = res.data.map((coalition: CoalitionItem, index: number) => ({
          ...coalition,
          medal: 'medal' + (size - index) + '.svg'
        }));
        if (size === 3) {
          coalitions = [coalitions[0], coalitions[2], coalitions[1]]; // Podium
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex h-full flex-col items-center gap-8">
    <h1 class="text-[45px] font-black text-foreground">COALITIONS</h1>
    <div class="mx-auto grid h-full flex-grow grid-flow-col gap-8">
      {#each coalitions as coalition, index}
        <div class={coalitions.length === 3 && index != 1 ? 'translate-y-10' : ''}>
          <CoalitionComponent {coalition} />
        </div>
      {/each}
    </div>
  </div>
</div>
