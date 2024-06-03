import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Model from "../models/model.model.js";


/* Add New Model */
const addNewModel = async (req, res, next) => {
    const { name, description, brandId, categoryId } = req.body;
    if (!name || !description) return next(apiErrorHandler(400, "Please provide all fields"));
    
    if (!brandId) return next(apiErrorHandler(404, "Brand not found"));
    if (!categoryId) return next(apiErrorHandler(404, "Category not found"));
    
    try {
        const model = await Model.create({ 
            name, 
            description, 
            brandId, 
            categoryId
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
        const models = await Model.find();
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