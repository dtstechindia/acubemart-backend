import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Address from "../models/address.model.js";


/* Add New Address */
const addNewAddress = async (req, res, next) => {
    const { street, city, state, country, pincode, userId } = req.body;
    if (!street || !city || !state || !country || !pincode || !userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const address = await Address.create({ 
            street, 
            city, 
            state, 
            country, 
            pincode, 
            userId
        });

        if (!address) return next(apiErrorHandler(404, "No Address Found"));

        return res.status(201).json({
            success: true,
            message: "Address Added Successfully",
            data: address
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get All Addresses by UserId */
const getAllAddresses = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const addresses = await Address.find({ userId });
        if (!addresses) return next(apiErrorHandler(404, "No Addresses Found"));

        return res.status(200).json({
            success: true,
            message: "Addresses Fetched Successfully",
            data: addresses
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get Address by Id  */
const getAddressById = async (req, res, next) => {
    const addressId  = req.params.id;
    if (!addressId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const address = await Address.findById(addressId);
        if (!address) return next(apiErrorHandler(404, "No Address Found"));

        return res.status(200).json({
            success: true,
            message: "Address Fetched Successfully",
            data: address
        })
        
    } catch (error) {
        next(error);
    }
};

/* Delete Address */
const deleteAddress = async (req, res, next) => {
    const { addressId } = req.body;
    if (!addressId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const address = await Address.findByIdAndDelete(addressId);
        if (!address) return next(apiErrorHandler(404, "No Address Found"));

        return res.status(200).json({
            success: true,
            message: "Address Deleted Successfully",
            data: address
        })
        
    } catch (error) {
        next(error);
    }
};


export { 
    addNewAddress, 
    getAllAddresses, 
    getAddressById, 
    deleteAddress 
}