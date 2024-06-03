import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Order from "../models/order.model.js";


/* Add New Order */
const addNewOrder = async (req, res, next) => {
    const { userId, products, total, address, phone, status, paymentMode, isPaid } = req.body;
    if (!userId || !products || !total || !address || !phone || !status || !paymentMode || !isPaid) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const order = await Order.create({ 
            userId, 
            products, 
            total, 
            address,
            phone,
            status,
            paymentMode,
            isPaid
        });

        if (!order) return next(apiErrorHandler(404, "No Order Found"));

        return res.status(201).json({
            success: true,
            message: "Order Added Successfully",
            data: order
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get All Orders by UserId */
const getAllOrders = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const orders = await Order.find({ userId });
        if (!orders) return next(apiErrorHandler(404, "No Orders Found"));  

        return res.status(200).json({
            success: true,
            message: "Orders Fetched Successfully",
            data: orders
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get Order by Id */
const getOrderById = async (req, res, next) => {
    const orderId  = req.params.id;
    if (!orderId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const order = await Order.findById(orderId);
        if (!order) return next(apiErrorHandler(404, "No Order Found"));

        return res.status(200).json({
            success: true,
            message: "Order Fetched Successfully",
            data: order
        })
        
    } catch (error) {
        next(error);
    }
};


export { 
    addNewOrder, 
    getAllOrders, 
    getOrderById 
}