import mongoose from "mongoose";
import { Schema } from "mongoose";


//Brand Schema Model/Document
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"]
    },
    logo: {
        type: String,
        required: [true, "Brand logo is required"]
    },
    description: {
        type: String,
        required: [true, "Brand description is required"]
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category Id is required"]
    }
}, { 
    timestamps: true 
});

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel