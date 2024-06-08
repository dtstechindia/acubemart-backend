import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Brand from "../models/brand.model.js";


/* Add New Brand */
const addNewBrand = async (req, res, next) => {
    const { name, logo, description, categoryId } = req.body;
    if (!name || !logo || !description) return next(apiErrorHandler(400, "Please provide all fields"));
    
    if (!categoryId) return next(apiErrorHandler(404, "Category not found"));

    try {
        const brand = await Brand.create({ 
            name, 
            logo, 
            description, 
            categoryId
        });

        if (!brand) return next(apiErrorHandler(404, "No Brand Found"));

        return res.status(201).json({
            success: true,
            message: "Brand Added Successfully",
            data: brand
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get All Brands */
const getAllBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find();

        if (!brands) return next(apiErrorHandler(404, "No Brands Found"));

        return res.status(200).json({
            success: true,
            message: "Brands Fetched Successfully",
            data: brands
        })
        
    } catch (error) {
        next(error);
    }
};

/* Delete Brand */
const deleteBrand = async (req, res, next) => {
    const { brandId } = req.body;
    if (!brandId) return next(apiErrorHandler(404, "Brand not found"));
    
    try {
        const brand = await Brand.findByIdAndDelete(brandId);
        if (!brand) return next(apiErrorHandler(404, "No Brand Found"));

        return res.status(200).json({
            success: true,
            message: "Brand Deleted Successfully",
            data: brand
        })
        
    } catch (error) {
        next(error);
    }
};


export {
    addNewBrand,
    getAllBrands,
    deleteBrand
}