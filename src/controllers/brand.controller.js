import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Brand from "../models/brand.model.js";


/* Add New Brand */
const addNewBrand = async (req, res, next) => {
    const { name, logo, description, typeId } = req.body;
    if (!name) return next(apiErrorHandler(400, "Please provide all fields"));
    
    if (!typeId) return next(apiErrorHandler(404, "Category or Type not found"));

    try {
        const brand = await Brand.create({ 
            name,  
            description, 
            typeId
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
        const brands = await Brand.find().sort({ createdAt: -1 })
        .populate({ path: "typeId", select: "name _id", strictPopulate: false })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });

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


/* Get All Active Brands */
const getAllActiveBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort({ createdAt: -1 })
        .populate({ path: "typeId", select: "name _id", strictPopulate: false })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });

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


/* Get Brand By Id */
const getBrandById = async (req, res, next) => {
    const brandId = req.params.id;
    if (!brandId) return next(apiErrorHandler(400, "Brand Id not found"));

    try {
        const brand = await Brand.findById(brandId)
        .populate({ path: "typeId", select: "name _id", strictPopulate: false })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!brand) return next(apiErrorHandler(404, "No Brand Found"));

        return res.status(200).json({
            success: true,
            message: "Brand Fetched Successfully",
            data: brand
        })
        
    } catch (error) {
        next(error);
    }   
};


/* Update Brand by Id */
const updateBrandById = async (req, res, next) => {
    const brandId  = req.params.id;
    if (!brandId) return next(apiErrorHandler(400, "Brand Id not found"));

    const { name, description, typeId, isActive } = req.body;

    try {
        const brand = await Brand.findByIdAndUpdate(
            brandId, 
            { 
                name,  
                description,
                typeId,
                isActive 
            }, { 
                new: true, 
                runValidators: true 
            }
        );
        if (!brand) return next(apiErrorHandler(404, "No Brand Found"));

        
        return res.status(200).json({
            success: true,
            message: "Brand Updated Successfully",
            data: brand
        })
        
    } catch (error) {
        next(error);
    }    
};

/* Delete Brand */
const deleteBrand = async (req, res, next) => {
    const brandId = req.params.id;
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
    getAllActiveBrands,
    getBrandById,
    updateBrandById,
    deleteBrand
}