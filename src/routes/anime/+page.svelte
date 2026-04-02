<script lang="ts">
	import { animeToCardData } from '$lib/cardHelpers';
	import { animeStore } from '$lib/stores/stores.svelte';
	import type { Anime, Status } from '$lib/types';
	import Card from '../../components/card.svelte';

	function setStatus(anime: Anime, newStatus: Status | null) {
		if (anime.status) animeStore.removeFromList(anime.id, anime.status);
		if (newStatus) animeStore.addToList(anime, newStatus);
	}

	function onProgressChange(value: number, id: number) {
		if (isNaN(value) || value === 0) animeStore.setProgressValue(id, null);
		else animeStore.setProgressValue(id, value);
	}
</script>

<div class="flex flex-wrap justify-center gap-8">
	{#each animeStore.enrichedResults as anime (anime.id)}
		<Card
			{...animeToCardData(anime)}
			onPersonalScoreChange={(value) =>
				animeStore.setPersonalScore(anime.id, anime.status || null, value === 0 ? null : value)}
			onPillMainClick={() => !anime.status && animeStore.addToList(anime, 'completed')}
			onStatusChange={(newStatus) => setStatus(anime, newStatus)}
			onProgressChange={(value) => onProgressChange(value, anime.id)}
			statusVerbs={{ completed: 'Watched', progress: 'Watching', planned: 'Planned' }}
		></Card>
	{/each}
</div>
