<script>
  import Marquee from 'svelte-fast-marquee';
</script>

<nav class="flex h-24 w-full shrink-0 items-center gap-8 border-b border-border px-8">
  <img src="/logo.svg" alt="logo" class="h-12 invert dark:invert-0" />
  <div class="w-full">
    <Marquee pauseOnHover={true} speed={30} gradient={true} style="--gradientColor: hsl(var(--background));">
      <span class="text-3xl text-foreground">Hello world 42 Nice</span>
    </Marquee>
  </div>
  <span class="text-4xl text-foreground">
    {new Date().toLocaleTimeString('fr-FR').slice(0, 5)}
  </span>
</nav>

<style>
  :global(.gradient::before) {
    left: -20px !important;
  }
  :global(.gradient::after) {
    right: -20px !important;
  }
</style>
