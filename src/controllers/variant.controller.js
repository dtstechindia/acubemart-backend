import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Variant from "../models/variant.model.js";
import Product from "../models/product.model.js";
import Image from "../models/image.model.js";


/* Add New Product Variant */
const addNewVariant = async (req, res, next) => {
    const { productId, name , variantAttributes, mrp, sp, discount, deliveryCharges, codCharges, video, description, sku, barcode, stock } = req.body;
    //console.log(req.body);
    //console.log(productId, name , variantAttributes, mrp, sp, discount, deliveryCharges, codCharges, vodeo);
    if (!productId || !name || !variantAttributes || !mrp || !sp || !discount || !deliveryCharges || !codCharges || !sku || !barcode || !stock ) return next(apiErrorHandler(400, "Please provide all fields"));
    //Add Attributes value to an array if attribute name is same
    
    const result = variantAttributes.reduce((acc, {name, value}) => {
        if(acc[name]) {
            acc[name].push(value);
        } else {
            acc[name] = [value];
        }
        return acc;
    }, {});
    
    const modifiedAttributes = Object.keys(result).map(name => ({ name, value: result[name]}));
    
    //console.log(modifiedAttributes);
    
    
    try {
        const variant = await Variant.create({ 
            productId, 
            name,
            mrp,
            sp,
            discount,
            deliveryCharges,
            codCharges, 
            variantAttributes: modifiedAttributes,
            video,
            description,
            sku,
            barcode,
            stock 
        });
        
        const product = await Product.findById(productId);
        if (!product) return next(apiErrorHandler(404, "No Product Found"));

        product.variants.push(variant._id);
        await product.save();

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
const getAllVariantsByProductId = async (req, res, next) => {
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

        

        const product = await Product.findById(variant.productId);
        product.variants.pull(variantId);
        for (let i = 0; i < variant.image.length; i++) {
            product.image.pull(variant.image[i]);
        }
        await product.save();

        for (let i = 0; i < variant.image.length; i++) {
            await Image.findByIdAndDelete(variant.image[i]);
        }
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
    getAllVariantsByProductId, 
    getVariantById,
    updateVariant,
    deleteVariant 
}