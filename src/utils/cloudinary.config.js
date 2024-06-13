import { v2 as cloudinary } from 'cloudinary' 

//Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


//Upload Multiple Images
export const uploadMultipleImages = async (req, res, next) => {
    try {
        const images = req.files.map((file) => file.path);
        if (!images) return next(apiErrorHandler(400, "Images are required"));

        if (images.length > 5) return next(apiErrorHandler(400, "Maximum 5 images can be uploaded at a time"));
        
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
            imageUrls.push(result.secure_url);
        }
    
        return imageUrls;
    } catch (error) {
        next(error);
    }
}