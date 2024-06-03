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
        enum: ["pending", "placed", "dispatched", "delivered", "cancelled"],
        default: "pending",
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    },
}, { 
    timestamps: true 
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel