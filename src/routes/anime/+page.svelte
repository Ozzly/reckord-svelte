<script lang="ts">
	import { animeStore } from '$lib/stores/stores.svelte';
	import type { Anime, Status } from '$lib/types';
	import Card from '../../components/card.svelte';

	function onPillMainClick(anime: Anime, status: Status | null) {
		if (status) {
			animeStore.removeFromList(anime.id, status);
		} else {
			animeStore.addToList(anime, 'completed');
		}
	}
</script>

<div class="flex flex-wrap justify-center gap-8">
	{#each animeStore.results as anime (anime.id)}
		{@const status = animeStore.getStatus(anime.id)}
		<Card img={anime.cover_image}>
			<div class="flex h-full flex-col justify-between">
				<div>
					<h1 class="line-clamp-2 text-lg">{anime.title}</h1>
					<h2 class="text-sm text-subtext1">{anime.studio}</h2>
				</div>

				<!-- Status pill -->
				<div class="bottom-0 mx-auto flex h-10 w-50 text-base">
					<button
						onclick={() => onPillMainClick(anime, status)}
						class="group relative flex h-full w-4/5 items-center justify-center rounded-l-lg border-3 transition-all duration-300 hover:brightness-110 {status ===
						'completed'
							? 'border-blue bg-blue'
							: status === 'progress'
								? 'border-peach bg-peach'
								: status === 'planned'
									? 'border-red bg-red'
									: 'border-surface1 bg-surface1 text-text'}"
					>
						{status ? status?.slice(0, 1).toUpperCase() + status?.slice(1) : 'Mark Watched'}
						{#if status}
							<div
								class="absolute right-0 flex items-center justify-center text-text opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<span class="icon-[icon-park-solid--close-one] text-xs text-surface0"></span>
							</div>
						{/if}
					</button>
					<div
						class="flex h-full w-1/5 items-center justify-center rounded-r-lg border-3 bg-surface0 text-text transition-all duration-300 hover:brightness-110 {status ===
						'completed'
							? 'border-blue '
							: status === 'progress'
								? 'border-peach '
								: status === 'planned'
									? 'border-red '
									: 'border-surface1 '}"
					>
						+
					</div>
				</div>
			</div>
		</Card>
	{/each}
</div>
