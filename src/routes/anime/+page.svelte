<script lang="ts">
	import { animeToCardData } from '$lib/cardHelpers';
	import { animeStore } from '$lib/stores/stores.svelte';
	import type { Anime, Status } from '$lib/types';
	import Card from '../../components/card.svelte';

	function onPillMainClick(anime: Anime, status: Status | null) {
		if (status) {
			// animeStore.removeFromList(anime.id, status);
		} else {
			animeStore.addToList(anime, 'completed');
		}
	}

	function setStatus(anime: Anime, currentStatus: Status | null, setStatus: Status | null) {
		if (currentStatus) animeStore.removeFromList(anime.id, currentStatus);
		if (setStatus) animeStore.addToList(anime, setStatus);
	}

	function onPersonalScoreChange(e: Event, id: number, status: Status | null) {
		if (status === null) return;
		const rating = Number((e.target as HTMLInputElement).value);
		console.log(rating, id, status);
		animeStore.setPersonalScore(id, status, rating);
	}

	function onProgressUpdate(e: Event, id: number) {
		const value = Number((e.target as HTMLInputElement).value);
		if (isNaN(value) || value === 0) animeStore.setProgressValue(id, null);
		else animeStore.setProgressValue(id, value);
	}

	function handleProgressButtonClick(anime: Anime, increment: number) {
		const currentProgress = anime.progressValue || 0;
		const newProgress = currentProgress + increment;
		if (newProgress < 0) return;
		if (anime.episodes && newProgress > anime.episodes) return;
		animeStore.setProgressValue(anime.id, newProgress);
	}
</script>

<div class="flex flex-wrap justify-center gap-8">
	{#each animeStore.enrichedResults as anime (anime.id)}
		<Card
			{...animeToCardData(anime)}
			{onPersonalScoreChange}
			onPillMainClick={(status) => onPillMainClick(anime, status)}
			onProgressChange={(value) =>
				console.log('Progress changed:', value, 'for anime ID:', anime.id)}
			onStatusChange={(newStatus) => setStatus(anime, anime.status || null, newStatus)}
		></Card>
	{/each}
</div>

<style lang="postcss">
	@reference "../layout.css";

	.dropdown-button {
		@apply flex items-center gap-2 py-1 pr-4 pl-2 transition-colors duration-300 hover:text-surface0;
	}
</style>
