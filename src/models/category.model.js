import mongoose from "mongoose";
import { Schema } from "mongoose";


//Category Schema Model/Document
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { 
    timestamps: true 
});

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel