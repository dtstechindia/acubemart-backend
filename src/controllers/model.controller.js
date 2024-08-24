import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Model from "../models/model.model.js";


/* Add New Model */
const addNewModel = async (req, res, next) => {
    const { name, description, brandId, typeId } = req.body;
    if (!name) return next(apiErrorHandler(400, "Please provide all fields"));
    if (!brandId) return next(apiErrorHandler(404, "BrandId is required"));
    if (!typeId) return next(apiErrorHandler(404, "TypeId is required"));
    
    try {
        const model = await Model.create({ 
            name, 
            description, 
            brandId,
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
        const models = await Model.find().sort({ createdAt: -1 })
            .populate("brandId typeId")
            .populate({ path: "brandId", select: "name _id", strictPopulate: false })
            .populate({ path: "typeId", select: "name _id", strictPopulate: false })
            .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
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


/* Get Model By Id */
const getModelById = async (req, res, next) => {
    const modelId = req.params.id;
    if (!modelId) return next(apiErrorHandler(400, "Model Id not found"));
    try {
        const model = await Model.findById(modelId).populate("brandId typeId")
            .populate({ path: "brandId", select: "name _id", strictPopulate: false })
            .populate({ path: "typeId", select: "name _id", strictPopulate: false })
            .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!model) return next(apiErrorHandler(404, "No Model Found"));

        return res.status(200).json({
            success: true,
            message: "Model Fetched Successfully",
            data: model
        })
        
    } catch (error) {
        next(error);
    }   
};


/* Update Model by Id */
const updateModelById = async (req, res, next) => {
    const modelId  = req.params.id;
    if (!modelId) return next(apiErrorHandler(400, "Model Id not found"));
    const { name, description, brandId, typeId } = req.body;
    
    try {
        const model = await Model.findByIdAndUpdate(
            modelId, 
            { 
                name, 
                description,
                brandId,
                typeId
            }, { 
                new: true, 
                runValidators: true
            }
        );
        if (!model) return next(apiErrorHandler(404, "No Model Found"));
        
        return res.status(200).json({
            success: true,
            message: "Model Updated Successfully",
            data: model
        })
        
    } catch (error) {
        next(error);
    }
};


/* Delete Model */
const deleteModel = async (req, res, next) => {
    const modelId = req.params.id;
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
        getModelById,
        updateModelById,
        deleteModel 
    }