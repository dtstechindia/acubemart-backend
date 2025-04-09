
import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import { getOrderNumber } from "../utils/order.counter.js";

/* Add New Order */
const addNewOrder = async (req, res, next) => {
  const { userId, products, address, phone, couponId, transactionId, total } =
    req.body;
    //console.log("order", req.body);

  if (!userId || !products || !address || !phone)
    return next(apiErrorHandler(400, "Please provide all fields"));

  try {
    const orderNumber = await getOrderNumber();
    /*
        let total = 0;
         Calculate Total Price for Order Products and Update Stock 
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) return next(apiErrorHandler(404, "No Product Found"));
            if (product.stock < products[i].quantity) return next(apiErrorHandler(400, "Insufficient Stock"));
            
            total += product.sp * products[i].quantity;
        }
        */

    /* Create New Order */
    const order = await Order.create({
      userId,
      products,
      total,
      address,
      phone,
      couponId,
      transactionId,
      total,
      orderNumber: orderNumber
    });

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    await Transaction.findByIdAndUpdate(transactionId, { $push: { orderId: order._id } });
    
    if (!order) return next(apiErrorHandler(404, "No Order Found"));

    //upddate stock
    for (let i = 0; i < order.products.length; i++) {
      const product = await Product.findById(order.products[i].productId);
      if (!product) return next(apiErrorHandler(404, "No Product Found"));
      if (product.stock < order.products[i].quantity) return next(apiErrorHandler(400, "Insufficient Stock"));
      product.stock -= order.products[i].quantity;
      await product.save();
    }

    return res.status(201).json({
      success: true,
      message: "Order Added Successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/* Get all orders list of customers */
const getAllOrdersList = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "products.productId",
        select: "name slug price sp _id",
        populate: { path: "featuredImage", select: "url _id" },
      })
      .populate({
        path: "porducts.variantId",
        select: "name mrp sp variantAttributes _id",
        strictPopulate: false,
      })
      .populate({
        path: "address",
        select: "street city state country pincode _id",
      })
      .populate({ path: "userId", select: "name email phone _id" })
      .populate({
        path: "transactionId",
        select: "amount paymentMode status createdAt _id",
        strictPopulate: false,
      })
      .populate({
        path: "couponId",
        select: "code couponType amount _id",
        strictPopulate: false,
      });
    if (!orders) return next(apiErrorHandler(404, "No Orders Found"));

    return res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/* Get All Orders count */
const getAllOrdersCount = async (req, res, next) => {
  try {
    const count = await Order.countDocuments();
    return res.status(200).json({
      success: true,
      message: "All Orders Count",
      data: count,
    });
  } catch (error) {
    next(error);
  }
};

/* Get All Orders by UserId */
const getAllOrdersByUserId = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) return next(apiErrorHandler(400, "User Id is required"));

  try {
    const orders = await Order.find({ userId })
      .populate({
        path: "products.productId",
        select: "name slug price sp _id",
        populate: { path: "featuredImage", select: "url _id" },
      })
      .populate({
        path: "porducts.variantId",
        select: "name mrp sp variantAttributes _id",
        strictPopulate: false,
      })
      .populate({
        path: "address",
        select: "street city state country pincode _id",
      })
      .populate({ path: "userId", select: "name email phone _id" })
      .populate({
        path: "transactionId",
        select: "amount paymentMode status createdAt _id",
        strictPopulate: false,
      })
      .populate({
        path: "couponId",
        select: "code couponType amount _id",
        strictPopulate: false,
      });
    if (!orders) return next(apiErrorHandler(404, "No Orders Found"));

    return res.status(200).json({
      success: true,
      message: "Orders Fetched Successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Order by Id */
const getOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) return next(apiErrorHandler(400, "Order Id is required"));

  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "products.productId",
        select: "name slug price sp sku deliveryCharges codCharges _id",
        populate: { path: "featuredImage", select: "url _id" },
      })
      .populate({
        path: "porducts.variantId",
        select: "name mrp sp variantAttributes _id",
        strictPopulate: false,
      })
      .populate({
        path: "address",
        select: "street city state country pincode _id",
      })
      .populate({ path: "userId", select: "name email phone _id" })
      .populate({
        path: "transactionId",
        select: "amount paymentMode status createdAt _id",
        strictPopulate: false,
      })
      .populate({
        path: "couponId",
        select: "code couponType amount _id",
        strictPopulate: false,
      });
    if (!order) return next(apiErrorHandler(404, "No Order Found"));

    return res.status(200).json({
      success: true,
      message: "Order Fetched Successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/* Update Order */
const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { status, couponId, remark } = req.body;
  if (!id || !status)
    return next(apiErrorHandler(400, "Please provide all fields"));

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { 
        status, 
        couponId,
        //push status and time in the statusUpdateTime array based on the status update
        $push: { 
          statusUpdateTime: { 
            status, 
            time: new Date(),
            remark
          } 
        }
      }, { new: true }
    )
      .populate({
        path: "products.productId",
        select: "name slug price sp featuredImage _id",
      })
      .populate({
        path: "porducts.variantId",
        select: "name mrp sp variantAttributes _id",
        strictPopulate: false,
      })
      .populate({
        path: "address",
        select: "street city state country pincode _id",
      })
      .populate({ path: "userId", select: "name email phone _id" })
      .populate({
        path: "couponId",
        select: "code couponType amount _id",
        strictPopulate: false,
      });
    if (!order) return next(apiErrorHandler(404, "No Order Found"));

    return res.status(200).json({
      success: true,
      message: "Order Updated Successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/* Delete Order by Id */
const deleteOrderById = async (req, res, next) => {
  const orderId = req.params.id;
  if (!orderId) return next(apiErrorHandler(400, "Order Id is required"));

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return next(apiErrorHandler(404, "No Order Found"));

    //delete transactions related to order by order id
    await Transaction.deleteMany({ orderId });

    return res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  addNewOrder,
  getAllOrdersList,
  getAllOrdersCount,
  getAllOrdersByUserId,
  getOrderById,
  updateOrder,
  deleteOrderById
};
