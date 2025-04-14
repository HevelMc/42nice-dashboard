<script lang="ts">
  import type { DateRange } from 'bits-ui';
  import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
  import { CalendarIcon } from 'lucide-svelte';
  import { buttonVariants, cn, Popover, RangeCalendar } from 'hevel-ui';

  interface Props {
    value: DateRange;
  }

  let { value = $bindable() }: Props = $props();

  const df = new DateFormatter('en-US', { dateStyle: 'medium' });

  let startValue: DateValue | undefined = $state(undefined);
</script>

<div class="grid gap-2">
  <Popover.Root>
    <Popover.Trigger
      class={cn(
        buttonVariants({ variant: 'outline' }),
        !value.start && !startValue && 'text-muted-foreground',
        'justify-start'
      )}
    >
      <CalendarIcon class="mr-2 size-4" />
      {#if value && value.start}
        {#if value.end}
          {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(value.end.toDate(getLocalTimeZone()))}
        {:else}
          {df.format(value.start.toDate(getLocalTimeZone()))}
        {/if}
      {:else if startValue}
        {df.format(startValue.toDate(getLocalTimeZone()))}
      {:else}
        Select a period
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value
        onStartValueChange={(v: DateValue) => {
          startValue = v;
        }}
        numberOfMonths={2}
      />
    </Popover.Content>
  </Popover.Root>
</div>
