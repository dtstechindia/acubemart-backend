import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Product from "../models/product.model.js";

/* Add New Product */
const addNewProduct = async (req, res, next) => {
    const { name, price, description, stock, category, element, brand, model, type, status, additionalInfo, barcode, sku } = req.body;
    if (!name || !price || !description || !stock  ) return next(apiErrorHandler(400, "Please provide all fields"));

    if (!category) return next(apiErrorHandler(404, "Category is required"));

    if (!element) return next(apiErrorHandler(404, "Element is required"));
    
    if (!type) return next(apiErrorHandler(404, "Type is required"));
    
    if (!brand) return next(apiErrorHandler(404, "Brand is required"));

    if (!model) return next(apiErrorHandler(404, "Model is required"));
    
    try {
        //Generating slug for product name as it is unique
        let slug = name.split(" ").join("-").toLowerCase();

        //Checking if slug already exists
        let slugExists = await Product.findOne({ slug });

        //add unique slug suffix number if slug already exists
        if (slugExists) {
            let newSlug = `${slug}-s${ Math.floor(1000 + Math.random() * 9000) }`;
            slug = newSlug;
        }

        const product = await Product.create({ 
            name, 
            price, 
            description, 
            stock,  
            category, 
            element,
            brand,
            model,
            type,
            slug,
            status,
            additionalInfo,
            barcode,
            sku
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

/* Get All Published Products */
const getAllPublishedProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ status: "published" })
        .populate({ path: "type", select: "name _id" })
        .populate({ path: "category", select: "name description isActive _id" })
        .populate({ path: "element", select: "name description _id" })
        .populate({ path: "brand", select: "name logo description _id" })
        .populate({ path: "model", select: "name description _id" })
        .populate({ path: "image", select: "url isFeatured _id", strictPopulate: false  })
        .populate({ path: "attributes", select: "name value _id", strictPopulate: false  })
        .populate({ path: "variants", select: "size color price quantity image isFeatured _id", strictPopulate: false });
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

/*  Get All Products */
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
        .populate({ path: "type", select: "name _id" })
        .populate({ path: "category", select: "name description _id" })
        .populate({ path: "element", select: "name description _id" })
        .populate({ path: "brand", select: "name logo description _id" })
        .populate({ path: "model", select: "name description _id" })
        .populate({ path: "image", select: "url isFeatured _id", strictPopulate: false  })
        .populate({ path: "attributes", select: "name value _id", strictPopulate: false  });
        
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
        const product = await Product.findById(productId)
        .populate({ path: "type", select: "name _id" })
        .populate({ path: "category", select: "name description _id" })
        .populate({ path: "element", select: "name description _id" })
        .populate({ path: "brand", select: "name logo description _id" })
        .populate({ path: "model", select: "name description _id" })
        .populate({ path: "image", select: "url isFeatured _id", strictPopulate: false  })
        .populate({ path: "attributes", select: "name value _id", strictPopulate: false  })
        .populate({ path: "variants", select: "size color price quantity image isFeatured _id", strictPopulate: false });
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
    const { name, price, description, stock, image, category, element, brand, model, type, variant, additionalInfo, attributes, status } = req.body;

    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { 
                name,
                price,
                description, 
                stock, 
                image, 
                category, 
                element,
                brand, 
                model, 
                type, 
                variant, 
                additionalInfo, 
                attributes,
                status 
            },
            { 
                new: true, 
                runValidators: true 
            }
        );
        
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


//Filter Get routes
//todo
/* Get All Products By Type, Category, Brand, Model Id */

export {
    addNewProduct,
    getAllProducts,
    getAllPublishedProducts,
    getProductById,
    editProductById,
    deleteProductById,
}