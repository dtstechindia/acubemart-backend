import mongoose from "mongoose";
import { Schema } from "mongoose";


//Admin Schema Model/Document
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["admin", "manager"],
        default: "admin",
        message: "{VALUE} is not a valid role",
    },
    avatar: {
        type: Schema.Types.ObjectId,
        ref: "Media"
    }
}, { 
    timestamps: true 
});


const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel