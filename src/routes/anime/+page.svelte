<script lang="ts">
	import { animeStore } from '$lib/stores/stores.svelte';
	import type { Anime, Status } from '$lib/types';
	import Card from '../../components/card.svelte';

	function onPillMainClick(anime: Anime, status: Status | null) {
		if (status) {
			// animeStore.removeFromList(anime.id, status);
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

	function onPersonalScoreChange(e: Event, id: number, status: Status | null) {
		if (status === null) return;
		const rating = Number((e.target as HTMLInputElement).value);
		console.log(rating, id, status);
		animeStore.setPersonalScore(id, status, rating);
	}
</script>

<div class="flex flex-wrap justify-center gap-8">
	{#each animeStore.enrichedResults as anime (anime.id)}
		{@const status = anime.status}
		<Card img={anime.cover_image}>
			<div class="flex h-full flex-col justify-between">
				<div>
					<h1 class="line-clamp-2 text-lg">{anime.title}</h1>
					<h2 class="text-sm text-subtext1">{anime.studio}</h2>
					<div class="mt-3 flex justify-between">
						<span
							>{anime.videoType === 'Movie' ? 'Movie' : anime.episodes || 'No'}
							{anime.videoType === 'Movie' ? '' : anime.videoType || 'Ep'}</span
						>
						•
						<span>{anime.release_season} {anime.year}</span>

						•
						<span
							class="flex items-center gap-1 {anime.score > 8
								? 'text-green'
								: anime.score > 6
									? 'text-yellow'
									: anime.score
										? 'text-red'
										: 'text-surface2'}
						">{anime.score || 'N/A'}<span class="icon-[mingcute--star-fill]"></span></span
						>
					</div>
					{#if anime.status === 'completed' || anime.status === 'progress'}
						<div class="mt-2 flex items-center gap-3">
							<span class="text-subtext0">Personal Rating: </span>

							<input
								class="w-20 rounded outline-surface1 group-hover:outline-2 group-hover:outline-dashed focus:outline-mauve"
								value={anime.personalRating}
								oninput={(e) => onPersonalScoreChange(e, anime.id, anime.status || null)}
								onmouseleave={() => this.blur()}
							/>
						</div>
					{/if}
				</div>

				<!-- Status pill -->
				<div class="bottom-0 mx-auto flex h-10 w-50 text-base">
					<button
						onclick={() => onPillMainClick(anime, anime.status || null)}
						class="banana group/close relative flex h-full w-4/5 items-center justify-center rounded-l-lg border-3 transition-all duration-300 hover:brightness-110 {status ===
						'completed'
							? 'border-blue bg-blue'
							: status === 'progress'
								? 'border-peach bg-peach'
								: status === 'planned'
									? 'border-pink bg-pink'
									: 'border-surface1 bg-surface1 text-text'}"
					>
						{#if status === 'completed'}
							<span class="mr-2 icon-[fluent-mdl2--completed-solid] text-xs"></span>
							{anime.dateAdded}
						{:else if status === 'progress'}
							Ep {anime.progressValue}
							{#if anime.episodes}
								/{anime.episodes}
							{/if}
						{:else if status === 'planned'}
							Planned
						{:else}
							Mark Watched
						{/if}

						<!-- Remove icon -->
						<!-- {#if status}
							<div
								class="absolute right-0 flex items-center justify-center text-text opacity-0 transition-opacity duration-300 group-hover/close:opacity-100"
							>
								<span class="icon-[icon-park-solid--close-one] text-xs text-surface0"></span>
							</div>
						{/if} -->
					</button>

					<!-- Dropup menu -->
					<div
						class="group/dropup relative flex h-full w-1/5 cursor-pointer items-center justify-center rounded-r-lg border-3 bg-surface0 text-text transition-all duration-300 hover:brightness-110 {status ===
						'completed'
							? 'border-blue'
							: status === 'progress'
								? 'border-peach'
								: status === 'planned'
									? 'border-pink'
									: 'border-surface1'}"
					>
						<span
							class="icon-[tabler--dots-vertical] flex justify-center {status === 'completed'
								? 'text-blue'
								: status === 'progress'
									? 'text-peach'
									: status === 'planned'
										? 'text-pink'
										: 'text-text'}"
						></span>

						<div
							class="pointer-events-none absolute bottom-full left-1/2 z-10 w-fit -translate-x-3/5 pb-1 opacity-0 transition-opacity duration-150 group-hover/dropup:pointer-events-auto group-hover/dropup:opacity-100"
						>
							<div class="flex h-fit w-fit flex-col overflow-hidden rounded-md bg-surface0">
								<button
									onclick={() => setStatus(anime, status || null, 'completed')}
									class="dropdown-button hover:bg-blue"
								>
									<span class="icon-[fluent-mdl2--completed-solid] text-xs"></span>
									Watched
								</button><button
									onclick={() => setStatus(anime, status || null, 'progress')}
									class="dropdown-button hover:bg-peach"
								>
									<span class="icon-[uil--eye] text-xs"></span>
									Watching
								</button><button
									onclick={() => setStatus(anime, status || null, 'planned')}
									class="dropdown-button hover:bg-pink"
								>
									<span class="icon-[uil--calendar] text-xs"></span>Planned
								</button>
								{#if status}
									<button
										onclick={() => animeStore.removeFromList(anime.id, status)}
										class="dropdown-button hover:bg-red"
									>
										<span class="icon-[icon-park-solid--close-one] text-xs"></span>Remove
									</button>
								{/if}
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
