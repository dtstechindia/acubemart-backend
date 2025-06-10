import mongoose from "mongoose";
import { Schema } from "mongoose";


//User Schema Model/Document

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide an email"],
    },
    password: {
        type: String,
        //required: [true, "Please provide a password"],
        minlength: 6,
        select: false
    },
    phone: {
        type: String, 
        unique: true,
        minlength: 10,
        maxlength: 15,
    },
    address: [
        {
            type: Schema.Types.ObjectId,
            ref: "Address",
        }
        ],
    avatar: {
        type: Schema.Types.ObjectId,
        ref: "Media"
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    status: {
        type: String,
        default: "active",
        enum: ["active", "blocked"],
        message: "{VALUE} is not a valid status"
    }, 
    otp: {
        type: String,
    },
}, {
    timestamps: true
});


const userModel = mongoose.model('User', userSchema);
export default userModel;