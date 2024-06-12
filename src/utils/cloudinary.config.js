import { v2 as cloudinary } from 'cloudinary' 

//Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


//Upload Multiple Images
export const uploadMultipleImages = async (images) => {
    const imageUrls = [];
    for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
            folder: "acubemart",
            resource_type: "image",
            overwrite: true,
            unique_filename: false,
            use_filename: true,
            transformation: [{ width: 400, height: 400, gravity: "auto", crop: "fill" }],
        });
        imageUrls.push({
            url: result.secure_url,
            public_id: result.public_id
        });
    }

    return imageUrls;
}