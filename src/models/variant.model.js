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
    image: {
        type: Schema.Types.ObjectId,
        ref: "Image",
        //required: [true, "Variant Image is required"]
    },
    price: {
        type: Number,
        required: [true, "Variant Price is required"]
    },
    variantAttributes: [{
            name: {
                type: String,
                required: [true, "Variant Name is required"]
            },
            value: {
                type: String,
                required: [true, "Variant Value is required"]
            }  
        }]
}, { 
    timestamps: true 
});


const variantModel = mongoose.model("Variant", variantSchema);
export default variantModel