import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Category from "../models/category.model.js";


/* Add New Category */
const addNewCategory = async (req, res, next) => {
    const { name, description, typeId, mediaId } = req.body;
    if (!name) return next(apiErrorHandler(400, "Please provide all fields"));
    
    if (!typeId) return next(apiErrorHandler(404, "Type not found"));
    
    try {
        const category = await Category.create({ 
            name, 
            description,
            typeId,
            mediaId,
        });
        if (!category) return next(apiErrorHandler(404, "No Category Found"));

        return res.status(201).json({
            success: true,
            message: "Category Added Successfully",
            data: category
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get All Categories */
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 })
        .populate({ path: "typeId", select: "name _id", strictPopulate: false })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!categories) return next(apiErrorHandler(404, "No Categories Found"));

        return res.status(200).json({
            success: true,
            message: "Categories Fetched Successfully",
            data: categories
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get All Active Categories */
const getAllActiveCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 })
        .populate({ path: "typeId", select: "name _id", strictPopulate: false })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!categories) return next(apiErrorHandler(404, "No Categories Found"));

        return res.status(200).json({
            success: true,
            message: "Categories Fetched Successfully",
            data: categories
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get Category By Id */
const getCategoryById = async (req, res, next) => {
    const categoryId  = req.params.id;
    if (!categoryId) return next(apiErrorHandler(400, "Category Id not found"));
    
    try {
        const category = await Category.findById(categoryId)
        .populate({ path: "typeId", select: "name _id", strictPopulate: false })
        .populate({ path: "mediaId", select: "url _id", strictPopulate: false });
        if (!category) return next(apiErrorHandler(404, "Category not found"));

        return res.status(200).json({
            success: true,
            message: "Category Fetched Successfully",
            data: category
        })
        
    } catch (error) {
        next(error);
    }
};


/* Update Category by Id */
const updateCategoryById = async (req, res, next) => {
    const categoryId  = req.params.id;
    if (!categoryId) return next(apiErrorHandler(400, "Category Id not found"));
    
    const { name, description, typeId, isActive, mediaId } = req.body;
    
    try {
        const category = await Category.findByIdAndUpdate(
            categoryId, 
            { 
                name, 
                description,
                typeId,
                isActive,
                mediaId
            },
            { 
                new: true, 
                runValidators: true 
            }
        );

        return res.status(200).json({ 
            success: true,
            message: "Category Updated Successfully",
            data: category
        })
        
    } catch (error) {
        next(error);
    }
};

/* Delete Category */
const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    if (!categoryId) return next(apiErrorHandler(404, "Category not found"));
    
    try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) return next(apiErrorHandler(404, "No Category Found"));
        
        return res.status(200).json({
            success: true,
            message: "Category Deleted Successfully",
            data: category
        })
        
    } catch (error) {
        next(error);
    }
};

export {
    addNewCategory,
    getCategories,
    getAllActiveCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategory,
    
}