import mongoose from "mongoose";
import { Schema } from "mongoose";


//Model Schema Model/Document
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Model name is required"]
    },
    description: {
        type: String,
        //required: [true, "Model description is required"]
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand Id is required"]
    },
    typeId: {
        type: Schema.Types.ObjectId,
        ref: "Type",
        required: [true, "Type Id is required"]
    },
    mediaId: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        //required: [true, "Model image is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

const modelModel = mongoose.model("Model", modelSchema);
export default modelModel