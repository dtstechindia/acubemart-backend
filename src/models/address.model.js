import mongoose from "mongoose";
import { Schema } from "mongoose";


//Address Schema Model/Document

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: [true, "Street is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    state: {
        type: String,
        required: [true, "State is required"]
    },
    country: {
        type: String,
        required: [true, "Country is required"]
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"]
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"]
    },
}, { 
    timestamps: true 
});

const addressModel = mongoose.model("Address", addressSchema);
export default addressModel