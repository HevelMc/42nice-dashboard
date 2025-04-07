<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/auth';
  import { Separator, Sidebar } from 'hevel-ui';
  import MenuNavbar from './sidebar/DashboardSidebar.svelte';

  onMount(() => {
    if ($auth === null) goto('/login');
  });

  let { children } = $props();
</script>

{#if $auth !== null}
  <Sidebar.Provider>
    <MenuNavbar />
    <Sidebar.Inset>
      <header class="flex h-16 shrink-0 items-center gap-4 border-b px-4">
        <Sidebar.Trigger />
        <Separator orientation="vertical" class="mr-2 h-4" />
      </header>
      <main class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        {@render children?.()}
      </main>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
