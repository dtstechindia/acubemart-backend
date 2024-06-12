import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Image from "../models/image.model.js";
import Product from "../models/product.model.js";



/* Add New Image */
const addNewImage = async (req, res, next) => {
    const { url, productId, isFeatured } = req.body;
    if (!url || !productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const image = await Image.create({ 
            url,
            productId,
            isFeatured
        });

        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        product.image.push(image._id);
        await product.save();

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
    if (!productId) return next(apiErrorHandler(400, "ProductId is required"));
    
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
    const imageId  = req.params.id;
    if (!imageId) return next(apiErrorHandler(400, "ImageId is required"));
    try {
        const image = await Image.findById(imageId);
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


/* Update Image by Id */
const updateImageById = async (req, res, next) => {
    const imageId  = req.params.id;
    if (!imageId) return next(apiErrorHandler(400, "Image Id not found"));
    const { url, productId, isFeatured } = req.body;
    
    try {
        const image = await Image.findByIdAndUpdate(
            imageId, 
            { 
                url, 
                productId, 
                isFeatured 
            }, { 
                new: true, 
                runValidators: true
            }
        );
        if (!image) return next(apiErrorHandler(404, "No Image Found"));
        
        return res.status(200).json({
            success: true,
            message: "Image Updated Successfully",
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
    updateImageById,
    deleteImage 
}