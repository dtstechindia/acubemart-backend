import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import VehicleType from "../models/vehicletype.model.js";


const addNewVehicleType = async (req, res, next) => {
    try {
        const { name, isActive } = req.body;
        const vehicleType = await VehicleType.create({
            name,
            isActive
        });
        return res.status(200).json({
            success: true,
            message: "Vehicle Type Added Successfully",
            data: vehicleType
        })
    } catch (error) {
        next(error);
    }
}

const getAllVehicleTypes = async (req, res, next) => {
    try {
        const vehicleTypes = await VehicleType.find();
        return res.status(200).json({
            success: true,
            message: "Vehicle Types Fetched Successfully",
            data: vehicleTypes
        });
    } catch (error) {
         next(error);
    }
}

const getAllActiveVehicleTypes = async (req, res, next) => {
    try {
        const vehicleTypes = await VehicleType.find({ isActive: true });
        return res.status(200).json({
            success: true,
            message: "Vehicle Types Fetched Successfully",
            data: vehicleTypes
        });
    } catch (error) {
        next(error);
    }
}

const getVehicleTypeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const vehicleType = await VehicleType.findById(id);
        if (!vehicleType) return next(apiErrorHandler(404, "Vehicle Type not found"));
        return res.status(200).json({
            success: true,
            message: "Vehicle Type Fetched Successfully",
            data: vehicleType
        });
    } catch (error) {
        next(error);
    }
}

const updateVehicleType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, isActive } = req.body;
        const vehicleType = await VehicleType.findByIdAndUpdate(id, {
            name,
            isActive
        });
        if (!vehicleType) return next(apiErrorHandler(404, "Vehicle Type not found"));
        return res.status(200).json({
            success: true,
            message: "Vehicle Type Updated Successfully",
            data: vehicleType
        });
    } catch (error) {
        next(error);
    }
}

const deleteVehicleType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const vehicleType = await VehicleType.findByIdAndDelete(id);
        if (!vehicleType) return next(apiErrorHandler(404, "Vehicle Type not found"));
        return res.status(200).json({
            success: true,
            message: "Vehicle Type Deleted Successfully",
            data: vehicleType
        });
    } catch (error) {
        next(error);
    }
}

export {
    addNewVehicleType,
    getAllVehicleTypes,
    getAllActiveVehicleTypes,
    getVehicleTypeById,
    updateVehicleType,
    deleteVehicleType
}