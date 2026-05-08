<script lang="ts">
	import type { CardData, Status } from '$lib/types';

	let {
		image,
		title,
		subheading,
		score,
		status,
		leftDetails,
		releaseDate,
		personalRating,
		dateAdded,
		progressValue,
		progressMax,
		seasonCount,
		seasonProgress,
		progressUnit,
		onSeasonChange,
		onPersonalScoreChange,
		onPillMainClick,
		onProgressChange,
		onStatusChange,
		statusVerbs
	}: CardData & {
		onSeasonChange?: (value: number) => void;
		onPersonalScoreChange: (value: number) => void;
		onPillMainClick: () => void;
		onProgressChange: (value: number) => void;
		onStatusChange: (newStatus: Status | null) => void;
		statusVerbs: { completed: string; progress: string; planned: string };
	} = $props();

	function progressIncrease() {
		onProgressChange(
			progressValue ? (progressValue + 1 <= progressMax ? progressValue + 1 : progressMax) : 1
		);
	}

	function progressDecrease() {
		onProgressChange(progressValue ? (progressValue - 1 >= 0 ? progressValue - 1 : 0) : 0);
	}

	function seasonIncrease() {
		console.log('triggered season increase');
		if (seasonProgress && seasonCount) {
			const next = seasonProgress + 1 <= seasonCount ? seasonProgress + 1 : seasonCount;
			console.log('next', next);
			onSeasonChange!(next);
			onProgressChange(1); // reset episode progress
		}
	}

	function seasonDecrease() {
		const previous = (seasonProgress ?? 1) - 1 >= 1 ? (seasonProgress ?? 1) - 1 : 1;
		onSeasonChange!(previous);
		onProgressChange(1);
	}
</script>

<div class="group relative w-120 shrink-0">
	<!-- Corner brackets -->
	<span class="corner corner-tl"></span>
	<span class="corner corner-tr"></span>
	<span class="corner corner-bl"></span>
	<span class="corner corner-br"></span>

	<div
		class="grid h-fit grid-cols-5 overflow-hidden rounded-sm bg-linear-to-l from-surface0/60 to-surface0/20"
	>
		<div class="col-span-2 aspect-7/10 w-full overflow-hidden">
			<img
				src={image}
				alt="alt"
				class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
			/>
		</div>
		<div class="col-span-3 p-4">
			<div class="flex h-full flex-col justify-between">
				<div>
					<h1 class="line-clamp-2 text-lg">{title}</h1>
					<h2 class="line-clamp-1 text-sm text-subtext1" title={subheading}>{subheading}</h2>
					<div class="mt-3 flex justify-between">
						<span>{leftDetails}</span>
						•
						<span>{releaseDate}</span>

						•
						<span
							class="flex items-center gap-1 {score > 8
								? 'text-green'
								: score > 6
									? 'text-yellow'
									: score
										? 'text-red'
										: 'text-surface2'}
						">{score || 'N/A'}<span class="icon-[mingcute--star-fill]"></span></span
						>
					</div>
					{#if status === 'completed' || status === 'progress'}
						<div class="mt-2 flex items-center gap-3">
							<span class="text-subtext0">Personal Rating: </span>

							<input
								class="w-20 rounded px-2 outline-surface1 group-hover:outline-2 group-hover:outline-dashed focus:outline-mauve"
								value={personalRating}
								oninput={(e) => onPersonalScoreChange(Number((e.target as HTMLInputElement).value))}
								onmouseleave={(e) => (e.target as HTMLInputElement).blur()}
							/>
						</div>
					{/if}
				</div>

				<!-- Status pill -->
				<div class="bottom-0 mx-auto flex h-10 w-50 text-base">
					<button
						onclick={() => onPillMainClick()}
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
							{dateAdded}
						{:else if status === 'progress'}
							<!-- Collapsed display -->
							<div class="ml-1 group-hover:hidden">
								{#if seasonCount}Season {seasonProgress} - Ep {progressValue}
								{:else}
									{progressUnit}
									{progressValue}
									{#if progressMax}
										/ {progressMax}
									{/if}
								{/if}
							</div>

							<!-- Expanded on hover -->
							<div class="ml-1 hidden items-center group-hover:flex">
								{#if seasonCount}
									S
									<div class="mr-1 flex h-8 self-center overflow-hidden rounded-md border-2">
										<input
											class="w-8 bg-transparent text-center focus:outline-none"
											value={seasonProgress}
											oninput={(e) => onSeasonChange!(Number((e.target as HTMLInputElement).value))}
											onmouseleave={(e) => (e.target as HTMLInputElement).blur()}
										/>
										<div class="flex flex-col">
											<div
												role="button"
												tabindex="0"
												title="Next Season"
												class="flex flex-1 cursor-pointer items-center justify-center bg-surface0 px-0.5 hover:bg-surface1"
												onclick={seasonIncrease}
												onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && seasonIncrease()}
											>
												<span class="icon-[tabler--chevron-up] h-4 text-xs text-peach"></span>
											</div>
											<div
												role="button"
												tabindex="0"
												title="Previous Season"
												class="flex flex-1 cursor-pointer items-center justify-center bg-surface0 px-0.5 hover:bg-surface1"
												onclick={seasonDecrease}
												onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && seasonDecrease()}
											>
												<span class="icon-[tabler--chevron-down] h-4 text-xs text-peach"></span>
											</div>
										</div>
									</div>
								{/if}
								Ep

								<div class="flex h-8 self-center overflow-hidden rounded-md border-2">
									<input
										class="w-8 bg-transparent text-center focus:outline-none"
										value={progressValue}
										oninput={(e) => onProgressChange(Number((e.target as HTMLInputElement).value))}
										onmouseleave={(e) => (e.target as HTMLInputElement).blur()}
									/>
									<div class="flex flex-col">
										<div
											role="button"
											tabindex="0"
											title="Increase"
											class="flex flex-1 cursor-pointer items-center justify-center bg-surface0 px-0.5 hover:bg-surface1"
											onclick={progressIncrease}
											onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && progressIncrease()}
										>
											<span class="icon-[tabler--chevron-up] h-4 text-xs text-peach"></span>
										</div>
										<div
											role="button"
											tabindex="0"
											title="Decrease"
											class="flex flex-1 cursor-pointer items-center justify-center bg-surface0 px-0.5 hover:bg-surface1"
											onclick={progressDecrease}
											onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && progressDecrease()}
										>
											<span class="icon-[tabler--chevron-down] h-4 text-xs text-peach"></span>
										</div>
									</div>
								</div>
							</div>
						{:else if status === 'planned'}
							Planned
						{:else}
							Mark {statusVerbs.completed}
						{/if}
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
									onclick={() => onStatusChange('completed')}
									class="dropdown-button hover:bg-blue"
								>
									<span class="icon-[fluent-mdl2--completed-solid] text-xs"></span>
									{statusVerbs.completed}
								</button><button
									onclick={() => onStatusChange('progress')}
									class="dropdown-button hover:bg-peach"
								>
									<span class="icon-[uil--eye] text-xs"></span>
									{statusVerbs.progress}
								</button><button
									onclick={() => onStatusChange('planned')}
									class="dropdown-button hover:bg-pink"
								>
									<span class="icon-[uil--calendar] text-xs"></span>{statusVerbs.planned}
								</button>
								{#if status}
									<button onclick={() => onStatusChange(null)} class="dropdown-button hover:bg-red">
										<span class="icon-[icon-park-solid--close-one] text-xs"></span>Remove
									</button>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../routes/layout.css";

	.dropdown-button {
		@apply flex items-center gap-2 py-1 pr-4 pl-2 transition-colors duration-300 hover:text-surface0;
	}

	.corner {
		position: absolute;
		width: 20px;
		height: 20px;
		opacity: 0;
		pointer-events: none;
		z-index: 10;
		border-color: var(--color-mauve);
		border-style: solid;
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}

	.corner-tl {
		top: -3px;
		left: -3px;
		border-width: 2px 0 0 2px;
		transform: translate(-6px, -6px);
	}

	.corner-tr {
		top: -3px;
		right: -3px;
		border-width: 2px 2px 0 0;
		transform: translate(6px, -6px);
	}

	.corner-bl {
		bottom: -3px;
		left: -3px;
		border-width: 0 0 2px 2px;
		transform: translate(-6px, 6px);
	}

	.corner-br {
		bottom: -3px;
		right: -3px;
		border-width: 0 2px 2px 0;
		transform: translate(6px, 6px);
	}

	.group:hover .corner {
		opacity: 1;
		transform: translate(0, 0);
	}
</style>
