import type { Category } from '$lib/types';
import { createContext } from 'svelte';

interface Search {
	searchTerm: string;
	category: Category | 'all';
}

export const [getSearchContext, setSearchContext] = createContext<Search>();
