import mongoose from "mongoose";
import { Schema } from "mongoose";


//Image Schema Model/Document
const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, { 
    timestamps: true 
});

const imageModel = mongoose.model("Image", imageSchema);
export default imageModel