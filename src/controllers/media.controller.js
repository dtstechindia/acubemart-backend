import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Media from "../models/media.model.js";
import Category from "../models/category.model.js";
import Element from "../models/element.model.js";
import Brand from "../models/brand.model.js";
import Model from "../models/model.model.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

import { uploadSingleImage, addCloudinaryTransformation } from "../utils/cloudinary.middleware.js";


/* Add New Media For Category */
const addNewMediaForCategory = async (req, res, next) => {
    const categoryId  = req.params.id;
    if (!categoryId) return next(apiErrorHandler(400, "CategoryId is required"));

    try {
        let mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

        // Apply Cloudinary transformation
        mediaUrl = addCloudinaryTransformation(mediaUrl);

        const media = await Media.create({ 
            url: mediaUrl
        });

        const category = await Category.findById(categoryId);
        if (!category) return next(apiErrorHandler(404, "No Category Found"));

        category.mediaId = media._id;
        await category.save();

        return res.status(201).json({
            success: true,
            message: "Media Added Successfully",
            data: media
        })
    } catch (error) {
        next(error);
    }
}


/* Add New Media For Element */
const addNewMediaForElement = async (req, res, next) => {
    const elementId  = req.params.id;
    if (!elementId) return next(apiErrorHandler(400, "ElementId is required"));

    try {
        let mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

        // Apply Cloudinary transformation
        mediaUrl = addCloudinaryTransformation(mediaUrl);

        const media = await Media.create({ 
            url: mediaUrl
        });

        const element = await Element.findById(elementId);
        if (!element) return next(apiErrorHandler(404, "No Element Found"));

        element.mediaId = media._id;
        await element.save();

        return res.status(201).json({
            success: true,
            message: "Media Added Successfully",
            data: media
        })  
    } catch (error) {
        next(error);
    }
}


/* Add New Media For Brand */
const addNewMediaForBrand = async (req, res, next) => {
    const brandId  = req.params.id;
    if (!brandId) return next(apiErrorHandler(400, "BrandId is required"));
    try {
        let mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

        // Apply Cloudinary transformation
        mediaUrl = addCloudinaryTransformation(mediaUrl);

        const media = await Media.create({ 
            url: mediaUrl
        });

        const brand = await Brand.findById(brandId);
        if (!brand) return next(apiErrorHandler(404, "No Brand Found"));

        brand.mediaId = media._id;
        await brand.save();

        return res.status(201).json({
            success: true,
            message: "Media Added Successfully",
            data: media
        })
    } catch (error) {
        next(error);
    }
}


/* Add New Media for Model */
const addNewMediaForModel = async (req, res, next) => {
    const modelId  = req.params.id;
    if (!modelId) return next(apiErrorHandler(400, "ModelId is required"));
    try {
        let mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

        // Apply Cloudinary transformation
        mediaUrl = addCloudinaryTransformation(mediaUrl);

        const media = await Media.create({ 
            url: mediaUrl
        });

        const model = await Model.findById(modelId);
        if (!model) return next(apiErrorHandler(404, "No Model Found"));

        model.mediaId = media._id;
        await model.save();

        return res.status(201).json({
            success: true,
            message: "Media Added Successfully",
            data: media
        })
    } catch (error) {
        next(error);
    }
}


/* Add New Media for Admin Avatar */
const addNewMediaForAdmin = async (req, res, next) => {
    const adminId  = req.params.id;
    if (!adminId) return next(apiErrorHandler(400, "AdminId is required"));
    try {
        let mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

        // Apply Cloudinary transformation
        mediaUrl = addCloudinaryTransformation(mediaUrl);

        const media = await Media.create({ 
            url: mediaUrl
        });

        const admin = await Admin.findById(adminId);
        if (!admin) return next(apiErrorHandler(404, "No Admin Found"));

        admin.avatar = media._id;
        await admin.save();

        return res.status(201).json({
            success: true,
            message: "Media Added Successfully",
            data: media
        })
    } catch (error) {
        next(error);
    }
}


/* Add New Media For User */
const addNewMediaForUser = async (req, res, next) => {
    const userId  = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "UserId is required"));
    try {
        let mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

        // Apply Cloudinary transformation
        mediaUrl = addCloudinaryTransformation(mediaUrl);

        const media = await Media.create({ 
            url: mediaUrl
        });

        const user = await User.findById(userId);
        if (!user) return next(apiErrorHandler(404, "No User Found"));

        user.avatar = media._id;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Media Added Successfully",
            data: media
        })
    } catch (error) {
        next(error);
    }
}


/* Get Media By Id */
const getMediaById = async (req, res, next) => {
    const mediaId  = req.params.id;
    if (!mediaId) return next(apiErrorHandler(400, "MediaId is required"));
    try {
        const media = await Media.findById(mediaId);
        if (!media) return next(apiErrorHandler(404, "Media not found"));
        return res.status(200).json({
            success: true,
            message: "Media Found Successfully",
            data: media
        })
        
    } catch (error) {
        next(error);
    }
}


/* Delete Media By Id */
const deleteMediaById = async (req, res, next) => {
    const mediaId  = req.params.id;
    if (!mediaId) return next(apiErrorHandler(400, "MediaId is required"));
    try {
        const media = await Media.findById(mediaId);
        if (!media) return next(apiErrorHandler(404, "Media not found"));
        return res.status(200).json({
            success: true,
            message: "Media Deleted Successfully",
            data: media
        })
        
    } catch (error) {
        next(error);
    }
}


/* Update All Media URLs with Cloudinary Transformations */
const updateAllMediaUrls = async (req, res, next) => {
    try {
        // Fetch all media documents
        const allMedia = await Media.find({});
        
        if (!allMedia || allMedia.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No media documents found to update",
                data: []
            });
        }

        const updatedMedia = [];
        let updateCount = 0;

        for (const media of allMedia) {
            if (media.url && media.url.includes("res.cloudinary.com")) {
                // Check if the URL already has the transformation parameters
                if (!media.url.includes("f_auto,q_auto")) {
                    // Add f_auto,q_auto after /upload/ and before /v
                    const updatedUrl = media.url.replace(
                        /\/upload\/(?=v\d+)/,
                        "/upload/f_auto,q_auto/"
                    );

                    media.url = updatedUrl;
                    await media.save();
                    updateCount++;
                }
            }
            updatedMedia.push(media);
        }

        return res.status(200).json({
            success: true,
            message: `Media URLs updated successfully. Updated ${updateCount} documents out of ${allMedia.length}`,
            data: {
                totalDocuments: allMedia.length,
                updatedDocuments: updateCount,
                skippedDocuments: allMedia.length - updateCount,
                updatedMedia: updatedMedia
            }
        });
        
    } catch (error) {
        next(error);
    }
}


export { 
    addNewMediaForCategory,
    addNewMediaForElement, 
    addNewMediaForModel,
    addNewMediaForBrand,
    addNewMediaForAdmin,
    addNewMediaForUser,
    getMediaById, 
    deleteMediaById,
    updateAllMediaUrls
}