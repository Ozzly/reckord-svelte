<script lang="ts">
	let { img, children } = $props();
</script>

<div
	class="grid h-fit w-120 grid-cols-5 overflow-hidden rounded-sm bg-surface0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
	<div class="col-span-2 aspect-7/10 w-full overflow-hidden">
		<img src={img} alt="alt" class="h-full w-full object-cover object-center" />
	</div>
	<div class="col-span-3 p-4">{@render children()}</div>
</div>
