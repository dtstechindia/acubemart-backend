import { Router } from "express";

import {
    addNewProduct,
    getAllProducts,
    getAllPublishedProducts,
    getAllProductsCount,
    getProductById,
    editProductById,
    deleteProductById,
    getProductBySlug,
    bulkEditProducts
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


//GET Routes
// Get All Products Route -GET `/api/product/all`
router.get("/all", getAllProducts);

// Get All Published Products Route -GET `/api/product/published`
router.get("/published", getAllPublishedProducts);

// Get Product by Id Route -GET `/api/product/:id`
router.get("/:id", getProductById);

// Get Product by SLUG Route -GET `/api/product/slug/:slug`
router.get("/slug/:slug", getProductBySlug);


//POST Routes
// Add New Product Route -POST `/api/product/add`
router.post("/add", addNewProduct);

// All Products Count Route -POST `/api/product/count`
router.post("/count", getAllProductsCount);

// Bulk Edit Products Route -POST `/api/product/bulk/edit`
router.post("/bulk/edit", bulkEditProducts);


//PATCH Routes
// Edit Product Route -PATCH `/api/product/edit`
router.patch("/edit/:id", editProductById);


//DELETE Routes
// Delete Product Route -DELETE `/api/product/delete`
router.delete("/delete/:id", deleteProductById);



export default router