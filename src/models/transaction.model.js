import mongoose from "mongoose";
import { Schema } from "mongoose";


//Transaction Schema Model/Document
const transactionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"]
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order Id is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"]
    },
    paymentMode: {
        type: String,
        required: [true, "Payment Mode is required"]
    },
    isPaid: {
        type: Boolean,
        required: [true, "Is Paid is required"]
    }
}, { 
    timestamps: true 
});

const transactionModel = mongoose.model("Transaction", transactionSchema);
export default transactionModel