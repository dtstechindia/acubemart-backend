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
        enum: ["COD", "ONLINE"],
        message: "{VALUE} is not a valid payment mode",
        //default: "COD",
        toUpperCase: true,
        required: [true, "Payment Mode is required"]
    }
}, { 
    timestamps: true 
});

const transactionModel = mongoose.model("Transaction", transactionSchema);
export default transactionModel