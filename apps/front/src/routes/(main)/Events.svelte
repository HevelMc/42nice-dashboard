<script lang="ts">
  import { api } from '$lib/api';
  import { onMount } from 'svelte';
  import EventComponent from './Event.svelte';
  import type { EventItem } from './Event.svelte';

  let events: EventItem[] = [];
  let exams: EventItem[] = [];

  onMount(() => {
    setTimeout(() => {
      fetchEvents();
      let interval: NodeJS.Timeout;

      interval = setInterval(
        () => {
          fetchEvents();
        },
        1000 * 60 * 30
      );

      return () => clearInterval(interval);
    }, 2000);
  });

  async function fetchEvents() {
    await api
      .get('/intra/events')
      .then((res) => {
        events = res.data.filter((event: any) => event.type !== 'exam');
        exams = res.data.filter((event: any) => event.type === 'exam');
      })
      .catch((err) => {
        console.error(err);
      });
  }
</script>

{#snippet Column(type: string, events: any[])}
  <div class="flex h-full flex-col items-center">
    <p class="mb-4 text-[30px] font-black text-foreground">
      {#if type === 'event'}
        UPCOMING EVENTS
      {:else}
        UPCOMING EXAMS
      {/if}
    </p>
    <div class="bg-dark-background flex h-full w-[500px] flex-col gap-3 rounded-xl p-2">
      {#if events?.length > 0}
        {#each events.slice(0, 5) as event (event.id)}
          <EventComponent {...event} />
        {/each}
        {#each Array(Math.max(5 - events.length, 0)) as _, n}
          <div class="h-[110px] rounded-xl bg-accent"></div>
        {/each}
      {:else}
        <div class="my-auto py-8">
          {#if type === 'event'}
            <img class="m-auto h-36" src="/no_event.png" alt="No event" />
          {:else}
            <img class="m-auto h-36" src="/no_exam.png" alt="No exam" />
          {/if}
          <p class="mx-16 mt-8 text-center text-[30px] leading-tight text-foreground">
            {#if type === 'event'}
              No events scheduled
            {:else}
              No exams scheduled
            {/if}
          </p>
        </div>
      {/if}
    </div>
  </div>
{/snippet}

<div class="grid scale-125 grid-cols-2">
  {@render Column('event', events)}
  {@render Column('exam', exams)}
</div>
