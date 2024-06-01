import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";


//Product Schema Model/Document
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Image" 
    }],
    category: { 
        type: Schema.Types.ObjectId, 
        ref: "Category",
        required: true
    },
    brand: { 
        type: Schema.Types.ObjectId, 
        ref: "Brand",
        required: true 
    },
    model: { 
        type: Schema.Types.ObjectId, 
        ref: "Model",
        required: true 
    },
    attributes: {
        materials: [String],
        labels: [String],
        colors: [String],
        sizes: [Number]
    },
    additionalInfo: {
        weight: String,
        dimension: String
    }

}, { 
    timestamps: true
});

const productModel = mongoose.model("Product", productSchema);
export default productModel