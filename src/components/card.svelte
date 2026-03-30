<script lang="ts">
	let { img, children } = $props();
</script>

<div class="group relative w-120">
	<!-- Gaming corner brackets -->
	<span class="corner corner-tl"></span>
	<span class="corner corner-tr"></span>
	<span class="corner corner-bl"></span>
	<span class="corner corner-br"></span>

	<div
		class="grid h-fit grid-cols-5 overflow-hidden rounded-sm bg-linear-to-l from-surface0/60 to-surface0/20"
	>
		<div class="col-span-2 aspect-7/10 w-full overflow-hidden">
			<img
				src={img}
				alt="alt"
				class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
			/>
		</div>
		<div class="col-span-3 p-4">{@render children()}</div>
	</div>
</div>

<style>
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
