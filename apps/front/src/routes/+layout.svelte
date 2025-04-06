<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.pcss';

  let { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher defaultMode={'dark'} />
{@render children()}
