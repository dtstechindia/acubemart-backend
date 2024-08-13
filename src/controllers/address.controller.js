import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Address from "../models/address.model.js";

import User from "../models/user.model.js";


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

        const user = await User.findById(userId);
        user.address.push(address._id);
        await user.save();

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
    const userId = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const addresses = await Address.find({ userId })
        .populate({ path: "userId", select: "name email phone _id", strictPopulate: false  });
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
        const address = await Address.findById(addressId)
        .populate({ path: "userId", select: "name email phone _id", strictPopulate: false  });
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

/* Update Address by Id */
const updateAddress = async (req, res, next) => {
    const addressId = req.params.id;
    if (!addressId) return next(apiErrorHandler(400, "AddressId is required"));

    const { street, city, state, country, pincode } = req.body;
    
    try {
        const address = await Address.findByIdAndUpdate(
            addressId, 
            { 
                street, 
                city, 
                state, 
                country, 
                pincode
            },
            { 
                new: true,
                runValidators: true
            }
        );
        if (!address) return next(apiErrorHandler(404, "No Address Found"));

        return res.status(200).json({
            success: true,
            message: "Address Updated Successfully",
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
    updateAddress,
    deleteAddress 
}