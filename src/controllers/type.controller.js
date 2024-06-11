import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Type from "../models/type.model.js";


/* Add New Type */
const addNewType = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) return next(apiErrorHandler(400, "Type Name is required"));
        
        const type = await Type.create({ 
            name
         });

        res.status(201).json({ 
            success: true, 
            message: "Type Added Successfully",
            data: type
            
        });

    } catch (error) {
        next(error);
    }
}


/* Get All Types */
const getAllTypes = async (req, res, next) => {
    try {
        const types = await Type.find();
        res.status(200).json({ 
            success: true, 
            message: "Types Fetched Successfully",
            data: types 
        });
    } catch (error) {
        next(error);
    }
}


/* Delete Type */
const deleteType = async (req, res, next) => {
    try {
        const  id  = req.params.id;
        if (!id) return next(apiErrorHandler(400, "Type Id is required"));
        
        const type = await Type.findByIdAndDelete(id);
        if (!type) return next(apiErrorHandler(404, "Type not found"));
        
        res.status(200).json({ 
            success: true, 
            message: "Type Deleted Successfully",
            data: type
        });
    } catch (error) {
        next(error);
    }
}


export {
    addNewType,
    getAllTypes,
    deleteType
}