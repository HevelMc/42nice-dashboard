<script lang="ts">
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  import Carousel from './Carousel.svelte';
  import { toggleMode } from 'mode-watcher';
  import Events from './Events.svelte';
  import Coalitions from './Coalitions.svelte';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import type { Slide } from '$lib/api/slide';
  import SlideComponent from './Slide.svelte';
  import CarouselItem from './CarouselItem.svelte';

  let slides: Slide[] = $state([]);
  let loading = $state(true);

  onMount(() => {
    fetchSlides();
    let interval = setInterval(async () => {
      await fetchSlides();
    }, 10000);

    return () => clearInterval(interval);
  });

  async function fetchSlides() {
    await api.get('/slides/current').then((res) => {
      slides = res.data;
      loading = false;
    });
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'd') toggleMode();
  }}
/>

<div class="flex h-screen flex-col bg-background">
  <Header />
  <div class="flex h-full w-full">
    <Sidebar />
    {#if !loading}
      <div class="flex h-full w-full flex-col gap-4">
        {#key slides.length}
          <Carousel>
            {#each slides as slide}
              <CarouselItem>
                <SlideComponent {slide} />
              </CarouselItem>
            {/each}
            <CarouselItem>
              <Events />
            </CarouselItem>
            <CarouselItem>
              <Coalitions />
            </CarouselItem>
          </Carousel>
        {/key}
      </div>
    {/if}
  </div>
</div>
