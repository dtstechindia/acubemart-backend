import mongoose from "mongoose";
import { Schema } from "mongoose";


//Order Schema Model/Document
const orderSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    isPaymentSuccess: {
        type: Boolean,
        required: true
    },
}, { 
    timestamps: true 
});