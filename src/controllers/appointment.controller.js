import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Appointment from "../models/appointment.model.js";
import ServiceProvider from "../models/serviceprovider.model.js";


const addNewAppointment = async (req, res, next) => {
    console.log(req.body);
    try {
        const { date, startTime, endTime, serviceProviderId, userId, phone, email, name, totalAmount, advancePayment, pendingPayment, transactionId, paymentMode } = req.body;
        let calculatedPrice = 0;
        if (!startTime || !endTime || !date || !serviceProviderId || !userId || !totalAmount /* || !advancePayment */ || !pendingPayment || !paymentMode) return next(apiErrorHandler(400, "Please provide all fields"));

        const serviceProvider = await ServiceProvider.findById(serviceProviderId);
        if (!serviceProvider) return next(apiErrorHandler(404, "Service Provider not found"));

        //check if is there any appointment on that date with same time start and end time
        /* const existingAppointment = await Appointment.findOne({ date, startTime, endTime });
        if (existingAppointment) return next(apiErrorHandler(409, "Appointment already booked for this time slot, please choose another time slot")); */

        //extract the day of date and compare with serviceProvider daywiseprice day and assign price
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLocaleLowerCase();
        const serviceProviderDayWisePrice = serviceProvider.dayWisePrice.find(dayWisePrice => dayWisePrice.day === day);
        if (serviceProviderDayWisePrice) {

            calculatedPrice = serviceProviderDayWisePrice.price;
            const appointment = await Appointment.create({
                date,
                startTime, 
                endTime, 
                serviceId: serviceProvider.serviceId, 
                vehicleTypeId: serviceProvider.vehicleTypeId,
                serviceProviderId, 
                price: calculatedPrice, 
                duration: serviceProvider.duration,
                userId,
                phone,
                email,
                name,
                totalAmount,
                advancePayment,
                pendingPayment,
                transactionId,
                paymentMode,
            })

            return res.status(201).json({
                success: true,
                message: "Apointment Added Successfully",
                data: appointment
            });
        } else {
            return next(apiErrorHandler(400, "Something went wrong while calculating appointment price"))
        }
 
    } catch (error) {
        next(error);
    }
}

const CheckAppointmentAvailability = async (req, res, next) => {
    try {
        const { date, startTime, endTime } = req.body;
        if (!date || !startTime || !endTime) return next(apiErrorHandler(400, "Please provide all fields"));
        // Check if there is an existing appointment on the same date and time
        const existingAppointment = await Appointment.findOne({ date, startTime, endTime });
        if (existingAppointment) {
            return res.status(200).json({ 
                success: true, 
                message: "Appointment already exists" ,
                data: {slotAvailable: false}
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                message: "Appointment is available" ,
                data: {slotAvailable: true}
            });
        }
    } catch (error) {
        next(error);
    }
}

const getAllAppointments = async (req, res, next) => {
    try {
        const apointments = await Appointment.find().sort({ createdAt: -1 })
        .populate("serviceId serviceProviderId vehicleTypeId userId");
        return res.status(200).json({
            success: true,
            message: "Apointments Fetched Successfully",
            data: apointments
        });
    } catch (error) {
        next(error);
    }
}

const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const apointment = await Appointment.findById(id).populate("serviceId serviceProviderId vehicleTypeId userId");
        if (!apointment) return next(apiErrorHandler(404, "Apointment not found"));
        return res.status(200).json({
            success: true,
            message: "Apointment Fetched Successfully",
            data: apointment
        });
    } catch (error) {
        next(error);
    }
}

const getAppointmentsByUserId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const apointments = await Appointment.find({ userId: id }).populate("serviceId serviceProviderId vehicleTypeId userId");
        if (!apointments) return next(apiErrorHandler(404, "Apointments not found"));
        return res.status(200).json({
            success: true,
            message: "Apointments Fetched Successfully",
            data: apointments
        });
    } catch (error) {
        next(error);
    }
}

const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, date, serviceId, vehicleTypeId, serviceProviderId, userId, price, duration, phone, email, name, totalAmount, advancePayment, pendingPayment, transactionId, status, paymentMode } = req.body;
        const apointment = await Appointment.findByIdAndUpdate(id, {
            startTime, 
            endTime, 
            date, 
            serviceId, 
            vehicleTypeId,
            serviceProviderId, 
            userId, 
            name,
            phone, 
            email,
            price, 
            duration,
            totalAmount,
            advancePayment,
            pendingPayment,
            transactionId,
            status,
            paymentMode,
        }, { new: true });
        if (!apointment) return next(apiErrorHandler(404, "Apointment not found"));
        return res.status(200).json({
            success: true,
            message: "Apointment Updated Successfully",
            data: apointment
        });
    } catch (error) {
        next(error);
    }
}

const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const apointment = await Appointment.findByIdAndDelete(id);
        if (!apointment) return next(apiErrorHandler(404, "Apointment not found"));
        return res.status(200).json({
            success: true,
            message: "Apointment Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
}

export {
    addNewAppointment,
    getAllAppointments,
    getAppointmentById,
    getAppointmentsByUserId,
    updateAppointment,
    deleteAppointment
}