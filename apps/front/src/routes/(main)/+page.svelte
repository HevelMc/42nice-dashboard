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
  let showBarbate = $state(false);

  onMount(() => {
    fetchSlides();
    let interval = setInterval(async () => {
      await fetchSlides();
      showBarbate = Math.random() < 0.05;
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

<div class="relative h-screen">
  <img src="/background.png" alt="background" class="absolute inset-0 hidden h-full w-full object-cover dark:block" />
  <div class="absolute inset-0 bg-black opacity-0 dark:opacity-50"></div>

  <img
    src="barbate-wave.gif"
    class="absolute bottom-0 right-0 z-30 h-48 transition-all duration-1000 {showBarbate
      ? 'translate-y-0'
      : 'translate-y-[400px]'}"
    alt="barbate waving"
  />

  <div class="relative z-10 flex h-full flex-col">
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
</div>
