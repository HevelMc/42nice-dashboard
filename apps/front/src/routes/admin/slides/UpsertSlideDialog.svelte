<script lang="ts">
  import { Button, Dialog, Input, Label, Textarea } from 'hevel-ui';
  import { api } from '$lib/api';
  import { onMount } from 'svelte';
  import type { Slide } from '$lib/api/slide';
  import { toast } from 'svelte-sonner';
  import { parseDate } from '@internationalized/date';
  import DatePickerRange from '$components/DatePickerRange.svelte';

  interface Props {
    open: boolean;
    id?: number;
    update: () => void;
  }

  let { open = $bindable(false), id, update }: Props = $props();

  let slide: Partial<Slide> = $state({
    title: '',
    description: '',
    image: '',
    startDate: '',
    endDate: ''
  });

  onMount(async () => {
    if (id) await api.get(`/slides/${id}`).then((res) => (slide = res.data));
  });

  async function save() {
    let request = id ? api.patch(`/slides/${id}`, slide) : api.post('/slides', slide);
    await request.then(() => {
      toast.success('Slide saved');
      open = false;
      update();
    });
  }

  function handleImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        slide.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<Dialog.Content class="max-h-screen overflow-y-auto">
  <Dialog.Title>
    {#if id}
      Edit slide
    {:else}
      Add slide
    {/if}
  </Dialog.Title>
  <form onsubmit={save} class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Label>
        Title
        <span class="text-red-500">*</span>
      </Label>
      <Input bind:value={slide.title} />
    </div>
    <div class="flex flex-col gap-2">
      <Label>Image</Label>
      <Input type="file" accept="image/*" onchange={handleImageChange} />
    </div>
    <div class="flex flex-col gap-2">
      <Label>Description</Label>
      <Textarea bind:value={slide.description} />
    </div>
    <div class="flex flex-col gap-2">
      <Label>
        Diffusion date
        <span class="text-red-500">*</span>
      </Label>
      <DatePickerRange
        bind:value={
          () => {
            if (!slide.startDate || !slide.endDate) return { start: undefined, end: undefined };
            return { start: parseDate(slide.startDate.split('T')[0]), end: parseDate(slide.endDate.split('T')[0]) };
          },
          (value) => {
            slide.startDate = value?.start?.toString();
            slide.endDate = value?.end?.toString();
          }
        }
      />
    </div>
    <Button type="submit" disabled={!slide.title || !slide.startDate || !slide.endDate}>Save</Button>
  </form>
</Dialog.Content>
