import mongoose from "mongoose";
import { Schema } from "mongoose";


//Image Schema Model/Document
const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "Image url is required"]
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Id is required"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

const imageModel = mongoose.model("Image", imageSchema);
export default imageModel