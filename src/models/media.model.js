import mongoose from "mongoose";
import { Schema } from "mongoose";


//Media Schema Model/Document
const mediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, "Media url is required"]
    }
}, { 
    timestamps: true 
});


const mediaModel = mongoose.model("Media", mediaSchema);
export default mediaModel