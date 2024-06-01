import mongoose from "mongoose";
import { Schema } from "mongoose";


//Brand Schema Model/Document
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    description: {
        type: String,
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

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel