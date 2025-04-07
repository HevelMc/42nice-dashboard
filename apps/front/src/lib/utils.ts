import { writable, type Writable } from 'svelte/store';
import { MediaQuery } from 'runed';

export const localeStore: Writable<string> = localStorageStore('locale', 'en');

export const desktop = new MediaQuery('(min-width: 768px)');

export function localStorageStore<T>(key: string, initialValue: T): Writable<T> {
  if (typeof window === 'undefined') return writable<T>(initialValue);
  const json = localStorage.getItem(key);
  const initial = json ? JSON.parse(json) : initialValue;

  const store = writable<T>(initial);

  store.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}

export function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
