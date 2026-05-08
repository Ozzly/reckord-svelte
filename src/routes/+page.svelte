<script lang="ts">
	import {
		animeToCardData,
		bookToCardData,
		mangaToCardData,
		movieToCardData,
		showToCardData
	} from '$lib/cardHelpers';
	import {
		animeStore,
		bookStore,
		mangaStore,
		movieStore,
		showStore
	} from '$lib/stores/stores.svelte';
	import Card from '../components/card.svelte';

	const rows = [
		{
			label: 'Anime',
			store: animeStore,
			toCard: animeToCardData,
			statusVerbs: { completed: 'Watched', progress: 'Watching', planned: 'Planned' }
		},
		{
			label: 'Manga',
			store: mangaStore,
			toCard: mangaToCardData,
			statusVerbs: { completed: 'Read', progress: 'Reading', planned: 'Planned' }
		},
		{
			label: 'Shows',
			store: showStore,
			toCard: showToCardData,
			statusVerbs: { completed: 'Watched', progress: 'Watching', planned: 'Planned' },
			onSeasonChange: (id: number, value: number) => showStore.setSeasonProgress(id, value)
		},
		{
			label: 'Movies',
			store: movieStore,
			toCard: movieToCardData,
			statusVerbs: { completed: 'Watched', progress: 'Watching', planned: 'Planned' }
		},
		{
			label: 'Books',
			store: bookStore,
			toCard: bookToCardData,
			statusVerbs: { completed: 'Read', progress: 'Reading', planned: 'Planned' }
		}
	];

	const PREVIEW_COUNT = 6;
</script>

<section class="mb-4 h-full w-full flex-1">
	<div class="w-full rounded-lg border border-red bg-red/10 p-4">
		I'm currently porting Reckord to SvelteKit. This is a work in progress, and the UI is not yet
		complete. Please expect some bugs and missing features.
		<br />
		You can check out the progress at
		<a
			href="https://github.com/Ozzly/reckord-svelte"
			class="text-mauve underline"
			target="_blank"
			rel="noopener noreferrer"
		>
			Reckord-Svelte</a
		>.
	</div>
</section>

<div class="mx-auto flex max-w-400 flex-col gap-8">
	{#each rows as row (row.label)}
		{#if row.store.enrichedResults.length}
			<section class="h-fit w-full p-4">
				<h2 class="mb-2 text-lg font-bold">{row.label}</h2>
				<div class="flex flex-wrap gap-4">
					{#each row.store.enrichedResults.slice(0, PREVIEW_COUNT) as item (item.id)}
						<Card
							{...row.toCard(item as any)}
							statusVerbs={row.statusVerbs}
							onPillMainClick={() => !item.status && row.store.addToList(item as any, 'completed')}
							onStatusChange={(newStatus) => {
								if (item.status) row.store.removeFromList(item.id, item.status);
								if (newStatus) row.store.addToList(item as any, newStatus);
							}}
							onProgressChange={(value) => {
								if (isNaN(value) || value === 0) row.store.setProgressValue(item.id, null);
								else row.store.setProgressValue(item.id, value);
							}}
							onPersonalScoreChange={(value) =>
								row.store.setPersonalScore(
									item.id,
									item.status ?? null,
									value === 0 ? null : value
								)}
						/>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>
