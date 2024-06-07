import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";


//Product Schema Model/Document
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"]
    },
    size: {
        type: [Number],
        required: [true, "Product size is required"]
    },
    color: {
        type: [String],
        required: [true, "Product color is required"]
    },
    image: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Image" ,
        required: [true, "Product image is required"]
    }],
    category: { 
        type: Schema.Types.ObjectId, 
        ref: "Category",
        required: [true, "Product category is required"]
    },
    brand: { 
        type: Schema.Types.ObjectId, 
        ref: "Brand",
        required: [true , "Product brand is required"]
    },
    model: { 
        type: Schema.Types.ObjectId, 
        ref: "Model",
        required: [true, "Product model is required"]
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