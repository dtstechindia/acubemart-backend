import { Router } from "express";

import {
    addNewProduct,
    getAllProducts
} from "../controllers/product.controller.js";


const router = Router();


//GET Routes
// Get All Products Route -GET `/api/product/all`
router.get("/all", getAllProducts);


//POST Routes
// Add New Product Route -POST `/api/product/add`
router.post("/add", addNewProduct);



export default router