<script>
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
</script>

<div class="flex h-screen flex-col bg-background">
  <Header />
  <div class="flex h-full w-full">
    <Sidebar />
    <div class="flex h-full w-full flex-col gap-4"></div>
  </div>
</div>
