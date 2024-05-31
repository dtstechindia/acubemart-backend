import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Product from "../models/product.model.js";


const addNewProduct = async (req, res, next) => {
    const { name, price, description, stock, image, category, size, color, brand, model } = req.body;
    if (!name || !price || !description || !stock || !size || !color) return next(apiErrorHandler(400, "Please provide all fields"));
    
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
        return res.status(201).json({
            success: true,
            data: product
        })
        
    } catch (error) {
        next(apiErrorHandler(error.statusCode, error.message));
    }
};


const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            success: true,
            data: products
        })
    } catch (error) {
        next(apiErrorHandler(error.statusCode, error.message));
    }
}

export {
    addNewProduct,
    getAllProducts
}