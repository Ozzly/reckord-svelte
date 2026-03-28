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

	function setStatus(anime: Anime, currentStatus: Status | null, setStatus: Status) {
		if (currentStatus) {
			animeStore.removeFromList(anime.id, currentStatus);
		}
		animeStore.addToList(anime, setStatus);
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
					<!-- + button with drop-up overlay -->
					<div
						class="group relative flex h-full w-1/5 cursor-pointer items-center justify-center rounded-r-lg border-3 bg-surface0 text-text transition-all duration-300 hover:brightness-110 {status ===
						'completed'
							? 'border-blue'
							: status === 'progress'
								? 'border-peach'
								: status === 'planned'
									? 'border-red'
									: 'border-surface1'}"
					>
						<span
							class="icon-[tabler--dots-vertical] flex justify-center {status === 'completed'
								? 'text-blue'
								: status === 'progress'
									? 'text-peach'
									: status === 'planned'
										? 'text-red'
										: 'text-text'}"
						></span>

						<div
							class="pointer-events-none absolute bottom-full left-1/2 z-10 w-fit -translate-x-3/5 pb-1 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
						>
							<div class="flex h-fit w-fit flex-col overflow-hidden rounded-md bg-surface0">
								<button
									onclick={() => setStatus(anime, status, 'completed')}
									class="dropdown-button hover:bg-blue"
								>
									<span class="icon-[fluent-mdl2--completed-solid] text-xs"></span>
									Watched
								</button><button
									onclick={() => setStatus(anime, status, 'progress')}
									class="dropdown-button hover:bg-peach"
								>
									<span class="icon-[uil--eye]"></span>
									Watching
								</button><button
									onclick={() => setStatus(anime, status, 'planned')}
									class="dropdown-button hover:bg-red"
								>
									<span class="icon-[uil--calendar]"></span>Planned
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	{/each}
</div>

<style lang="postcss">
	@reference "../layout.css";

	.dropdown-button {
		@apply flex items-center gap-2 py-1 pr-4 pl-2 transition-colors duration-300 hover:text-surface0;
	}
</style>
