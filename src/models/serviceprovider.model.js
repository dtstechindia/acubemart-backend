import mongoose from "mongoose";
import { Schema } from "mongoose";


//Service Provider Schema Model/Document
const serviceProviderSchema = new mongoose.Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: [true, "Service Id is required"]
    },
    vehicleTypeId: {
        type: Schema.Types.ObjectId,
        ref: "VehicleType",
        required: [true, "Vehicle type Id is required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    dayWisePrice: [
        {
            day: {
                type: String,
                required: [true, "Day is required"]
            },
            price: {
                type: Number,
                required: [true, "Price is required"]
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const serviceProviderModel = mongoose.model("ServiceProvider", serviceProviderSchema);
export default serviceProviderModel
