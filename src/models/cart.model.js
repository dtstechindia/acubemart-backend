import mongoose from "mongoose";
import { Schema } from "mongoose";


//Cart Schema Model/Document
const cartSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
}, { 
    timestamps: true 
});

const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel