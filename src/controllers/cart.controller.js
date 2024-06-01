import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Cart from "../models/cart.model.js";


/* Add New Product */
const addToCart = async (req, res, next) => {
    const { userId, productId, quantity } = req.body;
    if (!userId ) return next(apiErrorHandler(400, "User not found"));

    if (!productId || !quantity) return next(apiErrorHandler(400, "Please Add Products"));
    
    try {
        const iscart = await Cart.findOne({ userId });
        if (iscart) {
            iscart.products = [...iscart.products, { productId, quantity }];
            await iscart.save();
            return res.status(201).json({
                success: true,
                data: iscart
            })
        }
        
        const cart = await Cart.create({ 
            userId, 
            products: [{ productId, quantity }]
        });
        return res.status(201).json({
            success: true,
            data: cart
        })
        
    } catch (error) {
        next(apiErrorHandler(error.statusCode, error.message));
    }
};


/* Get Cart Products */
const getCartProducts = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const cart = await Cart.findOne({ userId });
        return res.status(200).json({
            success: true,
            data: cart
        })
        
    } catch (error) {
        next(apiErrorHandler(error.statusCode, error.message));
    }
};

export {
    addToCart,
    getCartProducts
}