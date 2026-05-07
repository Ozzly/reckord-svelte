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
	T extends {
		id: number | string;
		title: string;
		status?: Status | null;
		progressValue?: number;
		seasonProgress?: number;
		dateAdded?: string;
		personalRating?: number;
	},
	R = unknown
> {
	readonly prefix: string;
	readonly fetchUrl: (query: string) => string;
	readonly transform: (data: R) => T;
	readonly detailUrl?: (id: T['id']) => string;
	readonly mergeDetails?: (item: T, details: any) => T;

	completed = $state<T[]>([]);
	progress = $state<T[]>([]);
	planned = $state<T[]>([]);
	results = $state<T[]>([]);
	isLoading = $state(false);
	enrichedResults = $derived<T[]>(
		this.results.map((item) => {
			const status = this.getStatus(item.id);
			const storedItemDetails = status ? this[status].find((i) => i.id === item.id) : null;
			return {
				...item,
				status,
				personalRating: storedItemDetails?.personalRating,
				dateAdded: storedItemDetails?.dateAdded,
				progressValue: storedItemDetails?.progressValue,
				seasonProgress: storedItemDetails?.seasonProgress
			};
		})
	);

	constructor(config: {
		prefix: string;
		fetchUrl: (query: string) => string;
		transform: (data: R) => T;
		detailUrl?: (id: T['id']) => string;
		mergeDetails?: (item: T, details: any) => T;
	}) {
		this.prefix = config.prefix;
		this.fetchUrl = config.fetchUrl;
		this.transform = config.transform;
		this.detailUrl = config.detailUrl;
		this.mergeDetails = config.mergeDetails;

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

		const updatedItem = { ...item, dateAdded: moment().format('DD/MM/YY') };
		if (status === 'progress') {
			updatedItem.progressValue = 1;
			updatedItem.seasonProgress = 1;
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

	setPersonalScore(id: T['id'], status: Status | null, rating: number | null) {
		if (status === null) return;
		const index = this[status].findIndex((i) => i.id === id);
		if (index === -1) return;

		const updatedItem = { ...this[status][index], personalRating: rating };
		const updatedList = [...this[status]];
		updatedList[index] = updatedItem;

		this[status] = updatedList;
		localStorage.setItem(`${this.prefix}_${status}`, JSON.stringify(updatedList));
	}

	setProgressValue(id: T['id'], value: number | null) {
		const index = this.progress.findIndex((i) => i.id === id);
		if (index === -1) return;

		let updatedItem;
		if (value === null) {
			updatedItem = { ...this.progress[index], progressValue: undefined };
		} else {
			updatedItem = { ...this.progress[index], progressValue: value };
		}
		const updatedList = [...this.progress];
		updatedList[index] = updatedItem;
		this.progress = updatedList;
		localStorage.setItem(`${this.prefix}_progress`, JSON.stringify(updatedList));
	}

	setSeasonProgress(id: T['id'], value: number | null) {
		const index = this.progress.findIndex((i) => i.id === id);
		if (index === -1) return;

		const updatedItem = { ...this.progress[index], seasonProgress: value ?? undefined };
		const updatedList = [...this.progress];
		updatedList[index] = updatedItem;
		this.progress = updatedList;
		localStorage.setItem(`${this.prefix}_progress`, JSON.stringify(updatedList));
	}

	async search(query: string) {
		this.isLoading = true;
		try {
			console.log('querying', this.fetchUrl(query));
			const response = await fetch(this.fetchUrl(query), API_OPTIONS);
			if (!response.ok) throw new Error(response.statusText);
			const data = await response.json();
			const transformedData: T[] = (data.data ?? data.docs ?? data.results ?? []).map(
				this.transform
			);

			this.results = [
				...new SvelteMap(transformedData.map((item: T) => [item['id'] as T['id'], item])).values()
			];

			// Perform individual search to get more info for shows + movies
			if (this.detailUrl && this.mergeDetails) {
				const detailResponses = await Promise.all(
					transformedData.map((item) =>
						fetch(this.detailUrl!(item.id), API_OPTIONS).then((r) => r.json())
					)
				);
				this.results = transformedData.map((item: T, i) =>
					this.mergeDetails!(item, detailResponses[i])
				);
			}
		} catch (e) {
			console.error(e);
			this.results = [];
		} finally {
			this.isLoading = false;
		}
	}
}
