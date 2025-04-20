<script lang="ts">
  import { api } from '$lib/api';
  import { onMount } from 'svelte';
  import Marquee from 'svelte-fast-marquee';

  let motd = $state('');
  let weather: { temperature_2m: number; weather_code: number; is_day: number } | null = $state(null);

  onMount(() => {
    let interval: NodeJS.Timeout;

    fetchMotd();
    fetchWeather();
    interval = setInterval(() => {
      fetchMotd();
      fetchWeather();
    }, 1000 * 10);

    return () => clearInterval(interval);
  });

  async function fetchMotd() {
    const res = await api.get('/motd');
    motd = res.data.content;
  }

  async function fetchWeather() {
    const res = await api.get('/weather');
    weather = res.data;
  }
</script>

<nav class="flex h-24 w-full shrink-0 items-center gap-8 border-b border-border px-8">
  <img src="/logo.svg" alt="logo" class="h-12 invert dark:invert-0" />
  <div class="w-full">
    <Marquee pauseOnHover={true} speed={30} gradient={true} style="--gradientColor: hsl(var(--background));">
      <span class="text-3xl text-foreground">{motd}</span>
    </Marquee>
  </div>
  <h1 class="inline-flex shrink-0 items-center gap-1 text-4xl text-foreground">
    <span class="text-3xl">{new Date().toLocaleTimeString('fr-FR').slice(0, 5)}</span>

    {#if weather}
      <span>・</span>

      <div class="flex items-center">
        <span class="text-3xl">
          {weather.temperature_2m}°C
        </span>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather_code.toString().padStart(2, '0')}${weather.is_day ? 'd' : 'n'}@2x.png`}
          class="h-16 w-16 shrink-0"
          alt="weather"
        />
      </div>
    {/if}
  </h1>
</nav>

<style>
  :global(.gradient::before) {
    left: -20px !important;
  }
  :global(.gradient::after) {
    right: -20px !important;
  }
</style>
