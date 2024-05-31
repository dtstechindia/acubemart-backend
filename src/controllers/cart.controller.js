import Cart from "../models/cart.model.js";


/* Add New Product */
const addToCart = async (req, res, next) => {
    const { userId, products } = req.body;
    if (!userId ) return next(apiErrorHandler(400, "User not found"));

    if (!products) return next(apiErrorHandler(400, "Please Add Products"));
    
    try {
        const cart = await Cart.create({ 
            userId, 
            products
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