<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import '../app.pcss';

  let { children } = $props();
</script>

<Toaster richColors />
{@render children()}
