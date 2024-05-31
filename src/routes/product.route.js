import { Router } from "express";

import {
    addNewProduct,
    getAllProducts
} from "../controllers/product.controller.js";


const router = Router();

// Add New Product Route -POST `/api/product/add`
router.post("/add", addNewProduct);

// Get All Products Route -GET `/api/product/all`
router.get("/all", getAllProducts);

export default router