import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Product from "../models/product.model.js";

/* Add New Product */
const addNewProduct = async (req, res, next) => {
    const { name, price, description, stock, image, category, size, color, brand, model } = req.body;
    if (!name || !price || !description || !stock || !image || !size || !color) return next(apiErrorHandler(400, "Please provide all fields"));
    
    if (!category || !brand || !model) return next(apiErrorHandler(404, "Category or Brand or Model not found"));
    
    try {
        const product = await Product.create({ 
            name, 
            price, 
            description, 
            stock, 
            image, 
            category, 
            size, 
            color,
            brand,
            model
        });

        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        return res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            data: product
        })
        
    } catch (error) {
        next(error);
    }
};

/*  Get All Products */
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        if (!products) return next(apiErrorHandler(404, "No Products Found"));

        return res.status(200).json({
            success: true,
            message: "Products Fetched Successfully",
            data: products
        })
    } catch (error) {
        next(error);
    }
}

/* Get Product by Id */
const getProductById = async (req, res, next) => {
    const productId  = req.params.id;
    if (!productId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        return res.status(200).json({
            success: true,
            message: "Product Fetched Successfully",
            data: product
        })
        
    } catch (error) {
        next(error);
    }
};

/* Edit Product by Id */
const editProductById = async (req, res, next) => {
    const productId  = req.params.id;
    if (!productId) return next(apiErrorHandler(400, "Product Id not found"));
    
    try {
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        /* Update Product */
        const { name, price, description, stock, image, category, size, color, brand, model } = req.body;
        
        product.name = name;
        product.price = price;
        product.description = description;
        product.stock = stock;
        product.image = image;
        product.category = category;
        product.size = size;
        product.color = color;
        product.brand = brand;
        product.model = model;
        await product.save();
        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            data: product
        })
        
    } catch (error) {
        next(error);
    }
};

/* Delete Product */
const deleteProductById = async (req, res, next) => {
    const productId  = req.params.id;
    if (!productId) return next(apiErrorHandler(400, "Product Id not found"));
    
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));
        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully",
            data: product
        })        
    } catch (error) {
        next(error);
    }
};

export {
    addNewProduct,
    getAllProducts,
    getProductById,
    editProductById,
    deleteProductById
}