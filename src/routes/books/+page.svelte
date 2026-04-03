<script lang="ts">
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
</script>

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
