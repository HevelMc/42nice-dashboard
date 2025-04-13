<script lang="ts">
  import { AlertDialog, Button, Card, DataTable, Dialog, GenericActions, GenericCell, renderComponent } from 'hevel-ui';
  import type { ColumnDef } from '@tanstack/table-core';
  import { TableQuery } from '$lib/utils';
  import { type User, roles } from '$lib/api/user';
  import { Pencil, PlusIcon, XCircleIcon } from 'lucide-svelte';
  import UpsertUserDialog from './UpsertUserDialog.svelte';
  import { api } from '$lib/api';
    import { toast } from 'svelte-sonner';
    import { auth } from '$lib/auth';

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'fullName',
      meta: { name: 'Full name' },
      cell: ({ row }) => row.original.fullName
    },
    {
      accessorKey: 'email',
      meta: { name: 'Email' },
      cell: ({ row }) => row.original.email
    },
    {
      accessorKey: 'role',
      meta: { name: 'Role' },
      cell: ({ row }) => renderComponent(GenericCell, { value: row.original.role, options: roles })
    },
    {
      accessorKey: 'createdAt',
      meta: { name: 'Creation date' },
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('fr')
    },
    {
      accessorKey: 'actions',
      header: '',
      meta: { name: 'Actions' },
      cell: ({ row }) => {
        return renderComponent(GenericActions, {
          actions: [
            {
              label: 'Edit',
              icon: Pencil,
              handler: () => {
                upsertUserDialogId = row.original.id;
                upsertUserDialogOpen = true;
              }
            },
            ...(row.original.id !==  $auth!.user.id ? [{
              label: 'Delete',
              icon: XCircleIcon,
              class: 'text-red-500 data-[highlighted]:text-red-400',
              handler: async (row: any) => {
                deleteDialogUser = row.original;
                deleteDialogOpen = true;
              }
            }] : [])
          ],
          row
        });
      }
    }
  ];

  let tableQuery = new TableQuery({ path: '/users' });
  let table = $state<DataTable<any>>(null!);

  let upsertUserDialogOpen = $state(false);
  let upsertUserDialogId: number | undefined = $state(undefined);

  let deleteDialogUser: User | undefined = $state(undefined);
  let deleteDialogOpen = $state(false);

  async function deleteUser() {
    await api.delete(`/users/${deleteDialogUser?.id}`).then(() => {
      deleteDialogOpen = false;
      table.fetchData();
      toast.success('User deleted');
    });
  }
</script>

<Dialog.Root bind:open={upsertUserDialogOpen}>
  {#key upsertUserDialogId}
    <UpsertUserDialog bind:open={upsertUserDialogOpen} id={upsertUserDialogId} update={table.fetchData} />
  {/key}
</Dialog.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  {#key deleteDialogUser}
    <AlertDialog.Content>
      <AlertDialog.Title>Delete user</AlertDialog.Title>
      <AlertDialog.Description>Are you sure you want to delete this user?</AlertDialog.Description>
      <AlertDialog.Footer>
        <Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Cancel</Button>
        <Button variant="destructive" onclick={deleteUser}>Delete</Button>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  {/key}
</AlertDialog.Root>

<Card.Root>
  <Card.Header>
    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col gap-2">
        <Card.Title>Users</Card.Title>
        <Card.Description>Manage who can access the admin panel, and their roles.</Card.Description>
      </div>
      <Button size="sm" variant="outline" onclick={() => {
        upsertUserDialogOpen = true;
        upsertUserDialogId = undefined;
      }}>
        <PlusIcon class="size-4" />
        Add user
      </Button>
    </div>
  </Card.Header>
  <Card.Content>
    <DataTable
      {columns}
      bind:this={table}
      manualFiltering
      manualPagination
      manualSorting
      getData={async (params: any) => await tableQuery.queryTable(params)}
      filters={{
        role: roles
      }}
    />
  </Card.Content>
</Card.Root>
