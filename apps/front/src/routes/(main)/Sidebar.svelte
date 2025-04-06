<script lang="ts">
  import Clusters from './Clusters.svelte';
  import Lines from './Lines.svelte';
</script>

<div class="flex h-full w-[21rem] shrink-0 flex-col justify-around border-r border-border py-8">
  <Clusters />
  <div class="w-full border-b border-border"></div>
  <Lines />
</div>
