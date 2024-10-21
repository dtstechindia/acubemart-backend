import { Router } from "express";

import {
  addToCart,
  getCartProducts,
  removeCartProduct,
  clearCart,
  updateCartProductQuantity,
} from "../controllers/cart.controller.js";

const router = Router();

//GET Routes
/* Get Cart Products Route -GET `/api/cart/all` */
router.get("/all", getCartProducts);

//Post Routes
/* Add Product to Cart Route -POST `/api/cart/add` */
router.post("/add", addToCart);

//PATCH Routes
/* Update Cart Product Quantity Route -PATCH `/api/cart/update` */
router.patch("/update", updateCartProductQuantity);

/* Remove Product from Cart Route -DELETE `/api/cart/remove` */
router.patch("/remove", removeCartProduct);

// POST Routes
/* Clear Cart Route -POST `/api/cart/clear` */
router.post("/clear", clearCart);

export default router;
