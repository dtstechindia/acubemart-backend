import mongoose from "mongoose";
import { Schema } from "mongoose";


//Attributes Schema Model/Document
const varientSchema = new mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id is required"]
    },
    varient: 
        {
            size: {
                type: Number,
                required: [true, "Varient Size is required"]
            },
            color: {
                type: String,
                required: [true, "Varient Color is required"]
            },
            image: {
                type: Object.Types.ObjectId,
                ref: "Image",
                required: [true, "Varient Image is required"]
            },
            material: {
                type: String,
                required: [true, "Varient Material is required"]
            },
            label: {
                type: String,
                required: [true, "Varient Label is required"]
            },
            price: {
                type: Number,
                required: [true, "Varient Price is required"]
            }
        }
}, { 
    timestamps: true 
});


const varientModel = mongoose.model("Varient", varientSchema);
export default varientModel