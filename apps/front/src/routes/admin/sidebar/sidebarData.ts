import { House, LogOut } from 'lucide-svelte';

export const contentItems = [
  {
    title: 'Accueil',
    url: '/admin',
    icon: House
  }
];

export const contentFooterItems = [
  {
    title: 'Déconnexion',
    url: '/logout',
    icon: LogOut
  }
];
