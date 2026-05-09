<script lang="ts">
	let tmdbAPIKey = $state(localStorage.getItem('tmdb_api_key'));
	let googleBooksAPIKey = $state(localStorage.getItem('google_books_api_key'));

	function oninput(e: Event, storageKey: string) {
		const value = (e.target as HTMLInputElement).value;
		localStorage.setItem(storageKey, value);
	}
</script>

<h2 class="font-bold">API Settings</h2>
<div class="text-subtext1">
	Reckord uses its backend as a proxy for API services by default. Providing your own API keys gives
	better performance and removes the shared rate limit. Keys are stored in plaintext in your
	browser's local storage - only add keys you're comfortable storing this way.
	<div class="mt-2 flex gap-4">
		<a
			href="https://github.com/Ozzly/reckord-svelte/blob/main/src/routes/settings/api/%2Bpage.svelte"
			class="flex items-center text-accent underline"
			target="_blank"
			>View how they're stored
			<span class="icon-[line-md--external-link]"></span></a
		>
		<a
			href="https://github.com/Ozzly/reckord-svelte/blob/main/src/lib/stores/stores.svelte.ts"
			class="flex items-center text-accent underline"
			target="_blank"
		>
			View how they're used
			<span class="icon-[line-md--external-link]"></span>
		</a>
	</div>
</div>
<div class="mt-4 flex px-8">
	<h3 class="w-1/3">TMDB API Key</h3>
	<input
		class="w-2/3 rounded-lg bg-surface1 px-3 py-1 text-xl transition-all hover:brightness-110 focus:outline-none"
		oninput={(e) => oninput(e, 'tmdb_api_key')}
		value={tmdbAPIKey}
	/>
</div>
<div class="mt-4 flex px-8">
	<h3 class="w-1/3">Google Books API Key</h3>
	<input
		class="w-2/3 rounded-lg bg-surface1 px-3 py-1 text-xl transition-all hover:brightness-110 focus:outline-none"
		oninput={(e) => oninput(e, 'google_books_api_key')}
		value={googleBooksAPIKey}
	/>
</div>
