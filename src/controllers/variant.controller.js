import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Variant from "../models/variant.model.js";


/* Add New Product Variant */
const addNewVariant = async (req, res, next) => {
    const { productId, varient } = req.body;
    if (!productId || !varient) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const variant = await Variant.create({ productId, varient });

        return res.status(201).json({
            success: true,
            message: "Product Variant Added Successfully",
            data: variant
        })
        
    } catch (error) {
        next(error);
    }
}


/* Get All Product Variants by ProductId */
const getAllVariants = async (req, res, next) => {
    const { productId } = req.body;
    if (!productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const variants = await Variant.find({ productId });
        if (!variants) return next(apiErrorHandler(404, "No Variants Found"));
        
        return res.status(200).json({
            success: true,
            message: "Product Variants Fetched Successfully",
            data: variants
        })  
    } catch (error) {
        next(error);
    }
}


/* Get Variant by Id */
const getVariantById = async (req, res, next) => {
    const variantId  = req.params.id;
    if (!variantId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const variant = await Variant.findById(variantId).populate("productId");
        if (!variant) return next(apiErrorHandler(404, "No Variant Found"));    

        return res.status(200).json({
            success: true,
            message: "Variant Fetched Successfully",
            data: variant
        })
    } catch (error) {
        next(error);
    }
}


/* Update Product Variant */
const updateVariant = async (req, res, next) => {
    const { id } = req.params;
    const { varient } = req.body;
    if (!id || !varient) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const variant = await Variant.findByIdAndUpdate(id, { varient });
        
        return res.status(200).json({
            success: true,
            message: "Variant Updated Successfully",
            data: variant
        })
        
    } catch (error) {
        next(error);
    }
};


/* Delete Product Variant */
const deleteVariant = async (req, res, next) => {
    const variantId  = req.params.id;
    if (!variantId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const variant = await Variant.findByIdAndDelete(variantId);
        if (!variant) return next(apiErrorHandler(404, "No Variant Found"));

        return res.status(200).json({
            success: true,
            message: "Variant Deleted Successfully",
            data: variant
        })        
    } catch (error) {
        next(error);
    }
};

export { 
    addNewVariant, 
    getAllVariants, 
    getVariantById,
    updateVariant,
    deleteVariant 
}