import { writable, type Writable } from 'svelte/store';
import { MediaQuery } from 'runed';
import type { Canceler } from 'axios';
import type { SortingState } from '@tanstack/table-core';
import { api } from './api';
import axios from 'axios';

export const localeStore: Writable<string> = localStorageStore('locale', 'en');

export const desktop = new MediaQuery('(min-width: 768px)');

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const isEmailValid = (email: string) => emailRegex.test(email);

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

export class TableQuery {
  cancelToken: Canceler | null = null;
  path: string;
  params: Record<string, unknown> = {};

  constructor({ path, params = {} }: { path: string; params?: Record<string, unknown> }) {
    this.path = path;
    this.params = params;
  }

  async queryTable({
    pageIndex,
    pageSize,
    sortBy,
    filters,
    searchQuery,
    ...otherParams
  }: {
    pageIndex?: number;
    pageSize?: number;
    sortBy: SortingState;
    filters: { id: string; value: string[] }[];
    searchQuery: string;
  }) {
    this.cancelToken?.('Operation canceled due to new request.');
    const resp = await api.get(this.path, {
      cancelToken: new axios.CancelToken((c) => (this.cancelToken = c)),
      params: {
        ...this.params,
        pageIndex: (pageIndex ?? 0) + 1,
        pageSize,
        sort: sortBy[0],
        filters: filters,
        search: searchQuery,
        ...otherParams
      }
    });

    return {
      data: resp.data.data,
      total: resp.data.meta.total
    };
  }
}
