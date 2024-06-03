import mongoose from "mongoose";
import { Schema } from "mongoose";


//User Schema Model/Document

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
       type: String, 
    },
    address: [
        {
            type: Schema.Types.ObjectId,
            ref: "Address"
        }
        ],
    avatar: {
        type: String,
    }
}, {
    timestamps: true
});


const userModel = mongoose.model('User', userSchema);
export default userModel;