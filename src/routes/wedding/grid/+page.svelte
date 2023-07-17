<script>
	import Image from '$lib/components/Image.svelte';
	import { Gallery, Alert, Hr } from 'flowbite-svelte';

	export let data;
</script>

<div class="p-8">
	<Alert border color="dark" class="flex justify-center">
		<span class="font-medium text-center">Wedding Image Gallery</span>
	</Alert>
</div>

<!-- <Gallery items={data.galleryImages} class="gap-4 grid-cols-1 md:grid-cols-1" /> -->

{#each data.galleryImages as image, i}
	<Image src={`${image.src}`} alt="wedding gallery" />
{/each}

<Hr class="my-8 w-64 h-1" icon>
	<svg
		aria-hidden="true"
		class="w-5 h-5 text-gray-700 dark:text-gray-300"
		viewBox="0 0 24 27"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		><path
			d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
			fill="currentColor"
		/></svg
	>
</Hr>
