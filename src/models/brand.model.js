import mongoose from "mongoose";
import { Schema } from "mongoose";


//Brand Schema Model/Document
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"]
    },
    description: {
        type: String,
        //required: [true, "Brand description is required"]
    },
    typeId: {
        type: Schema.Types.ObjectId,
        ref: "Type",
        required: [true, "Type Id is required"]
    },
    mediaId: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        //required: [true, "Category image is required"]
    },
}, { 
    timestamps: true 
});

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel