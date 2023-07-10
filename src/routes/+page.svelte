<script>
	import Image from './Image.svelte';
	import { Alert, CarouselTransition } from 'flowbite-svelte';

	export let data;

	let showCaptions = false;
</script>

<div class="p-8">
	<Alert border color="dark" class="flex justify-center">
		<span class="font-medium text-center">Wedding Image Gallery</span>
	</Alert>
</div>

<div class="max-w-2xl mx-auto items-center">
	<CarouselTransition
		images={data.carouselImages}
		transitionType="fade"
		transitionParams={{ delay: 300, duration: 500 }}
		{showCaptions}
		classIndicatorDiv="flex justify-center mt-4"
		classIndicator="w-3 h-3 rounded-full bg-gray-300 mx-1"
	/>
</div>

{#each data.galleryImages as image}
	<Image src={`${image.src}`} alt="wedding gallery" />
{/each}

<!-- <Gallery items={data.galleryImages} class="gap-4 grid-cols-1 md:grid-cols-1" /> -->
