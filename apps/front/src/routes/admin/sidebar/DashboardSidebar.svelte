<script lang="ts">
  import { DropdownMenu, Sidebar } from 'hevel-ui';
  import { Ellipsis, ChevronUp } from 'lucide-svelte';
  import { contentFooterItems, contentItems } from './sidebarData';
  import { auth } from '$lib/auth';
</script>

<Sidebar.Root>
  <Sidebar.Header class="flex items-center justify-center py-4">
    <a href="/" class="flex items-center gap-4 text-xl font-semibold tracking-tight">
      <img src="/logo.svg" alt="logo" class="h-10" />
      Dashboard
    </a>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each contentItems as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton class="h-10 p-3 text-base">
                {#snippet child({ props })}
                  <a href={item.url} class="flex items-center gap-2" {...props}>
                    {#if item.icon}
                      <item.icon class="!size-5" />
                    {/if}
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton
                {...props}
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Ellipsis />
                <span>
                  {$auth!.user.fullName}
                </span>
                <ChevronUp class="ml-auto" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
            <Sidebar.Menu>
              {#each contentFooterItems as item (item.title)}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton>
                    {#snippet child({ props })}
                      <a href={item.url} {...props}>
                        {#if item.icon}
                          <item.icon />
                        {/if}
                        <span>{item.title}</span>
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
