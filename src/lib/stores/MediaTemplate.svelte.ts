import type { Status } from '$lib/types';
import moment from 'moment';
import { loadFromStorage } from './storeHelpers';
import { SvelteMap } from 'svelte/reactivity';

const API_OPTIONS = {
	method: 'GET',
	headers: {
		accept: 'application/json'
	}
};

export class MediaStore<
	T extends { id: number; title: string; progressValue?: number; dateAdded?: string }
> {
	readonly prefix: string;
	readonly fetchUrl: (query: string) => string;
	readonly transform: (data: any) => T;

	completed = $state<T[]>([]);
	progress = $state<T[]>([]);
	planned = $state<T[]>([]);
	results = $state<T[]>([]);
	isLoading = $state(false);

	constructor(config: {
		prefix: string;
		fetchUrl: (query: string) => string;
		transform: (data: any) => T;
	}) {
		this.prefix = config.prefix;
		this.fetchUrl = config.fetchUrl;
		this.transform = config.transform;

		this.completed = loadFromStorage(`${this.prefix}_completed`);
		this.progress = loadFromStorage(`${this.prefix}_progress`);
		this.planned = loadFromStorage(`${this.prefix}_planned`);
	}

	getStatus(id: T['id']): Status | null {
		if (this.completed.some((i) => i.id === id)) return 'completed';
		if (this.progress.some((i) => i.id === id)) return 'progress';
		if (this.planned.some((i) => i.id === id)) return 'planned';
		return null;
	}

	addToList(item: T, status: Status) {
		if (this[status].some((i) => i.id === item.id)) return;

		const updatedItem = { ...item, dateAdded: moment().format('ll') };
		if (status === 'progress') {
			updatedItem.progressValue = 1;
		}
		const updatedList = [...this[status], updatedItem];

		localStorage.setItem(`${this.prefix}_${status}`, JSON.stringify(updatedList));
		this[status] = updatedList;
	}

	removeFromList(id: T['id'], status: Status) {
		const updatedList = this[status].filter((i) => i.id !== id);
		localStorage.setItem(`${this.prefix}_${status}`, JSON.stringify(updatedList));
		this[status] = updatedList;
	}

	getDateAdded(id: T['id'], status: Status | null): string | null {
		if (status === null) return null;
		return this[status].find((i) => i.id === id)?.dateAdded || null;
	}

	// COME BACK TO THIS LOGIC IS BAD
	setProgress(id: T['id'], value: number) {
		const index = this.progress.findIndex((i) => i.id === id);
		if (index === -1) return;

		const currentItem = this.progress[index];
		currentItem.progressValue = value;
	}

	async search(query: string) {
		this.isLoading = true;
		try {
			console.log('querying', this.fetchUrl(query));
			const response = await fetch(this.fetchUrl(query), API_OPTIONS);
			if (!response.ok) throw new Error(response.statusText);
			const data = await response.json();
			const transformedData: T[] = (data.data ?? data.docs ?? []).map(this.transform);

			this.results = [
				...new SvelteMap(transformedData.map((item: T) => [item['id'] as T['id'], item])).values()
			];
		} catch (e) {
			console.error(e);
			this.results = [];
		} finally {
			this.isLoading = false;
		}
	}
}
