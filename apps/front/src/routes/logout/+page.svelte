<script lang="ts">
  import { auth } from '$lib/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    $auth = null;
    window.location.href = '/login';
  });
</script>
