<script lang="ts" module>
  export interface EventItem {
    id: string;
    name: string;
    type: string;
    begin: string;
    duration: number;
    location: string;
    reserved: number;
    max: number;
  }
</script>

<script lang="ts">
  import { Badge } from 'hevel-ui';
  import { Clock, MapPin } from 'lucide-svelte';

  const { name, type, begin, duration, location, reserved, max }: EventItem = $props();

  let color: string = $derived(getColor(type));
  let beginDate = $derived(new Date(begin));
  let date_day: string = $derived(beginDate.toLocaleString('en-US', { weekday: 'short' }) + ' ' + beginDate.getDate());
  let date_month: string = $derived(beginDate.toLocaleString('en-US', { month: 'long' }));
  let date_time: string = $derived(beginDate.toLocaleString('fr-US', { hour: 'numeric', minute: 'numeric' }));

  function getColor(type: string) {
    if (type === 'association') return '#22C55F';
    if (type === 'extern') return '#FAFAFA';
    if (type === 'challenge') return '#548ff3';
    if (type === 'exam') return '#f55556';
    return '#FAFAFA';
  }
</script>

<div class="flex h-[110px] rounded-xl border-2 bg-background" style="border-color: {color}">
  <div class="w-[90px] flex-none flex-col rounded-l-[0.5rem] p-2" style="background-color: {color}">
    <p class="my-auto text-[20px] text-black">{date_day}</p>
    <p class="text-[14px] text-black">{date_month}</p>
    <p class="my-auto mt-3 text-[16px] text-black">{date_time}</p>
  </div>
  <div class="relative flex flex-grow flex-col">
    <div class="grid grid-cols-4 p-1">
      <p class="mx-1 my-auto truncate text-[14px] font-bold" style="color: {color}">
        {type?.capitalize()}
      </p>
      <div class="mx-1 flex items-center gap-1">
        <Clock class="h-4 w-4 shrink-0" style="color: {color}" />
        <p class="my-auto truncate text-[14px]" style="color: {color}">{duration / 60} hours</p>
      </div>
      <div class="col-span-2 mx-1 flex items-center gap-1">
        <MapPin class="h-4 w-4 shrink-0" style="color: {color}" />
        <p class="my-auto truncate text-[14px]" style="color: {color}">{location}</p>
      </div>
    </div>
    <p class="mx-2 line-clamp-2 text-left text-[14px] text-foreground">{name?.capitalize()}</p>
    <div class="absolute bottom-0 right-0 m-1">
      <Badge class="rounded-lg text-foreground" variant="secondary">
        {reserved} / {max ?? '∞'}
      </Badge>
    </div>
  </div>
</div>
