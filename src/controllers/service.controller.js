import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Service from "../models/service.model.js";


const addNewService = async (req, res, next) => {
    try {
        const { name, price, duration, description } = req.body;

        if (!name || !price || !duration) return next(apiErrorHandler(400, "Please provide all fields"));

        const service = await Service.create({ 
            name, 
            price, 
            duration, 
            description 
        });

        return res.status(201).json({
            success: true,
            message: "Service Added Successfully",
            data: service
        });
    } catch (error) {
        return next(error);
    }
}

const getAllServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        return res.status(200).json({
            success: true,
            message: "Services Fetched Successfully",
            data: services
        });
    } catch (error) {
        next(error);
    }
}

const getAllActiveServices = async (req, res, next) => {
    try {
        const services = await Service.find({ isActive: true });
        return res.status(200).json({
            success: true,
            message: "Services Fetched Successfully",
            data: services
        });
    } catch (error) {
        next(error);
    }
}

const getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findById(id);
        if (!service) return next(apiErrorHandler(404, "Service not found"));
        return res.status(200).json({
            success: true,
            message: "Service Fetched Successfully",
            data: service
        });
    } catch (error) {
        next(error);
    }
}

const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, duration, description } = req.body;

        if (!name || !price || !duration) return next(apiErrorHandler(400, "Please provide all fields"));

        const service = await Service.findByIdAndUpdate(id, { 
            name, 
            price, 
            duration, 
            description 
        }, { new: true });

        if (!service) return next(apiErrorHandler(404, "Service not found"));

        return res.status(200).json({
            success: true,
            message: "Service Updated Successfully",
            data: service
        });
    } catch (error) {
        next(error);
    }
}

const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findByIdAndDelete(id);
        if (!service) return next(apiErrorHandler(404, "Service not found"));
        return res.status(200).json({
            success: true,
            message: "Service Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
}

export { 
    addNewService, 
    getAllServices, 
    getAllActiveServices, 
    getServiceById,
    updateService, 
    deleteService 
};