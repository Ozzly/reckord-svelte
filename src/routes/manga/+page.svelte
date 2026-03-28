<script>
	import { mangaStore } from '$lib/stores/stores.svelte';
</script>

{#each mangaStore.results as manga (manga.id)}
	<li>{manga.title}</li>
{/each}
