import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Transaction from "../models/transaction.model.js";

import Order from "../models/order.model.js";


/* Add New Transaction */
const addNewTransaction = async (req, res, next) => {
    const { userId, orderId, paymentMode } = req.body;
    if (!userId || !orderId || !paymentMode) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        /* Get Total Amount from Order */
        let amount = 0;
        const order = await Order.findById(orderId);
        if (!order) return next(apiErrorHandler(404, "No Order Found"));

        amount = order.total;

        /* Create New Transaction */
        const transaction = await Transaction.create({ 
            userId, 
            orderId, 
            amount, 
            paymentMode, 
        });

        /* Update Order */
        order.isPaid = true;
        order.transactionId = transaction._id;
        order.status = "placed";
        order.save();

        return res.status(201).json({
            success: true,
            message: "Transaction Added Successfully",
            data: transaction
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get Transaction by Id */
const getTransactionById = async (req, res, next) => {
    const transactionId  = req.params.id;
    if (!transactionId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const transaction = await Transaction.findById(transactionId)
        .populate({ path: "orderId", select: "products total status address status phone _id" })
        .populate({ path: "userId", select: "name email _id" });
        if (!transaction) return next(apiErrorHandler(404, "No Transaction Found"));

        return res.status(200).json({
            success: true,
            message: "Transaction Fetched Successfully",
            data: transaction
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get Transaction by OrderId */
const getTransactionsByOrderId = async (req, res, next) => {
    const orderId  = req.params.id;
    if (!orderId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const transactions = await Transaction.find({ orderId })
        .populate({ path: "orderId", select: "products total status address status phone _id" })
        .populate({ path: "userId", select: "name email _id" });
        if (!transactions) return next(apiErrorHandler(404, "No Transactions Found"));

        return res.status(200).json({
            success: true,
            message: "Transactions Fetched Successfully",
            data: transactions
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get all Transactions by UserId */
const getTransactionsByUserId = async (req, res, next) => {
    const userId = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const transactions = await Transaction.find({ userId })
        .populate({ path: "orderId", select: "products total status address status phone _id" })
        .populate({ path: "userId", select: "name email _id" });
        if (!transactions) return next(apiErrorHandler(404, "No Transactions Found"));

        return res.status(200).json({
            success: true,
            message: "Transactions Fetched Successfully",
            data: transactions
        })
        
    } catch (error) {
        next(error);
    }
};


/* Delete Transaction */
const deleteTransaction = async (req, res, next) => {
    const { transactionId } = req.body;
    if (!transactionId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        if (!transaction) return next(apiErrorHandler(404, "No Transaction Found"));

        return res.status(200).json({
            success: true,
            message: "Transaction Deleted Successfully",
            data: transaction
        })
        
    } catch (error) {
        next(error);
    }
};


export { 
    addNewTransaction, 
    getTransactionById, 
    getTransactionsByOrderId,
    getTransactionsByUserId,
    deleteTransaction 
}