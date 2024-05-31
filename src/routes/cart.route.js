import { Router } from "express";

import { 
    addToCart,
    getCartProducts
 } from "../controllers/cart.controller.js";


const router = Router();

/* Add Product to Cart Route -POST `/api/cart/add` */
router.post("/add", addToCart);

/* Get Cart Products Route -GET `/api/cart/all` */
router.get("/all", getCartProducts);

export default router