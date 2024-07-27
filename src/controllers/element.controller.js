import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Element from "../models/element.model.js";


/* Add new element */
const addNewElement = async (req, res, next) => {
    const { name, description, categoryId, typeId, stock, mediaId } = req.body;
    if (!name || !stock) return next(apiErrorHandler(400, "Please provide all fields"));
    if (!categoryId) return next(apiErrorHandler(404, "CategoryId is required"));
    if (!typeId) return next(apiErrorHandler(404, "TypeId is required"));
    
    try {
        const element = await Element.create({ 
            name, 
            description, 
            categoryId,
            typeId,
            stock,
            mediaId,
        });

        res.status(201).json({
            success: true,
            message: "Element Added Successfully",
            data: element
        })
        
    } catch (error) {
        next(error);
    }
}


/* Get All Elements */
const getAllElements = async (req, res, next) => {
    try {
        const elements = await Element.find()
        .populate({ path: "categoryId", select: "name _id" })
        .populate({ path: "typeId", select: "name _id" })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!elements) return next(apiErrorHandler(404, "No Elements Found"));
        res.status(200).json({
            success: true,
            message: "All Elements",
            data: elements
        })
    } catch (error) {
        next(error);
    }
}  


/* Get Element by Id */
const getElementById = async (req, res, next) => {
    const elementId  = req.params.id;
    if (!elementId) return next(apiErrorHandler(400, "Element Id not found"));
    
    try {
        const element = await Element.findById(elementId)
        .populate({ path: "categoryId", select: "name _id" })
        .populate({ path: "typeId", select: "name _id" })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!element) return next(apiErrorHandler(404, "No Element Found"));
        res.status(200).json({
            success: true,
            message: "Element",
            data: element
        })
    } catch (error) {
        next(error);
    }
}


/* Get All Elements by Category Id */
const getAllElementsByCategoryId = async (req, res, next) => {
    const categoryId = req.params.id;
    if (!categoryId) return next(apiErrorHandler(400, "Category Id not found"));
    
    try {
        const elements = await Element.find({ categoryId })
        .populate({ path: "categoryId", select: "name _id" })
        .populate({ path: "typeId", select: "name _id" })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!elements) return next(apiErrorHandler(404, "No Elements Found"));
        res.status(200).json({
            success: true,
            message: "All Elements",
            data: elements
        })
    } catch (error) {
        next(error);
    }
}


/* Update Element by Id */
const updateElementById = async (req, res, next) => {
    const elementId  = req.params.id;
    if (!elementId) return next(apiErrorHandler(400, "Element Id not found"));
    const { name, description, categoryId, typeId, mediaId } = req.body;
    
    try {
        const element = await Element.findByIdAndUpdate(
            elementId, 
            { 
                name, 
                description,
                categoryId,
                typeId,
                mediaId
            }, { 
                new: true, 
                runValidators: true
            }
        );
        if (!element) return next(apiErrorHandler(404, "No Element Found"));
        res.status(200).json({
            success: true,
            message: "Element Updated Successfully",
            data: element
        })
        
    } catch (error) {
        next(error);
    }
}


/* Delete Element by Id */
const deleteElementById = async (req, res, next) => {
    const elementId  = req.params.id;
    if (!elementId) return next(apiErrorHandler(400, "Element Id not found"));
    
    try {
        const element = await Element.findByIdAndDelete(elementId);
        if (!element) return next(apiErrorHandler(404, "No Element Found"));
        res.status(200).json({
            success: true,
            message: "Element Deleted Successfully",
            data: element
        })
        
    } catch (error) {
        next(error);
    }
}


export { 
    addNewElement, 
    getAllElements,
    getElementById,
    getAllElementsByCategoryId,
    updateElementById,
    deleteElementById 
}