import mongoose from "mongoose";
import { Schema } from "mongoose";


//Transaction Schema Model/Document
const transactionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    }
}, { 
    timestamps: true 
});

const transactionModel = mongoose.model("Transaction", transactionSchema);
export default transactionModel