<script lang="ts">
  import { Carousel } from 'hevel-ui';
  import Autoplay from 'embla-carousel-autoplay';
  import type { Component } from 'svelte';

  let { items }: { items: Component[] } = $props();

  let api = $state<any>();

  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);

  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;
      api.on('select', () => {
        current = api!.selectedScrollSnap() + 1;
      });
    }
  });
</script>

{#snippet Item(Item: Component)}
  <Carousel.Item class="h-full w-full p-0">
    <div class="flex h-full items-center justify-center p-6">
      <Item />
    </div>
  </Carousel.Item>
{/snippet}

<div class="flex h-full w-full flex-col gap-4 p-4">
  <Carousel.Root
    plugins={[
      Autoplay({
        delay: 10000
      })
    ]}
    setApi={(emblaApi) => (api = emblaApi)}
    class="h-full w-full [&>*]:h-full"
  >
    <Carousel.Content class="mx-0 h-full w-full">
      {#each items as item}
        {@render Item(item)}
      {/each}
    </Carousel.Content>
  </Carousel.Root>
  <div class="flex items-center justify-center gap-2 py-4">
    {#each Array(count) as _, i (i)}
      <div class="h-2 w-2 rounded-full {current === i + 1 ? 'bg-primary' : 'bg-muted-foreground'}"></div>
    {/each}
  </div>
</div>
