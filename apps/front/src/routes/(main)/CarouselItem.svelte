<script lang="ts">
  import { Carousel } from 'hevel-ui';

  let { children } = $props();
</script>

<Carousel.Item class="h-full w-full p-0">
  <div class="flex h-full items-center justify-center p-6">
    {@render children?.()}
  </div>
</Carousel.Item>
