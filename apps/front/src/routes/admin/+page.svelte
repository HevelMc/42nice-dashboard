<script>
  import { api } from '$lib/api';
  import { Input, Button, Card } from 'hevel-ui';
  import { SaveIcon } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  let motd = $state('');

  onMount(async () => {
    const res = await api.get('/motd');
    motd = res.data.content;
  });

  async function save() {
    await api
      .patch('/motd', {
        content: motd
      })
      .then((res) => {
        motd = res.data.content;
        toast.success('Message of the day saved');
      });
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Message of the day</Card.Title>
    <Card.Description>The message to display on the marquee.</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="flex gap-3">
      <Input bind:value={motd} />
      <Button class="items-center gap-2" onclick={save}>
        <SaveIcon class="size-5" />
        Save
      </Button>
    </div>
  </Card.Content>
</Card.Root>
