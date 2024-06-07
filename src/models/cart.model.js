import mongoose from "mongoose";
import { Schema } from "mongoose";


//Cart Schema Model/Document
const cartSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"]
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product Id is required"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"]
        }
    }],
}, { 
    timestamps: true 
});

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel