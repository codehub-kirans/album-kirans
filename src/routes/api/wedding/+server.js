import { config } from 'dotenv';
import { json, error } from '@sveltejs/kit'

// Load environment variables from .env file
config();

// Authorize account
async function authorize() {
    const APPLICATION_KEYID = import.meta.env.VITE_APPLICATION_KEYID;
    const APPLICATION_KEY = import.meta.env.VITE_APPLICATION_KEY;
    const AUTHBUFFER = Buffer.from(`${APPLICATION_KEYID}:${APPLICATION_KEY}`).toString("base64");

    const authOptions = {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + AUTHBUFFER
        }
    };

    const authResponse = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', authOptions);
    const authJson = await authResponse.json();
    // console.log(authJson);
    return authJson;
}

async function getDownloadAuthToken(authJson, filter) {
    const VALID_DURATION = 3600; // in seconds

    const downloadResponse = await fetch(
        authJson.apiInfo.storageApi.apiUrl + "/b2api/v3/b2_get_download_authorization",
        {
            method: "POST",
            headers: {
                Authorization: authJson.authorizationToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bucketId: authJson.apiInfo.storageApi.bucketId,
                fileNamePrefix: filter,
                validDurationInSeconds: VALID_DURATION,
            }),
        }
    );
    const downloadAuthJson = await downloadResponse.json();
    return downloadAuthJson.authorizationToken;
}

// List files in the bucket
async function getFileDownloadUrls(authJson, downloadAuthToken, filter) {

    const { apiInfo, authorizationToken } = authJson;
    const { apiUrl, downloadUrl, bucketId, bucketName } = apiInfo.storageApi;
    // console.log("apiUrl: " + apiUrl + "| downloadUrl: " + downloadUrl + "| AuthToken: " + authorizationToken + "| BucketId: " + bucketId);

    const fileOptions = {
        method: 'POST',
        headers: {
            Authorization: authorizationToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bucketId, prefix: filter, delimiter: '/' })
    };

    const fileResponse = await fetch(apiUrl + '/b2api/v3/b2_list_file_names', fileOptions);
    const fileJson = await fileResponse.json();
    let files = fileJson.files;

    // Uncomment for testing to limit to 2 files due to bandwidth caps
    // files = files.slice(0, 2);

    // console.log("Number of files in repo: " + Object.keys(files).length);
    // console.log(files);

    let id = 0;

    const galleryImages = files.map((file) => ({
        alt: 'Wedding Gallery',
        src: `${downloadUrl}/file/${bucketName}/${file.fileName}?Authorization=${downloadAuthToken}`,
    }));
    const carouselImages = files.map((file) => ({
        id: id++,
        name: 'Wedding Gallery',
        imgurl: `${downloadUrl}/file/${bucketName}/${file.fileName}?Authorization=${downloadAuthToken}`,
        attribution: 'Wedding Gallery',
    }));

    return { galleryImages, carouselImages };
}

export async function GET() {
    try {
        // Call the authorize function and get the API URL and token
        const authJson = await authorize();
        const filter = 'kiran-wedding-album-web-gallery/KI'

        const downloadAuthToken = await getDownloadAuthToken(authJson, filter);
        const { galleryImages, carouselImages } = await getFileDownloadUrls(authJson, downloadAuthToken, filter);

        return json({
            galleryImages: galleryImages,
            carouselImages: carouselImages,
        });
    } catch (err) {
        throw error(404, err)
    }
}