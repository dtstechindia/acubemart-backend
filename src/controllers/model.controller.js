import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Model from "../models/model.model.js";


/* Add New Model */
const addNewModel = async (req, res, next) => {
    const { name, description, brandId, categoryId, typeId } = req.body;
    if (!name || !description) return next(apiErrorHandler(400, "Please provide all fields"));
    
    if (!brandId) return next(apiErrorHandler(404, "BrandId is required"));
    if (!categoryId) return next(apiErrorHandler(404, "CategoryId is required"));
    if (!typeId) return next(apiErrorHandler(404, "TypeId is required"));
    
    try {
        const model = await Model.create({ 
            name, 
            description, 
            brandId, 
            categoryId,
            typeId
        });

        if (!model) return next(apiErrorHandler(404, "No Model Found"));

        return res.status(201).json({
            success: true,
            message: "Model Added Successfully",
            data: model
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get All Models */
const getAllModels = async (req, res, next) => {
    try {
        const models = await Model.find().populate("brandId categoryId");
        if (!models) return next(apiErrorHandler(404, "No Models Found"));

        return res.status(200).json({
            success: true,
            message: "Models Fetched Successfully",
            data: models
        })
        
    } catch (error) {
        next(error);
    }
};


/* Delete Model */
const deleteModel = async (req, res, next) => {
    const { modelId } = req.body;
    if (!modelId) return next(apiErrorHandler(404, "Model not found"));
    
    try {
        const model = await Model.findByIdAndDelete(modelId);
        if (!model) return next(apiErrorHandler(404, "No Model Found"));

        return res.status(200).json({
            success: true,
            message: "Model Deleted Successfully",
            data: model
        })
        
    } catch (error) {
        next(error);
    }
};          

export { 
        addNewModel,
        getAllModels,
        deleteModel 
    }