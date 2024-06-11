import mongoose from "mongoose";
import { Schema } from "mongoose";

//Attribute Schema Model/Document
const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Attribute name is required"]
    },
    value: [
        {
            type: String,
            required: [true, "Attribute values are required"]
        }
    ],
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id is required"]
    }
        
}, { 
    timestamps: true 
});


const attributeModel = mongoose.model("Attribute", attributeSchema);
export default attributeModel