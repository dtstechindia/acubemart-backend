import { Router } from "express";

import { 
    addToCart,
    getCartProducts,
    removeCartProduct
 } from "../controllers/cart.controller.js";


const router = Router();


//GET Routes
/* Get Cart Products Route -GET `/api/cart/all` */
router.get("/all", getCartProducts);

//Post Routes
/* Add Product to Cart Route -POST `/api/cart/add` */
router.post("/add", addToCart);

//PATCH Routes
/* Remove Product from Cart Route -DELETE `/api/cart/remove` */
router.patch("/remove", removeCartProduct);

export default router