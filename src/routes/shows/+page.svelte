<script lang="ts">
	import { showStore } from '$lib/stores/stores.svelte';
	import type { Show, Status } from '$lib/types';
	import { resolve } from '$app/paths';
	import { showToCardData } from '$lib/cardHelpers';
	import Card from '../../components/card.svelte';

	function setStatus(show: Show, newStatus: Status | null) {
		if (show.status) showStore.removeFromList(show.id, show.status);
		if (newStatus) showStore.addToList(show, newStatus);
	}

	function onProgressChange(value: number, id: number) {
		if (isNaN(value) || value === 0) showStore.setProgressValue(id, null);
		else showStore.setProgressValue(id, value);
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
			You haven't set your TMDB API key yet. TV search can still work without it, by using Reckord's
			backend as a proxy, but it's recommended to set your own key for better privacy and
			performance (to avoid rate limits). You can set it
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
	{#each showStore.enrichedResults as show (show.id)}
		<Card
			{...showToCardData(show)}
			onPersonalScoreChange={(value) =>
				showStore.setPersonalScore(show.id, show.status || null, value === 0 ? null : value)}
			onPillMainClick={() => !show.status && showStore.addToList(show, 'completed')}
			onStatusChange={(newStatus) => setStatus(show, newStatus)}
			onProgressChange={(value) => onProgressChange(value, show.id)}
			statusVerbs={{ completed: 'Watched', progress: 'Watching', planned: 'Planned' }}
			onSeasonChange={(value) => {
				console.log('onSeasonChange in page ', value);
				showStore.setSeasonProgress(show.id, value);
			}}
		/>
	{/each}
</div>
