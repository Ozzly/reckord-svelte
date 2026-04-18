<script lang="ts">
	let tmdbAPIKey = $state(localStorage.getItem('tmdb_api_key'));
	let googleBooksAPIKey = $state(localStorage.getItem('google_books_api_key'));

	function oninput(e: Event, storageKey: string) {
		const value = (e.target as HTMLInputElement).value;
		localStorage.setItem(storageKey, value);
	}
</script>

<h2 class="font-bold">API Settings</h2>
<p class="text-subtext1">
	To provide a useable service out of the box, Reckord will use it's backend as a proxy for API
	services that require a token. To improve performance, you can provide your own API keys for these
	services. Reckord will use these keys instead of the default ones. The keys are stored in
	plaintext in your browser's local storage, so only provide keys that you are comfortable with
	being stored in this manner.
</p>
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
