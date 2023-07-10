<script>
	export let src;
	export let alt;

	import { onMount } from 'svelte';

	let loaded = false;
	let thisImage;

	onMount(() => {
		thisImage.onload = () => {
			loaded = true;
		};
	});
</script>

<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" />

<style>
	img {
		opacity: 0;
		transition: opacity 1200ms ease-out;
		vertical-align: top;
	}
	img.loaded {
		opacity: 1;
	}
</style>
