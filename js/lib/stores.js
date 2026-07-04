import { writable } from 'svelte/store';

export const isFilterSet = writable(false);
export const requestToken = writable('');