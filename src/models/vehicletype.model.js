import mongoose from "mongoose";
import { Schema } from "mongoose";


//Vehicle Type Schema Model/Document
const vehicleTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vehicle type name is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});


const vehicleTypeModel = mongoose.model("VehicleType", vehicleTypeSchema);
export default vehicleTypeModel