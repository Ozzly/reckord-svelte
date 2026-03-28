<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import { page } from '$app/state';
	import Header from './header.svelte';

	import { setSearchContext } from './context';
	import { bookStore, animeStore, mangaStore } from '$lib/stores/stores.svelte';
	import type { Category } from '$lib/types';

	let { children } = $props();

	let search = $state({ searchTerm: '', category: 'books' as Category });
	setSearchContext(search);

	const storeMap: Record<Category, { search: (q: string) => Promise<void>; results: unknown[] }> = {
		books: bookStore,
		anime: animeStore,
		manga: mangaStore,
		movies: animeStore, // replace when movieStore exists
		shows: animeStore // replace when showStore exists
	};

	const categories: Category[] = ['books', 'anime', 'manga', 'movies', 'shows'];

	$effect(() => {
		const path = page.url.pathname.slice(1).split('/')[0];
		const category = categories.includes(path as Category) ? (path as Category) : 'books';
		const store = storeMap[category];
		if (search.searchTerm) {
			store.search(search.searchTerm);
		} else {
			store.results = [];
		}
	});
</script>

<svelte:head></svelte:head>
<div class="flex h-full w-full">
	<!-- Sidebar -->
	<div class="fixed top-0 left-0 h-full w-0 overflow-hidden bg-mantle lg:w-60">
		<!-- Logo -->
		<div class="flex h-20 items-center gap-4 px-6">
			<h1 class="text-center text-2xl font-bold">Reckord</h1>
		</div>
		<!-- Nav -->
		<div class="flex flex-col gap-1 p-6">
			<a href={resolve('/')} class:active={page.url.pathname === '/'}>
				<span class="icon-[iconamoon--home-bold]"></span> Home
			</a>
			<a href={resolve('/anime')} class:active={page.url.pathname === '/anime'}>
				<span class="icon-[octicon--play-16]"></span>
				Anime
			</a>
			<a href={resolve('/manga')} class:active={page.url.pathname === '/manga'}>
				<span class="icon-[glyphs--books-bold]"></span>
				Manga
			</a>
			<a href={resolve('/books')} class:active={page.url.pathname === '/books'}>
				<span class="icon-[wpf--books]"></span>
				Books
			</a>
			<a href={resolve('/shows')} class:active={page.url.pathname === '/shows'}>
				<span class="icon-[solar--tv-outline]"></span>
				Shows
			</a>
			<a href={resolve('/movies')} class:active={page.url.pathname === '/movies'}>
				<span class="icon-[si--movie-line]"></span>
				Movies
			</a>
		</div>

		<div class="absolute bottom-0 flex w-full flex-col gap-1 border-t border-surface1 p-6">
			<a href={resolve('/settings')} class:active={page.url.pathname === '/settings'}>
				<span class="icon-[solar--settings-linear]"></span>
				Settings
			</a>
		</div>
	</div>
	<div class="ml-0 flex min-w-0 flex-1 flex-col lg:ml-60">
		<!-- Header -->
		<Header />
		<!-- Child content -->
		<div class="mt-20 flex h-fit flex-1 bg-base p-10">
			{@render children()}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "./layout.css";

	a {
		@apply flex items-center gap-2 rounded-lg px-4 py-2 text-subtext0 transition-colors duration-300 hover:bg-surface0/60 hover:text-text;
	}

	a.active {
		@apply bg-surface0 text-text;
	}
	a.active span {
		@apply text-mauve;
	}
</style>
