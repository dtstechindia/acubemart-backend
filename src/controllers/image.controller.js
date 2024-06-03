import { apiErrorHandler, errorHandler } from "../middlewares/errorhandler.middleware.js";

import Image from "../models/image.model.js";



/* Add New Image */
const addNewImage = async (req, res, next) => {
    const { url, productId } = req.body;
    if (!url || !productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const image = await Image.create({ url, productId });
        if (!image) return next(apiErrorHandler(404, "No Image Found"));

        return res.status(201).json({
            success: true,
            message: "Image Added Successfully",
            data: image
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get Image by ProductId */
const getImagesByProductId = async (req, res, next) => {
    const { productId } = req.body;
    if (!productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const images = await Image.find({ productId });
        if (!images) return next(apiErrorHandler(404, "No Images Found"));
        
        return res.status(200).json({
            success: true,
            message: "Product Images Fetched Successfully",
            data: images
        })
        
    } catch (error) {
       next(error);
    }
}


/* Get Image by Id */
const getImageById = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return next(apiErrorHandler(404, "Image not found"));

        return res.status(200).json({
            success: true,
            message: "Image Fetched Successfully",
            data: image
        })
        
    } catch (error) {
        next(error);
    }
};


/* Delete Image */
const deleteImage = async (req, res, next) => {
    const { imageId } = req.body;
    if (!imageId) return next(apiErrorHandler(404, "Image not found"));
    
    try {
        const image = await Image.findByIdAndDelete(imageId);
        if (!image) return next(apiErrorHandler(404, "No Image Found"));

        return res.status(200).json({
            success: true,
            message: "Image Deleted Successfully",
            data: image
        })
        
    } catch (error) {
        next(error);
    }
};


export { 
    addNewImage, 
    getImagesByProductId,
    getImageById,
    deleteImage 
}