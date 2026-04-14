<script lang="ts">
	import { resolve } from '$app/paths';
	import { bookToCardData } from '$lib/cardHelpers';
	import { bookStore } from '$lib/stores/stores.svelte';
	import type { Book, Status } from '$lib/types';
	import Card from '../../components/card.svelte';

	function setStatus(book: Book, newStatus: Status | null) {
		if (book.status) bookStore.removeFromList(book.id, book.status);
		if (newStatus) bookStore.addToList(book, newStatus);
	}

	function onProgressChange(value: number, id: string) {
		if (isNaN(value) || value === 0) bookStore.setProgressValue(id, null);
		else bookStore.setProgressValue(id, value);
	}

	let hasKey = $state(localStorage.getItem('google_books_api_key') !== null);
	let warningDismissed = $state(localStorage.getItem('google_books_warning_dismissed') === 'true');

	function dismissWarning() {
		localStorage.setItem('google_books_warning_dismissed', 'true');
		warningDismissed = true;
	}
</script>

{#if !hasKey && !warningDismissed}
	<div
		class="mb-8 flex w-full items-start justify-between rounded-lg border border-peach bg-peach/15 p-1"
	>
		<div class="m-3">
			You haven't set your Google API key yet. Book search can still work without it, by using
			OpenLibrary's free API, but search results are significantly worse. You can set it
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
	{#each bookStore.enrichedResults as book (book.id)}
		<Card
			{...bookToCardData(book)}
			onPersonalScoreChange={(value) =>
				bookStore.setPersonalScore(book.id, book.status || null, value === 0 ? null : value)}
			onPillMainClick={() => !book.status && bookStore.addToList(book, 'completed')}
			onStatusChange={(newStatus) => setStatus(book, newStatus)}
			onProgressChange={(value) => onProgressChange(value, book.id)}
			statusVerbs={{ completed: 'Read', progress: 'Reading', planned: 'Planned' }}
		/>
	{/each}
</div>
