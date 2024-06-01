import mongoose from "mongoose";
import { Schema } from "mongoose";


//Model Schema Model/Document
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, { 
    timestamps: true 
});

const modelModel = mongoose.model("Model", modelSchema);
export default modelModel