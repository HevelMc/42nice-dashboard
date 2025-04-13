<script lang="ts">
  import { api } from '$lib/api';
  import { roles } from '$lib/api/user';
    import { isEmailValid } from '$lib/utils';
  import { Button, Dialog, Input, Label, Select } from 'hevel-ui';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  interface Props {
    open: boolean;
    id?: number;
    update: () => void;
  }

  let { open = $bindable(false), id, update }: Props = $props();

  let user: { id: number | undefined; login: string; email: string; password: string; role: string | undefined } = $state({
    id: undefined,
    login: '',
    email: '',
    password: '',
    role: undefined
  });

  onMount(async () => {
    console.log(id);
    if (id) await api.get(`/users/${id}`).then((res) => (user = res.data));
  });

  async function save() {
    console.log(user);
    let request = user?.id ? api.patch(`/users/${user.id}`, user) : api.post('/users', user);
    await request.then(() => {
      toast.success('User saved');
      open = false;
      update();
    });
  }
</script>

<Dialog.Content>
  <Dialog.Title class="pb-2">
    {user.id ? 'Edit user' : 'Create user'}
  </Dialog.Title>

  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Label>Login</Label>
      <Input bind:value={() => user?.login, (value) => (user.login = value)} />
    </div>

    <div class="flex flex-col gap-2">
      <Label>Email</Label>
      <Input bind:value={() => user?.email, (value) => (user.email = value)} />
    </div>

    <div class="flex flex-col gap-2">
      <Label>Password</Label>
      <Input bind:value={() => user?.password, (value) => (user.password = value)} />
      {#if user.id}
        <p class="text-sm text-muted-foreground">Leave blank to keep the same password</p>
      {/if}
    </div>

    <div class="flex flex-col gap-2">
      <Label>Role</Label>
      <Select.Root type="single" onValueChange={(value) => (user.role = value)} value={user.role}>
        <Select.Trigger>
          {@const role = roles.find((role) => role.value === user.role)}
          {#if role}
            <div class="flex items-center gap-2">
              <role.icon class="size-4" />
              {role.label}
            </div>
          {:else}
            Select role
          {/if}
        </Select.Trigger>
        <Select.Content>
          {#each roles as role}
            <Select.Item value={role.value} class="flex items-center gap-2">
              <role.icon class="size-4" />
              {role.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <Button onclick={save} disabled={!user.login || !isEmailValid(user.email) || !user.role}>Save</Button>
  </div>
</Dialog.Content>
