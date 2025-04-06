<script lang="ts" module>
  export interface Line {
    number: string;
    transportMode: string;
    color: string;
    times: Record<string, LineTime[]>;
  }

  export interface LineTime {
    direction: string;
    eta: number;
    eta_hour: string;
    realtime: boolean;
  }
</script>

<script lang="ts">
  function formatName(name: string): string {
    if (name.includes('Saint-Isidore')) return 'St-Isidore';
    if (name.includes('Port Lympia')) return 'Port Lympia';
    if (name.includes('STAPS')) return 'STAPS';
    if (name.includes('CADAM')) return 'CADAM';
    return name;
  }

  let { number, transportMode, color, times }: Line = $props();
</script>

<div class="my-2 flex h-full min-h-[60px] flex-col items-center gap-4">
  <div class="flex rounded-full p-[3px]" style="background-color: #{color}">
    <img src={`/${transportMode}.svg`} alt="icon" class="mx-[4px] my-[2px] h-[18px] w-[18px]" />
    <div class="ml-1 flex items-center rounded-full bg-white">
      <p class="mx-2 text-[12px] text-black">{number}</p>
    </div>
  </div>
  <div class="flex h-full flex-col items-center justify-center gap-2">
    {#each Object.entries(times) as [direction, timeList]}
      <div class="flex flex-row items-center gap-2">
        <p class="text-[12px] text-white">{formatName(direction)}</p>
        {#each timeList.slice(0, 2) as time}
          <div class="flex items-center gap-1 rounded-sm bg-accent px-1">
            {#if time.realtime}
              <img src="/rt.gif" alt="real_time" class="h-3 w-auto" />
              {#if time.eta > 1}
                <p class="text-[12px] text-[#02B76A]">{time.eta}</p>
                <p class="mt-1 text-[8px] text-muted-foreground">min</p>
              {:else}
                <p class="my-0.5 text-[10px] text-[#02B76A]">En approche</p>
              {/if}
            {:else}
              <p class="text-[12px] text-muted-foreground">{time.eta_hour}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
    {#if Object.keys(times).length === 0}
      <div class="flex flex-col items-center">
        <p class="mx-2 text-center text-[12px] text-white">Hors Service</p>
        <p class="mx-2 text-center text-[12px] text-white">Commercial</p>
      </div>
    {/if}
  </div>
</div>
