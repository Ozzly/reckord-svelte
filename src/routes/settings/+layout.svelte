<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8 md:flex-row">
	<!-- Settings list -->
	<div class=" h-fit w-full shrink-0 rounded-lg bg-surface0 p-2 md:w-50">
		<a href={resolve('/settings/api')} class:active={page.url.pathname === '/settings/api'}>
			<span class="icon-[eos-icons--api]"></span>API
		</a>
		<a href={resolve('/settings/about')} class:active={page.url.pathname === '/settings/about'}>
			<span class="icon-[ix--about]"></span>About
		</a>
	</div>

	<!-- Page Content -->
	<div class="h-fit w-full rounded-lg bg-surface0 p-8">
		{@render children()}
	</div>
</div>

<style lang="postcss">
	@reference "../layout.css";

	a {
		@apply flex items-center gap-2 rounded-lg px-4 py-2 text-subtext0 transition-colors duration-300 hover:bg-surface0/60 hover:text-text;
	}

	a.active {
		@apply bg-surface1 text-text;
	}
	a.active span {
		@apply text-mauve;
	}
</style>
