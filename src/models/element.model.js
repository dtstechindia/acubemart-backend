import mongoose from "mongoose";
import { Schema } from "mongoose";


//Element Schema Model/Document
const elementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Element name is required"]
    },
    description: {
        type: String,
        required: [true, "Element description is required"]
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category Id is required"]
    },
    typeId: {
        type: Schema.Types.ObjectId,
        ref: "Type",
        required: [true, "Type Id is required"]
    }
}, { 
    timestamps: true 
});


const elementModel = mongoose.model("Element", elementSchema);
export default elementModel