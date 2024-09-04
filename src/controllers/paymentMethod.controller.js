import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import PaymentMethod from "../models/paymentMethod.model.js";


/* Add new Payment Method */
const addNewPaymentMethod = async (req, res) => {
    const { name, merchantId, saltKey, environment } = req.body;
    if (!name || !merchantId || !saltKey || !environment) return next(apiErrorHandler(400, "Please provide all fields"));
    try {
        const slug = name.toLowerCase().replace(/ /g, "-");
        const paymentMethod = await PaymentMethod.create({ 
            name, 
            slug, 
            merchantId, 
            saltKey, 
            environment 
        });
        if (!paymentMethod) return next(apiErrorHandler(404, "Payment Method not found"));
        return res.status(201).json({
            success: true,
            message: "Payment Method Added Successfully",
            data: paymentMethod
        })
    } catch (error) {
        next(error);
    }
}

/* Get All Payment Methods */
const getAllPaymentMethods = async (req, res, next) => {
    try {
        const paymentMethods = await PaymentMethod.find();
        if (!paymentMethods) return next(apiErrorHandler(404, "No Payment Methods Found"));
        return res.status(200).json({
            success: true,
            message: "Payment Methods Fetched Successfully",
            data: paymentMethods
        })
    } catch (error) {
        next(error);
    }
}

/* Get Payment Method by Id */
const getPaymentMethodById = async (req, res, next) => {
    const paymentMethodId = req.params.id;
    if (!paymentMethodId) return next(apiErrorHandler(400, "Payment Method Id not found"));
    try {
        const paymentMethod = await PaymentMethod.findById(paymentMethodId);
        if (!paymentMethod) return next(apiErrorHandler(404, "No Payment Method Found"));
        return res.status(200).json({
            success: true,
            message: "Payment Method Fetched Successfully",
            data: paymentMethod
        })
    } catch (error) {
        next(error);
    }
}

/* Update Payment Method */
const updatePaymentMethod = async (req, res, next) => {
    const paymentMethodId = req.params.id;
    const { name, merchantId, saltKey, environment } = req.body;
    if (!paymentMethodId) return next(apiErrorHandler(400, "Payment Method Id not found"));
    try {
        const paymentMethod = await PaymentMethod.findByIdAndUpdate(
            paymentMethodId, 
            { 
                name, 
                merchantId, 
                saltKey, 
                environment 
            }, { 
                new: true, 
                runValidators: true 
            }
        );
        if (!paymentMethod) return next(apiErrorHandler(404, "No Payment Method Found"));
        return res.status(200).json({
            success: true,
            message: "Payment Method Updated Successfully",
            data: paymentMethod
        })
    } catch (error) {
        next(error);
    }
}

/* Delete Payment Method */
const deletePaymentMethod = async (req, res, next) => {
    const paymentMethodId = req.params.id;
    if (!paymentMethodId) return next(apiErrorHandler(400, "Payment Method Id not found"));
    try {
        const paymentMethod = await PaymentMethod.findByIdAndDelete(paymentMethodId);
        if (!paymentMethod) return next(apiErrorHandler(404, "No Payment Method Found"));
        return res.status(200).json({
            success: true,
            message: "Payment Method Deleted Successfully",
            data: paymentMethod
        })
    } catch (error) {
        next(error);
    }
}


export { 
    addNewPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod
};
