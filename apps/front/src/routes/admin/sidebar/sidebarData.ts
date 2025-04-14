import { auth } from '$lib/auth';
import { get } from 'svelte/store';
import { GalleryThumbnailsIcon, House, Icon, LogOut, Users } from 'lucide-svelte';

const role = get(auth)?.user?.role;

type SidebarItem = {
  title: string;
  url: string;
  disabled?: boolean;
  icon: typeof Icon;
};

export const contentItems: SidebarItem[] = [
  {
    title: 'Home',
    url: '/admin',
    icon: House
  },
  {
    title: 'Slides',
    url: '/admin/slides',
    icon: GalleryThumbnailsIcon
  },
  {
    title: 'Users',
    url: '/admin/users',
    disabled: role !== 'staff' && role !== 'dev',
    icon: Users
  }
];

export const contentFooterItems: SidebarItem[] = [
  {
    title: 'Déconnexion',
    url: '/logout',
    icon: LogOut
  }
];
