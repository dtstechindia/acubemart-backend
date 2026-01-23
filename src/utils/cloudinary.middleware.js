import fs from 'fs';

import { apiErrorHandler } from '../middlewares/errorhandler.middleware.js';
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
        const images = req.files;
        //console.log(images);
        if (!images) return next(apiErrorHandler(400, "Images are required"));

        if (images.length > 5) return next(apiErrorHandler(400, "Maximum 5 images can be uploaded at a time"));
        
        const imageUrls = [];
        for (const image of images) {
            //console.log(image.path);
            const result = await cloudinary.uploader.upload(image.path, {
                folder: "acubemart",
                resource_type: "image",
                overwrite: true,
                unique_filename: false,
                use_filename: true,
                //transformation: [{ width: 400, height: 400, gravity: "auto", crop: "fill" }],
            });
            imageUrls.push(result.secure_url);
        }

        //Delete Files
        for (const image of images) {
            fs.unlinkSync(image.path);
        }

        //console.log(imageUrls);
        return imageUrls;
    } catch (error) {
        //console.log(error);
        next(error);
    }
}


export const uploadSingleImage = async (req, res, next) => {
    try {
        const image = req.file;
        if (!image) return next(apiErrorHandler(400, "Image is required"));
        
        const result = await cloudinary.uploader.upload(image.path, {
            folder: "acubemart",
            resource_type: "image",
            overwrite: true,
            unique_filename: false,
            use_filename: true,
            //transformation: [{ width: 400, height: 400, gravity: "auto", crop: "fill" }],
        });
        //Delete File
        fs.unlinkSync(image.path);
        return result.secure_url;
    } catch (error) {
        //console.log(error);
        next(error);
    }
}


// Add f_auto,q_auto transformation to Cloudinary URLs
export const addCloudinaryTransformation = (url) => {
    if (!url || !url.includes("res.cloudinary.com")) {
        return url;
    }
    
    // Check if transformation already exists
    if (url.includes("f_auto,q_auto")) {
        return url;
    }
    
    // Add f_auto,q_auto after /upload/ and before /v
    return url.replace(
        /\/upload\/(?=v\d+)/,
        "/upload/f_auto,q_auto/"
    );
}