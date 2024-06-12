import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Attribute from "../models/attribute.model.js";
import Product from "../models/product.model.js";


/* Add New Attribute */
const addNewAttribute = async (req, res, next) => {
    const { name, value, productId } = req.body;
    if (!name || !value || !productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const attribute = await Attribute.create({ 
            name, 
            value,
            productId
         });
         
         const product = await Product.findById(productId);
         if (!product) return next(apiErrorHandler(404, "No Product Found"));

         product.attributes.push(attribute._id);
         await product.save();

        return res.status(201).json({
            success: true,
            message: "Attribute Added Successfully",
            data: attribute
        })
        
    } catch (error) {
        next(error);
    }
}



/* Get All Attributes by ProductId  */
const getAllAttributes = async (req, res, next) => {
    const { productId } = req.body;
    if (!productId) return next(apiErrorHandler(400, "ProductId is required"));
    
    try {
        const attributes = await Attribute.find({ productId });
        if (!attributes) return next(apiErrorHandler(404, "No Attributes Found"));
        
        return res.status(200).json({
            success: true,
            message: "Attributes Fetched Successfully",
            data: attributes
        })  
    } catch (error) {
        next(error);
    }
}


/* Update Attribute by Id */
const updateAttribute = async (req, res, next) => {
    const { attributeId, name, value, productId } = req.body;
    if (!attributeId) return next(apiErrorHandler(400, "AttributeId is required"));
    
    try {
        const attribute = await Attribute.findByIdAndUpdate(
            attributeId, 
            {
                name, 
                value,
                productId
            },
            { 
                new: true,
                runValidators: true 
            }
        );
        if (!attribute) return next(apiErrorHandler(404, "No Attribute Found"));
        
        return res.status(200).json({
            success: true,
            message: "Attribute Updated Successfully",
            data: attribute
        })  
    } catch (error) {
        next(error);
    }
}

/* Delete Attribute by Id */
const deleteAttribute = async (req, res, next) => {
    const { attributeId } = req.body;
    if (!attributeId) return next(apiErrorHandler(400, "AttributeId is required"));
    
    try {
        const attribute = await Attribute.findByIdAndDelete(attributeId);
        if (!attribute) return next(apiErrorHandler(404, "No Attribute Found"));
        
        return res.status(200).json({
            success: true,
            message: "Attribute Deleted Successfully",
            data: attribute
        })  
    } catch (error) {
        next(error);
    }
}


export { 
    addNewAttribute, 
    getAllAttributes, 
    updateAttribute,
    deleteAttribute 
}