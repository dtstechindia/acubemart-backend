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
    image: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "Image" ,
            required: [true, "Product image is required"]
        }
    ],
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
    type: {
        type: Schema.Types.ObjectId,
        ref: "Type",
        required: [true, "Product type is required"]
    },
    attributes: [
        {
            type: [Schema.Types.ObjectId],
            ref: "Attribute",
            //required: [true, "Product attribute is required"]
        }
    ],
    variant: {
        type: [Schema.Types.ObjectId],
        ref: "Variant",
        //required: [true, "Product variant is required"]
    },
    additionalInfo: {
        shortDescription: String,
        weight: String,
        dimension: String,
        materials: [String],
        labels: [String],
    },

}, { 
    timestamps: true
});

const productModel = mongoose.model("Product", productSchema);
export default productModel