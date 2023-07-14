export async function load({ fetch, url }) {

    const response = await fetch(`${url.origin}/api/gallery`);
    const imageList = await response.json();

    return {
        galleryImages: imageList.galleryImages,
        carouselImages: imageList.carouselImages,
    };
}