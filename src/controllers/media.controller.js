import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Media from "../models/media.model.js";
import Category from "../models/category.model.js";
import Element from "../models/element.model.js";

import { uploadSingleImage } from "../utils/cloudinary.middleware.js";


/* Add New Media For Category */
const addNewMediaForCategory = async (req, res, next) => {
    const categoryId  = req.params.id;
    if (!categoryId) return next(apiErrorHandler(400, "CategoryId is required"));

    try {
        const mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

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
        const mediaUrl = await uploadSingleImage(req, res, next);
        if (!mediaUrl) return next(apiErrorHandler(400, "Media upload failed"));

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


export { 
    addNewMediaForCategory,
    addNewMediaForElement, 
    getMediaById, 
    deleteMediaById 
}