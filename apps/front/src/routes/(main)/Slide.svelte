<script lang="ts">
  import type { Slide } from '$lib/api/slide';

  let { slide }: { slide: Slide } = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-12">
  {#if slide.image}
    <img src={slide.image} alt="slide" class="h-[512px] w-auto rounded-xl" />
  {/if}
  <div class="flex flex-col items-center justify-center gap-8">
    <h1 class="text-center text-5xl font-bold">{slide.title}</h1>
    {#if slide.description}
      <p class="text-center text-3xl">{slide.description}</p>
    {/if}
  </div>
</div>
