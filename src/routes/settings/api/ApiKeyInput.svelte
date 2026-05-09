<script lang="ts">
	let { label, storageKey, disabled = false } = $props();

	let showKey = $state(false);

	function oninput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		localStorage.setItem(storageKey, value);
	}
</script>

<div class="flex">
	<h3 class="w-1/3">{label}</h3>
	<div class="relative w-2/3">
		<input
			type={showKey ? 'text' : 'password'}
			class="w-full rounded-lg bg-surface1 py-1 pr-10 pl-3 text-xl transition-all hover:brightness-110 focus:outline-none disabled:opacity-40"
			{oninput}
			value={localStorage.getItem(storageKey) || ''}
			{disabled}
		/>
		<button
			class="absolute top-1/2 right-2 flex -translate-y-1/2 items-center text-subtext1 transition-colors hover:text-accent"
			onclick={() => (showKey = !showKey)}
			{disabled}
		>
			{#if showKey}
				<span class="icon-[tabler--eye]"></span>
			{:else}
				<span class="icon-[tabler--eye-off]"></span>
			{/if}
		</button>
	</div>
</div>
