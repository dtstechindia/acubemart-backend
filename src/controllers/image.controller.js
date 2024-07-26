import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Image from "../models/image.model.js";
import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";

import { uploadMultipleImages, uploadSingleImage } from "../utils/cloudinary.middleware.js";



/* Add or upload array of images by ProductId */
const addImagesByProductId = async (req, res, next) => {
    const { productId } = req.body;
    
    if (!productId) return next(apiErrorHandler(400, "ProductId is required"));
    //Upload Multiple Images
    const imageUrls = await uploadMultipleImages(req, res, next); 
    //console.log(imageUrls);
    if (!imageUrls) return next(apiErrorHandler(400, "Images upload failed"));

    const images = [];
    try {
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        for (let index = 0; index < imageUrls.length; index++) {
            const image = await Image.create({ 
                url: imageUrls[index],
                productId
            });

            images.push(image);
            product.image.push(image._id);
            await product.save();
        }

        return res.status(201).json({
            success: true,
            message: "Images Added Successfully",
            data: images
        })
        
    } catch (error) {
        next(error);
    }
};

/* Add New Image */
const addNewImage = async (req, res, next) => {
    const { productId, isFeatured } = req.body;
    if (!productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const imageUrl = await uploadSingleImage(req, res, next);
        if (!imageUrl) return next(apiErrorHandler(400, "Image upload failed"));

        const image = await Image.create({ 
            url: imageUrl,
            productId,
            isFeatured
        });

        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        product.image.push(image._id);
        product.featuredImage = image._id;
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


/* Add new Image for variants */
const addNewImageForVariant = async (req, res, next) => {
    const { productId, variantId } = req.body;
    if (!productId || !variantId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const imageUrl = await uploadSingleImage(req, res, next);
        if (!imageUrl) return next(apiErrorHandler(400, "Image upload failed"));

        const image = await Image.create({ 
            url: imageUrl,
            productId,
        });

        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        product.image.push(image._id);
        await product.save();

        const variant = await Variant.findById(variantId);
        if (!variant) return next(apiErrorHandler(404, "No Variant Found"));

        variant.image.push(image._id);
        await variant.save();

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

    const { isFeatured } = req.body;
    
    try {
        const image = await Image.findByIdAndUpdate(
            imageId, 
            {  
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
    const imageId = req.params.id;
    if (!imageId) return next(apiErrorHandler(404, "Image not found"));
    
    try {
        const image = await Image.findByIdAndDelete(imageId);
        if (!image) return next(apiErrorHandler(404, "No Image Found"));

        const product = await Product.findById(image.productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        const index = product.image.indexOf(image._id);
        if (index > -1) {
            product.image.splice(index, 1);
            await product.save();
        }

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
    addImagesByProductId, 
    getImagesByProductId,
    addNewImageForVariant,
    getImageById,
    updateImageById,
    deleteImage 
}