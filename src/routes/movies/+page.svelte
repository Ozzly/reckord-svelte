<script lang="ts">
	import { movieToCardData } from '$lib/cardHelpers';
	import { movieStore } from '$lib/stores/stores.svelte';
	import type { Movie, Status } from '$lib/types';
	import { resolve } from '$app/paths';
	import Card from '../../components/card.svelte';

	function setStatus(movie: Movie, newStatus: Status | null) {
		if (movie.status) movieStore.removeFromList(movie.id, movie.status);
		if (newStatus) movieStore.addToList(movie, newStatus);
	}

	function onProgressChange(value: number, id: number) {
		if (isNaN(value) || value === 0) movieStore.setProgressValue(id, null);
		else movieStore.setProgressValue(id, value);
	}

	let hasKey = $state(localStorage.getItem('tmdb_api_key') !== null);
	let warningDismissed = $state(localStorage.getItem('tmdb_warning_dismissed') === 'true');

	function dismissWarning() {
		localStorage.setItem('tmdb_warning_dismissed', 'true');
		warningDismissed = true;
	}
</script>

{#if !hasKey && !warningDismissed}
	<div
		class="mb-8 flex w-full items-start justify-between rounded-lg border border-peach bg-peach/15 p-1"
	>
		<div class="m-3">
			You haven't set your TMDB API key yet. Movie search can still work without it, by using
			Reckord's backend as a proxy, but it's recommended to set your own key for better performance
			(to avoid rate limits) and privacy. You can set it
			<a href={resolve('/settings')} class="text-accent underline">here</a>.
		</div>
		<button
			aria-label="Dismiss Warning"
			class="ml-4 flex items-center justify-center rounded p-1 text-sm transition-colors hover:bg-peach/19"
			onclick={dismissWarning}
		>
			<span class="icon-[jam--close]"></span>
		</button>
	</div>
{/if}

<div class="flex flex-wrap justify-center gap-8">
	{#each movieStore.enrichedResults as movie (movie.id)}
		<Card
			{...movieToCardData(movie)}
			onPersonalScoreChange={(value) =>
				movieStore.setPersonalScore(movie.id, movie.status || null, value === 0 ? null : value)}
			onPillMainClick={() => !movie.status && movieStore.addToList(movie, 'completed')}
			onStatusChange={(newStatus) => setStatus(movie, newStatus)}
			onProgressChange={(value) => onProgressChange(value, movie.id)}
			statusVerbs={{ completed: 'Watched', progress: 'Watching', planned: 'Planned' }}
		/>
	{/each}
</div>
