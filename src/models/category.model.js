import mongoose from "mongoose";
import { Schema } from "mongoose";


//Category Schema Model/Document
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"]
    },
    description: {
        type: String,
        required: [true, "Category description is required"]
    }
}, { 
    timestamps: true 
});

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel