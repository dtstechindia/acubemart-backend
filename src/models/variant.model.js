import mongoose from "mongoose";
import { Schema } from "mongoose";


//Attributes Schema Model/Document
const variantSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id is required"]
    },
    name: {
        type: String,
        required: [true, "Variant Name is required"]
    },
    image: [{
        type: Schema.Types.ObjectId,
        ref: "Image",
        //required: [true, "Variant Image is required"]
    }],
    variantAttributes: [{
            name: {
                type: String,
                required: [true, "Variant Name is required"]
            },
            value: [{
                type: String,
                required: [true, "Variant Value is required"]
            }]  
    }],
    mrp: {
        type: Number,
        required: [true, "Variant MRP is required"]
    },
    sp: {
        type: Number,
        required: [true, "Variant SP is required"]  
    },
    discount: {
        type: Number,
        required: [true, "Variant Discount is required"]  
    },
    deliveryCharges: {
        type: Number,
        required: [true, "Variant Delievery Charge is required"]
    },
    codCharges: {
        type: Number,
        required: [true, "Variant COD Charges is required"]
    },
    video: {
        type: String
    },
    description: {
        type: String,
        required: [true, "Variant Description is required"]
    }
}, { 
    timestamps: true 
});


const variantModel = mongoose.model("Variant", variantSchema);
export default variantModel