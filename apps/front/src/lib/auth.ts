import { type Writable } from 'svelte/store';
import { localStorageStore } from './utils';
import { api } from './api';

export interface Auth {
  token: string;
  user: User;
}

export const auth: Writable<Auth | null> = localStorageStore('auth', null);

export const login = async (email: string, password: string) => {
  await api.post('/users/login', { email, password }).then(async (res) => {
    auth.set(res.data);
    window.location.href = '/admin';
  });
};

export const logout = async () => {
  auth.set(null);
  window.location.href = '/login';
};
