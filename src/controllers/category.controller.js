import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Category from "../models/category.model.js";


/* Add New Category */
const addNewCategory = async (req, res, next) => {
    const { name, description } = req.body;
    if (!name || !description) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const category = await Category.create({ name, description });
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
        const categories = await Category.find();
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

/* Delete Category */
const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.body;
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
    deleteCategory,
    
}