import mongoose from "mongoose";
import { Schema } from "mongoose";


//Coupons Schema Model/Document
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon code is required"],
        unique: true
    },
    description: {
        type: String,
        //required: [true, "Coupon description is required"]
    },
    couponType: {   
        type: String,
        enum: ["fixed_amount", "percent_discount", "free_shipping", "buy_one_get_one"],
        message: "{VALUE} is not a valid coupon type"
    },
    amount: {
        type: Number,
        required: [true, "Coupon amount is required"]
    },
    expiry: {
        type: Date,
        required: [true, "Coupon expiry date is required"]
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        message: "{VALUE} is not a valid status"
    },
    usageLimit: {
        type: Number,
        required: [true, "Coupon usage limit is required"]
    }
}, { 
    timestamps: true 
});


const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;