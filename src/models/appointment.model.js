import mongoose from "mongoose";
import { Schema } from "mongoose";


//Appointment Schema Model/Document
const appointmentSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: [true, "Start time is required"]
    },
    endTime: {
        type: Date,
        required: [true, "End time is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: [true, "Service type is required"]
    },
    vehicleTypeId: {
        type: Schema.Types.ObjectId,
        ref: "VehicleType",
        required: [true, "Vehicle type is required"]
    },
    serviceProviderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Service provider is required"]
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"]
    },
    status: {
        type: String,
        enum: ["booked", "pending", "completed", "cancelled"],
        default: "pending",
        required: [true, "Status is required"]
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"]
    },
    advancePayment: {
        type: Number,
        required: [true, "Advance payment is required"]
    },
    pendingPayment: {
        type: Number,
        required: [true, "Pending payment is required"]
    },
    status: {
        type: String,
        enum: ["booked", "pending", "completed", "cancelled"],
        default: "booked",
        required: [true, "Status is required"]
    },
    transactionId: {
        type: String,
        //required: [true, "Transaction ID is required"]
    },
}, { 
    timestamps: true
})

const sessionModel = mongoose.model("Appointment", appointmentSchema);
export default sessionModel