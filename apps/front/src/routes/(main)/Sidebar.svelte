<script lang="ts">
  import Clusters from './Clusters.svelte';
  import Lines from './Lines.svelte';
</script>

<div class="flex h-full w-[21rem] shrink-0 flex-col justify-around border-r border-border py-8">
  <Clusters />
  <div class="w-full border-b border-border"></div>
  <Lines />
  <div class="w-full border-b border-border"></div>
  <h1 class="inline-flex w-full items-center justify-center gap-[6px] text-center text-xl text-foreground">
    <span class="normal-case">Made with ❤️ by</span>
    <img src="/cohort_logo.png" alt="logo" class="mb-1 h-5 object-cover object-center invert dark:invert-0" />
  </h1>
</div>
