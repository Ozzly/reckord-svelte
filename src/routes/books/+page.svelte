<script lang="ts">
	import { bookStore } from '$lib/stores/stores.svelte';
</script>

{#each bookStore.results as book (book.id)}
	<li>{book.title}</li>
{/each}
