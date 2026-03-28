<script lang="ts">
	import { onMount } from 'svelte';
	import { getSearchContext } from './context';

	const search = getSearchContext();
	let value = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	function oninput(e: Event) {
		value = (e.target as HTMLInputElement).value;
		clearTimeout(debounceTimer);

		if (!value) {
			search.searchTerm = '';
			return;
		}

		debounceTimer = setTimeout(() => {
			search.searchTerm = value;
		}, 500);
	}

	const base = 'Search for ';
	const suffixes = [
		'anything...',
		'One Piece',
		'Better Call Saul',
		'The Strength of the Few',
		'Witch Hat Atelier'
	];

	let placeholder = $state(base + suffixes[0]);

	onMount(() => {
		let suffixIndex = 0;
		let characterIndex = suffixes[0].length; // starts full, so deletes first
		type Phase = 'deleting' | 'typing';
		let phase: Phase = 'deleting';

		function tick() {
			const suffix = suffixes[suffixIndex];

			if (phase === 'deleting') {
				if (characterIndex > 0) {
					characterIndex--;
					placeholder = base + suffix.slice(0, characterIndex);
					setTimeout(tick, 50);
				} else {
					phase = 'typing';
					characterIndex = 0;
					suffixIndex = (suffixIndex + 1) % suffixes.length;
					setTimeout(tick, 250);
				}
			} else {
				if (characterIndex < suffixes[suffixIndex].length) {
					characterIndex++;
					placeholder = base + suffix.slice(0, characterIndex);
					setTimeout(tick, 100);
				} else {
					phase = 'deleting';
					setTimeout(tick, 2500);
				}
			}
		}

		const timeout = setTimeout(tick, 2500);
		return () => clearTimeout(timeout);
	});
</script>

<div class="fixed top-0 right-0 left-0 z-100 flex h-20 items-center bg-mantle lg:left-60">
	<div class="flex w-full justify-center px-4">
		<input
			type="text"
			{value}
			{oninput}
			{placeholder}
			class="w-100 rounded-lg bg-surface0/60 px-4 py-2 text-text focus:ring-2 focus:ring-surface0/80 focus:outline-none"
		/>
	</div>
</div>
