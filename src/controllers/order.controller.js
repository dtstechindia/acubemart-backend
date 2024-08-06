import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/* Add New Order */
const addNewOrder = async (req, res, next) => {
    const { userId, products, address, phone } = req.body;
    if (!userId || !products || !address || !phone) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        let total = 0;
        /* Calculate Total Price for Order Products and Update Stock */
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) return next(apiErrorHandler(404, "No Product Found"));
            if (product.stock < products[i].quantity) return next(apiErrorHandler(400, "Insufficient Stock"));
            
            total += product.sp * products[i].quantity;
        }

        /* Create New Order */
        const order = await Order.create({ 
            userId, 
            products, 
            total, 
            address,
            phone,
        });

        await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

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

/* Get all orders list of customers */
const getAllOrdersList = async (req, res, next) => {
    try {
        const orders = await Order.find()
        .populate({ path:"products.productId", select: "name slug price sp _id", populate: { path: "featuredImage", select: "url _id" } })
        .populate({ path: "address", select: "street city state country pincode _id" })
        .populate({ path: "userId", select: "name email phone _id" })
        .populate({ path: "transactionId", select: "amount paymentMode status createdAt _id", strictPopulate: false  });
        if (!orders) return next(apiErrorHandler(404, "No Orders Found"));

        return res.status(200).json({
            success: true,
            message: "Orders Fetched Successfully",
            data: orders
        })
        
    } catch (error) {
        next(error);
    }
}

/* Get All Orders by UserId */
const getAllOrdersByUserId = async (req, res, next) => {
    const userId = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "User Id is required"));
    
    try {
        const orders = await Order.find({ userId })
        .populate({ path:"products.productId", select: "name slug price sp _id", populate: { path: "featuredImage", select: "url _id" } })
        .populate({ path: "address", select: "street city state country pincode _id" })
        .populate({ path: "userId", select: "name email phone _id" })
        .populate({ path: "transactionId", select: "amount paymentMode status createdAt _id", strictPopulate: false  });
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
    if (!orderId) return next(apiErrorHandler(400, "Order Id is required"));
    
    try {
        const order = await Order.findById(orderId)
        .populate({ path:"products.productId", select: "name slug price sp sku deliveryCharges codCharges _id", populate: { path: "featuredImage", select: "url _id" } })
        .populate({ path: "address", select: "street city state country pincode _id" })
        .populate({ path: "userId", select: "name email phone _id" })
        .populate({ path: "transactionId", select: "amount paymentMode status createdAt _id", strictPopulate: false  });
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


/* Update Order */
const updateOrder = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const order = await Order.findByIdAndUpdate(id, { status })
        .populate({ path:"products.productId", select: "name slug price sp featuredImage _id" })
        .populate({ path: "address", select: "street city state country pincode _id" })
        .populate({ path: "userId", select: "name email phone _id" });
        
        if (!order) return next(apiErrorHandler(404, "No Order Found"));

        return res.status(200).json({
            success: true,
            message: "Order Updated Successfully",
            data: order
        })
        
    } catch (error) {
        next(error);
    }
};


export { 
    addNewOrder, 
    getAllOrdersList,
    getAllOrdersByUserId, 
    getOrderById,
    updateOrder 
}