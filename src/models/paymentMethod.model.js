import mongoose from "mongoose";
import { Schema } from "mongoose";


//Payment Method Schema Model/Document
const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Payment method name is required"]
    },
    slug: {
        type: String,
        required: [true, "Payment method slug is required"]
    },
    status: {
        type: String,
        enum: ["enabled", "disabled"],
        default: "enabled",
        message: "{VALUE} is not a valid status"
    },
    merchantId: {
        type: String,
        required: [true, "Merchant Id is required"]
    },
    saltKey: {
        type: String,
        required: [true, "Salt key is required"]
    },
    environment: {
        type: String,
        enum: ["development", "production"],
        default: "test",
        message: "{VALUE} is not a valid environment"
    }
}, { 
    timestamps: true 
});

const paymentMethodModel = mongoose.model("PaymentMethod", paymentMethodSchema);
export default paymentMethodModel