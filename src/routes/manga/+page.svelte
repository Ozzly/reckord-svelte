<script lang="ts">
	import { mangaToCardData } from '$lib/cardHelpers';
	import { mangaStore } from '$lib/stores/stores.svelte';
	import Card from '../../components/card.svelte';
	import type { Manga, Status } from '$lib/types';

	function setStatus(manga: Manga, newStatus: Status | null) {
		if (manga.status) mangaStore.removeFromList(manga.id, manga.status);
		if (newStatus) mangaStore.addToList(manga, newStatus);
	}

	function onProgressChange(value: number, id: number) {
		if (isNaN(value) || value === 0) mangaStore.setProgressValue(id, null);
		else mangaStore.setProgressValue(id, value);
	}
</script>

<div class="flex flex-wrap justify-center gap-8">
	{#each mangaStore.enrichedResults as manga (manga.id)}
		<Card
			{...mangaToCardData(manga)}
			onPersonalScoreChange={(value) =>
				mangaStore.setPersonalScore(manga.id, manga.status || null, value === 0 ? null : value)}
			onPillMainClick={() => !manga.status && mangaStore.addToList(manga, 'completed')}
			onStatusChange={(newStatus) => setStatus(manga, newStatus)}
			onProgressChange={(value) => onProgressChange(value, manga.id)}
			statusVerbs={{ completed: 'Read', progress: 'Reading', planned: 'Planned' }}
		/>
	{/each}
</div>
