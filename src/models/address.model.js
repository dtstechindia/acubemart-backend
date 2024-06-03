import mongoose from "mongoose";
import { Schema } from "mongoose";


//Address Schema Model/Document

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { 
    timestamps: true 
});

const addressModel = mongoose.model("Address", addressSchema);
export default addressModel