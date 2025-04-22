<script lang="ts">
  import { Carousel } from 'hevel-ui';
  import Autoplay from 'embla-carousel-autoplay';

  let { children } = $props();

  let api = $state<any>();
  let div = $state<HTMLDivElement>();

  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);

  function animate(emblaApi: any) {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    div?.animate([{ width: '0px' }, { width: '100%' }], {
      duration: autoplay.timeUntilNext(),
      easing: 'linear',
      fill: 'forwards'
    });
  }

  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;

      api.on('select', () => {
        current = api!.selectedScrollSnap() + 1;
      });

      animate(api);
      api.on('autoplay:timerset', animate);
      api.on('autoplay:timeout', animate);
    }
  });
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
  <Carousel.Root
    plugins={[
      Autoplay({
        delay: 10000,
        stopOnInteraction: false
      })
    ]}
    setApi={(emblaApi) => (api = emblaApi)}
    class="h-full w-full [&>*]:h-full"
  >
    <Carousel.Content class="mx-0 h-full w-full">
      {@render children?.()}
    </Carousel.Content>
  </Carousel.Root>

  <div class="flex items-center justify-center gap-2 py-4">
    {#each Array(count) as _, i (i)}
      <div class="relative h-2 w-24 overflow-hidden rounded-sm bg-muted-foreground">
        {#if current > i + 1}
          <div class="absolute h-full w-full rounded-sm bg-primary"></div>
        {/if}
        {#if current === i + 1}
          <div class="absolute h-full w-0 rounded-sm bg-primary" bind:this={div}></div>
        {/if}
      </div>
    {/each}
  </div>
</div>
