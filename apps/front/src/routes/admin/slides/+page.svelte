<script lang="ts">
  import {
    AlertDialog,
    Badge,
    Button,
    Card,
    DataTable,
    Dialog,
    GenericActions,
    GenericCell,
    renderComponent,
    renderSnippet
  } from 'hevel-ui';
  import type { ColumnDef } from '@tanstack/table-core';
  import { TableQuery } from '$lib/utils';
  import { type Slide } from '$lib/api/slide';
  import { CircleOff, CircleOffIcon, Pencil, PlusIcon, XCircleIcon } from 'lucide-svelte';
  import { api } from '$lib/api';
  import { toast } from 'svelte-sonner';
  import UpsertSlideDialog from './UpsertSlideDialog.svelte';

  const columns: ColumnDef<Slide>[] = [
    {
      accessorKey: 'image',
      meta: { name: 'Image' },
      cell: ({ row }) => renderSnippet(SlideImage, row.original.image)
    },
    {
      accessorKey: 'title',
      meta: { name: 'Title' },
      cell: ({ row }) => row.original.title
    },
    {
      accessorKey: 'description',
      meta: { name: 'Description' },
      cell: ({ row }) => row.original.description
    },
    {
      accessorKey: 'startDate',
      meta: { name: 'Start date' },
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString('fr-FR')
    },
    {
      accessorKey: 'endDate',
      meta: { name: 'End date' },
      cell: ({ row }) => new Date(row.original.endDate).toLocaleDateString('fr-FR')
    },
    {
      accessorKey: 'status',
      meta: { name: 'Status' },
      cell: ({ row }) => renderSnippet(SlideStatus, { startDate: row.original.startDate, endDate: row.original.endDate })
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
                upsertSlideDialogId = row.original.id;
                upsertSlideDialogOpen = true;
              }
            },
            {
              label: 'Delete',
              icon: XCircleIcon,
              class: 'text-red-500 data-[highlighted]:text-red-400',
              handler: () => {
                deleteDialogSlide = row.original;
                deleteDialogOpen = true;
              }
            }
          ],
          row
        });
      }
    }
  ];

  let tableQuery = new TableQuery({ path: '/slides' });
  let table = $state<DataTable<any>>(null!);

  let upsertSlideDialogOpen = $state(false);
  let upsertSlideDialogId: number | undefined = $state(undefined);

  let deleteDialogSlide: Slide | undefined = $state(undefined);
  let deleteDialogOpen = $state(false);

  async function deleteSlide() {
    await api.delete(`/slides/${deleteDialogSlide?.id}`).then(() => {
      deleteDialogOpen = false;
      table.fetchData();
      toast.success('Slide deleted');
    });
  }
</script>

{#snippet SlideImage(image: string)}
  {#if image}
    <img src={image} alt="Slide" class="h-24 w-auto rounded-md" />
  {:else}
    <div class="flex h-24 w-24 items-center justify-center rounded-md bg-accent">
      <CircleOffIcon class="size-6 text-muted-foreground" />
    </div>
  {/if}
{/snippet}

{#snippet SlideStatus({ startDate, endDate }: { startDate: string; endDate: string })}
  {#if new Date(startDate) > new Date()}
    <Badge class="bg-blue-500/20 text-blue-500" variant="outline">Upcoming</Badge>
  {:else if new Date(endDate) < new Date()}
    <Badge class="bg-red-500/20 text-red-500" variant="outline">Ended</Badge>
  {:else}
    <Badge class="bg-green-500/20 text-green-500" variant="outline">Active</Badge>
  {/if}
{/snippet}

<Dialog.Root bind:open={upsertSlideDialogOpen}>
  {#key upsertSlideDialogId}
    <UpsertSlideDialog bind:open={upsertSlideDialogOpen} id={upsertSlideDialogId} update={table.fetchData} />
  {/key}
</Dialog.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  {#key deleteDialogSlide}
    <AlertDialog.Content>
      <AlertDialog.Title>Delete slide</AlertDialog.Title>
      <AlertDialog.Description>Are you sure you want to delete this slide?</AlertDialog.Description>
      <AlertDialog.Footer>
        <Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Cancel</Button>
        <Button variant="destructive" onclick={deleteSlide}>Delete</Button>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  {/key}
</AlertDialog.Root>

<Card.Root>
  <Card.Header>
    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col gap-2">
        <Card.Title>Slides</Card.Title>
        <Card.Description>Manage the custom slides.</Card.Description>
      </div>
      <Button
        size="sm"
        variant="outline"
        onclick={() => {
          upsertSlideDialogId = undefined;
          upsertSlideDialogOpen = true;
        }}
      >
        <PlusIcon class="size-4" />
        Add slide
      </Button>
    </div>
  </Card.Header>
  <Card.Content>
    <DataTable
      {columns}
      bind:this={table}
      searchPlaceholder="Search by title or description..."
      manualFiltering
      manualPagination
      manualSorting
      getData={async (params: any) => await tableQuery.queryTable(params)}
    />
  </Card.Content>
</Card.Root>
