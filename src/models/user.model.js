import mongoose from "mongoose";

//Address Schema subdocument

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    }
})

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
        addressSchema
    ],
    avatar: {
        type: String,
    }
}, {
    timestamps: true
});


const userModel = mongoose.model('User', userSchema);
export default userModel;