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
    value: {
        type: String,
        required: [true, "Variant Value is required"]
    }
    /* variant: 
        {
            size: {
                type: Number,
                required: [true, "Variant Size is required"]
            },
            color: {
                type: String,
                required: [true, "Variant Color is required"]
            },
            image: {
                type: Object.Types.ObjectId,
                ref: "Image",
                required: [true, "Variant Image is required"]
            },
            material: {
                type: String,
                required: [true, "Variant Material is required"]
            },
            label: {
                type: String,
                required: [true, "Variant Label is required"]
            },
            price: {
                type: Number,
                required: [true, "Variant Price is required"]
            }
        } */
}, { 
    timestamps: true 
});


const variantModel = mongoose.model("Variant", variantSchema);
export default variantModel