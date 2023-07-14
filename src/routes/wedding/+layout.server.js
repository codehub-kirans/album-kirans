// @ts-ignore
export async function load({ fetch, url }) {

    const response = await fetch(`${url.origin}/api/wedding`);
    const imageList = await response.json();

    return {
        galleryImages: imageList.galleryImages,
        carouselImages: imageList.carouselImages,
    };
}