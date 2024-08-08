import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Coupon from "../models/coupon.model.js";

/* Add new Coupon */
const addNewCoupon = async (req, res, next) => {
    const { code, description, couponType, amount, expiry, status, usageLimit } = req.body;
    if (!code || !couponType || !amount || !expiry || !usageLimit) return next(apiErrorHandler(400, "Please provide all fields"));

    try {
        const coupon = await Coupon.create({ 
            code, 
            description, 
            couponType,
            amount,
            expiry,
            usageLimit,
            status
        });

        if (!coupon) return next(apiErrorHandler(404, "No Coupon Found"));
        return res.status(201).json({
            success: true,
            message: "Coupon Added Successfully",
            data: coupon
        });
    } catch (error) {
        next(error);
    }
}


/* Get All Coupons */
const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find();
        if (!coupons) return next(apiErrorHandler(404, "No Coupons Found"));
        return res.status(200).json({
            success: true,
            message: "Coupons Fetched Successfully",
            data: coupons
        })
    } catch (error) {
        next(error);
    }
}


/* Get Coupon by Id */
const getCouponById = async (req, res, next) => {
    const couponId  = req.params.id;
    if (!couponId) return next(apiErrorHandler(400, "Coupon Id is required"));
    
    try {
        const coupon = await Coupon.findById(couponId);
        if (!coupon) return next(apiErrorHandler(404, "No Coupon Found"));
        return res.status(200).json({
            success: true,
            message: "Coupon Fetched Successfully",
            data: coupon
        })
    } catch (error) {
        next(error);
    }
}


/* Update Coupon by Id */
const updateCouponById = async (req, res, next) => {
    const couponId  = req.params.id;
    const { code, description, couponType, amount, expiry, status, usageLimit } = req.body;

    if (!couponId) return next(apiErrorHandler(400, "Coupon Id not found"));

    try {
        const coupon = await Coupon.findByIdAndUpdate(
            couponId, 
            { 
                code, 
                description, 
                couponType,
                amount,
                expiry,
                status,
                usageLimit
            }, { 
                new: true, 
                runValidators: true
            }
        );
        if (!coupon) return next(apiErrorHandler(404, "No Coupon Found"));
        
        return res.status(200).json({
            success: true,
            message: "Coupon Updated Successfully",
            data: coupon
        })
    } catch (error) {
        next(error);
    }
}


/* Delete Coupon by Id */
const deleteCouponById = async (req, res, next) => {
    const couponId  = req.params.id;
    if (!couponId) return next(apiErrorHandler(400, "Coupon Id not found"));
    try {
        const coupon = await Coupon.findByIdAndDelete(couponId);
        if (!coupon) return next(apiErrorHandler(404, "No Coupon Found"));
        return res.status(200).json({ 
            success: true, 
            message: "Coupon Deleted Successfully", 
            data: coupon
        });
    } catch (error) {
        next(error);
    }
}


export { 
    addNewCoupon, 
    getAllCoupons, 
    getCouponById, 
    updateCouponById, 
    deleteCouponById 
}