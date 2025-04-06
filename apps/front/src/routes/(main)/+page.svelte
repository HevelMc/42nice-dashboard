<script>
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  import Carousel from './Carousel.svelte';
  import { toggleMode } from 'mode-watcher';
  import Events from './Events.svelte';
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
    <div class="flex h-full w-full flex-col gap-4">
      <Carousel items={[Events]} />
    </div>
  </div>
</div>
