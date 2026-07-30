import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Image from "../models/image.model.js";
import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";

import { uploadMultipleImages, uploadSingleImage, addCloudinaryTransformation } from "../utils/cloudinary.middleware.js";



/* Add or upload array of images by ProductId */
const addImagesByProductId = async (req, res, next) => {
    const { productId } = req.body;
    
    if (!productId) return next(apiErrorHandler(400, "ProductId is required"));
    try {
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));
        let imageUrls = await uploadMultipleImages(req, res, next);
        if (!imageUrls) return next(apiErrorHandler(400, "Images upload failed"));
        imageUrls = imageUrls.map(url => addCloudinaryTransformation(url));
        const images = [];

        for (let index = 0; index < imageUrls.length; index++) {
            const image = await Image.create({ 
                url: imageUrls[index],
                productId
            });

            images.push(image);
            product.image.push(image._id);
        }
        await product.save();

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
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        let imageUrl = await uploadSingleImage(req, res, next);
        if (!imageUrl) return next(apiErrorHandler(400, "Image upload failed"));

        // Apply Cloudinary transformation
        imageUrl = addCloudinaryTransformation(imageUrl);

        const image = await Image.create({ 
            url: imageUrl,
            productId,
            isFeatured
        });

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
        const [product, variant] = await Promise.all([
            Product.findById(productId),
            Variant.findById(variantId),
        ]);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));
        if (!variant || variant.productId.toString() !== productId) {
            return next(apiErrorHandler(400, "Variant does not belong to this product"));
        }

        let imageUrl = await uploadSingleImage(req, res, next);
        if (!imageUrl) return next(apiErrorHandler(400, "Image upload failed"));

        // Apply Cloudinary transformation
        imageUrl = addCloudinaryTransformation(imageUrl);

        const image = await Image.create({ 
            url: imageUrl,
            productId,
        });

        product.image.push(image._id);
        await product.save();

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

/* Update product gallery image order */
const updateProductImagesOrder = async (req, res, next) => {
    const productId = req.params.id;
    const { imagesOrder } = req.body;

    if (!productId || !Array.isArray(imagesOrder)) {
        return next(apiErrorHandler(400, "ProductId and imagesOrder are required"));
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        const currentIds = product.image.map((imageId) => imageId.toString());
        const requestedIds = imagesOrder.map(String);
        const hasExactImageSet = currentIds.length === requestedIds.length
            && currentIds.every((imageId) => requestedIds.includes(imageId));

        if (!hasExactImageSet) {
            return next(apiErrorHandler(400, "imagesOrder must contain every product image exactly once"));
        }

        const ownedImageCount = await Image.countDocuments({
            _id: { $in: requestedIds },
            productId,
        });
        if (ownedImageCount !== requestedIds.length) {
            return next(apiErrorHandler(400, "Every image must belong to this product"));
        }

        product.image = requestedIds;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product images reordered successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};


/* Update Featured Image with new image */
const updateFeaturedImage = async (req, res, next) => {
    const productId  = req.params.id;
    if (!productId) return next(apiErrorHandler(400, "ProductId is required"));
    
    try {
        let imageUrl = await uploadSingleImage(req, res, next);
        if (!imageUrl) return next(apiErrorHandler(400, "Image upload failed"));

        // Apply Cloudinary transformation
        imageUrl = addCloudinaryTransformation(imageUrl);

        const image = await Image.findOne(
            { productId, isFeatured: true }
        );
        if (image) {
            image.isFeatured = false;
            await image.save();
        }

        const newFeturedImage = await Image.create({
            url: imageUrl,
            isFeatured: true,
            productId
        });

        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        product.image.push(newFeturedImage._id);
        product.featuredImage = newFeturedImage._id;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Featured Image Updated Successfully",
            data: newFeturedImage
        })
        
    } catch (error) {
        next(error);
    }

}
            

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
        }
        if (product.featuredImage?.toString() === image._id.toString()) {
            const nextFeaturedImage = await Image.findOne({
                _id: { $in: product.image },
                productId: product._id,
            }).sort({ createdAt: 1 });
            product.featuredImage = nextFeaturedImage?._id;
        }
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Image Deleted Successfully",
            data: image
        })
        
    } catch (error) {
        next(error);
    }
};


/* Update All Image URLs with Cloudinary Transformations */
const updateAllImageUrls = async (req, res, next) => {
    try {
        // Fetch all image documents
        const allImages = await Image.find({});
        
        if (!allImages || allImages.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No image documents found to update",
                data: []
            });
        }

        const updatedImages = [];
        let updateCount = 0;

        for (const image of allImages) {
            if (image.url && image.url.includes("res.cloudinary.com")) {
                // Check if the URL already has the transformation parameters
                if (!image.url.includes("f_auto,q_auto")) {
                    // Add f_auto,q_auto after /upload/ and before /v
                    const updatedUrl = image.url.replace(
                        /\/upload\/(?=v\d+)/,
                        "/upload/f_auto,q_auto/"
                    );

                    image.url = updatedUrl;
                    await image.save();
                    updateCount++;
                }
            }
            updatedImages.push(image);
        }

        return res.status(200).json({
            success: true,
            message: `Image URLs updated successfully. Updated ${updateCount} documents out of ${allImages.length}`,
            data: {
                totalDocuments: allImages.length,
                updatedDocuments: updateCount,
                skippedDocuments: allImages.length - updateCount,
                updatedImages: updatedImages
            }
        });
        
    } catch (error) {
        next(error);
    }
}


export { 
    addNewImage,
    addImagesByProductId, 
    getImagesByProductId,
    addNewImageForVariant,
    getImageById,
    updateImageById,
    updateProductImagesOrder,
    updateFeaturedImage,
    deleteImage,
    updateAllImageUrls
}
