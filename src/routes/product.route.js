import { Router } from "express";

import {
    addNewProduct,
    getAllProducts,
    getProductById,
    editProductById,
    deleteProductById
} from "../controllers/product.controller.js";


const router = Router();


//GET Routes
// Get All Products Route -GET `/api/product/all`
router.get("/all", getAllProducts);

// Get Product by Id Route -GET `/api/product/:id`
router.get("/:id", getProductById);


//POST Routes
// Add New Product Route -POST `/api/product/add`
router.post("/add", addNewProduct);


//PATCH Routes
// Edit Product Route -PATCH `/api/product/edit`
router.patch("/edit/:id", editProductById);


//DELETE Routes
// Delete Product Route -DELETE `/api/product/delete`
router.delete("/delete/:id", deleteProductById);



export default router