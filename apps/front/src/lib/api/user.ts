import { BadgeCheckIcon, CodeIcon, UserRoundIcon } from 'lucide-svelte';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const roles = [
  { label: 'Dev', value: 'dev', icon: CodeIcon },
  { label: 'Staff', value: 'staff', icon: BadgeCheckIcon },
  { label: 'BDE', value: 'bde', icon: UserRoundIcon }
];
