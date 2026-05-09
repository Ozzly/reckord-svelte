<script lang="ts">
	import ApiKeyInput from './ApiKeyInput.svelte';

	let useBackendProxy = $state(
		localStorage.getItem('use_books_backend_proxy')
			? localStorage.getItem('use_books_backend_proxy') === 'true'
			: true
	);

	function oncheckbox(e: Event, storageKey: string) {
		const value = (e.target as HTMLInputElement).checked;
		localStorage.setItem(storageKey, value.toString());
	}
</script>

<h1 class="text-2xl font-bold">API Settings</h1>
<div class="text-subtext1">
	Reckord uses its backend as a proxy for API services by default. Providing your own API keys gives
	better performance and removes the shared rate limit. Keys are stored in plaintext in your
	browser's local storage - only add keys you're comfortable storing this way.
	<div class="mt-2 flex gap-4">
		<a
			href="https://github.com/Ozzly/reckord-svelte/blob/main/src/routes/settings/api/%2Bpage.svelte"
			class="flex items-center text-accent underline"
			target="_blank"
		>
			View how they're stored
			<span class="icon-[tabler--external-link]"></span>
		</a>
		<a
			href="https://github.com/Ozzly/reckord-svelte/blob/main/src/lib/stores/stores.svelte.ts"
			class="flex items-center text-accent underline"
			target="_blank"
		>
			View how they're used
			<span class="icon-[tabler--external-link]"></span>
		</a>
	</div>
</div>
<div class="mt-8">
	<h2 class="text-xl font-bold">Movies & Shows</h2>
	<ApiKeyInput label="TMDB API Key" storageKey="tmdb_api_key" />
</div>
<div class="mt-4">
	<h2 class="text-xl font-bold">Books</h2>

	<label class="mb-3 flex cursor-pointer items-center gap-3">
		<span class="w-1/3"> Use backend proxy </span>
		<div class="relative">
			<input
				type="checkbox"
				class="peer sr-only"
				bind:checked={useBackendProxy}
				onchange={(e) => oncheckbox(e, 'use_books_backend_proxy')}
			/>
			<div class="h-6 w-11 rounded-full bg-surface1 transition-all peer-checked:bg-accent"></div>
			<div
				class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"
			></div>
		</div>
	</label>

	<ApiKeyInput
		label="Google Books API Key"
		storageKey="google_books_api_key"
		disabled={useBackendProxy}
	/>
</div>
