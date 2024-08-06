import mongoose from "mongoose";
import { Schema } from "mongoose";


//Order Schema Model/Document
const orderSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"]
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product Id is required"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"]
        }
    }],
    total: {
        type: Number,
        required: [true, "Total is required"]
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: [true, "Address Id is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"]
    },
    status: {
        type: String,
        enum: ["pending", "placed", "processing", "dispatched", "shipped", "delivered", "cancelled"],
        default: "pending",
        message: "{VALUE} is not a valid status"
    },
    transactionId: [{
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        //required: [true, "Transaction Id is required"]
    }],
}, { 
    timestamps: true 
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel