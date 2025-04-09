import mongoose from "mongoose";
import { Schema } from "mongoose";


//Service Schema Model/Document
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    price: {
        type: Number,
        required: [true, "Service price is required"]
    },
    duration: {
        type: Number,
        required: [true, "Service duration is required"]
    },
    description: {
        type: String,
        //required: [true, "Service description is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});


const serviceModel = mongoose.model("Service", serviceSchema);
export default serviceModel