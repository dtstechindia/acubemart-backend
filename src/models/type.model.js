import mongoose from "mongoose";
import { Schema } from "mongoose";


//Type Schema Model/Document
const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Type name is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});


const typeModel = mongoose.model("Type", typeSchema);
export default typeModel