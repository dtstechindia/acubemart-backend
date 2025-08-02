import { Router } from "express";

import {
    addNewProduct,
    searchProducts,
    searchAllMatchedProducts,
    searchPerfectMatchedProducts,
    getAllProducts,
    getSaleProducts,
    getAllPublishedProducts,
    getAllProductsCount,
    getPublishedProductsCount,
    getPaginatedProducts,
    getProductById,
    editProductById,
    deleteProductById,
    getProductBySlug,
    bulkEditProducts,
    getAllProductsByElementId,
    getAllProductsByCategoryId,
    getAllProductsByBrandId,
    getAllProductsByModelId,
} from "../controllers/product.controller.js";


const router = Router();


//GET Routes
// Get All Products Route -GET `/api/product/all`
router.get("/all", getAllProducts);

// Get All Sale Products Route -GET `/api/product/sale`
router.get("/sale", getSaleProducts);

// Get All Published Products Route -GET `/api/product/published`
router.get("/published", getAllPublishedProducts);

// Get Product by Id Route -GET `/api/product/:id`
router.get("/:id", getProductById);

// Get Product by SLUG Route -GET `/api/product/slug/:slug`
router.get("/slug/:slug", getProductBySlug);

//Get Paginated Products Route -GET `/api/product/page/:page`
router.get("/page/:page", getPaginatedProducts);

// Get Published Products Count Route -GET `/api/product/published/count`
router.get("/published/count", getPublishedProductsCount);

// Get All Products by Element Id Route -GET `/api/product/element/:id`
router.get("/element/:id", getAllProductsByElementId);

// Get All Products by Category Id Route -GET `/api/product/category/:id`
router.get("/category/:id", getAllProductsByCategoryId);

// Get All Products by Brand Id Route -GET `/api/product/brand/:id`
router.get("/brand/:id", getAllProductsByBrandId);

// Get All Products by Model Id Route -GET `/api/product/model/:id`
router.get("/model/:id", getAllProductsByModelId);

//POST Routes
// Add New Product Route -POST `/api/product/add`
router.post("/add", addNewProduct);

// All Products Count Route -POST `/api/product/count`
router.post("/count", getAllProductsCount);

// Bulk Edit Products Route -POST `/api/product/bulk/edit`
router.post("/bulk/edit", bulkEditProducts);

//Search Products Route -POST `/api/product/search`
router.post("/search", searchProducts);

// Search All Matched Products Route -POST `/api/product/search/all`
router.post("/search/all", searchAllMatchedProducts);


// Search Perfect Matched Products Route -POST `/api/product/search/perfect`
router.post("/search/perfect", searchPerfectMatchedProducts);

//PATCH Routes
// Edit Product Route -PATCH `/api/product/edit`
router.patch("/edit/:id", editProductById);


//DELETE Routes
// Delete Product Route -DELETE `/api/product/delete`
router.delete("/delete/:id", deleteProductById);



export default router