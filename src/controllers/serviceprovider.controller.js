import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import ServiceProvider from "../models/serviceprovider.model.js";


const addNewServiceProvider = async (req, res, next) => {
    try {
        const { serviceId, day, dayCode, duration, price, dayWisePrice, vehicleTypeId } = req.body;
        const serviceProvider = await ServiceProvider.create({
            serviceId, 
            vehicleTypeId,
            duration, 
            price,
            dayWisePrice,
            isActive: true
        });
        return res.status(200).json({
            success: true,
            message: "Service Provider Added Successfully",
            data: serviceProvider
        });
    } catch (error) {
        next(error);
    }
}

const getAllServiceProviders = async (req, res, next) => {
    try {
        const serviceProviders = await ServiceProvider.find().populate("serviceId vehicleTypeId");
        return res.status(200).json({
            success: true,
            message: "Service Providers Fetched Successfully",
            data: serviceProviders
        });
    } catch (error) {
        next(error);
    }
}

const getAllActiveServiceProviders = async (req, res, next) => {
    try {
        const serviceProviders = await ServiceProvider.find({ isActive: true });
        return res.status(200).json({
            success: true,
            message: "Service Providers Fetched Successfully",
            data: serviceProviders
        });
    } catch (error) {
        next(error);
    }
}

const getServiceProviderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const serviceProvider = await ServiceProvider.findById(id);
        if (!serviceProvider) return next(apiErrorHandler(404, "Service Provider not found"));
        return res.status(200).json({
            success: true,
            message: "Service Provider Fetched Successfully",
            data: serviceProvider
        });
    } catch (error) {
        next(error);
    }
}

const getServiceProviderByServiceIdAndVehicleTypeId = async (req, res, next) => {
    try {
        const { serviceId, vehicleTypeId } = req.params;
        console.log(serviceId, vehicleTypeId);
        const serviceProvider = await ServiceProvider.findOne({ serviceId, vehicleTypeId });
        if (!serviceProvider) return next(apiErrorHandler(404, "Service Provider not found"));
        return res.status(200).json({
            success: true,
            message: "Service Provider Fetched Successfully",
            data: serviceProvider
        });
    } catch (error) {
        next(error);
    }
}

const updateServiceProvider = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { serviceId, day, dayCode, duration, price, dayWisePrice, isActive, vehicleTypeId } = req.body;
        const serviceProvider = await ServiceProvider.findByIdAndUpdate(id, {
            serviceId, 
            vehicleTypeId, 
            duration, 
            price,
            dayWisePrice,
            isActive
        }, { new: true });
        if (!serviceProvider) return next(apiErrorHandler(404, "Service Provider not found"));
        return res.status(200).json({
            success: true,
            message: "Service Provider Updated Successfully",
            data: serviceProvider
        });
    } catch (error) {
        next(error);
    }
}

const deleteServiceProvider = async (req, res, next) => {
    try {
        const { id } = req.params;
        const serviceProvider = await ServiceProvider.findByIdAndDelete(id);
        if (!serviceProvider) return next(apiErrorHandler(404, "Service Provider not found"));
        return res.status(200).json({
            success: true,
            message: "Service Provider Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
}

export {
    addNewServiceProvider,
    getAllServiceProviders,
    getAllActiveServiceProviders,
    getServiceProviderById,
    getServiceProviderByServiceIdAndVehicleTypeId,
    updateServiceProvider,
    deleteServiceProvider
}