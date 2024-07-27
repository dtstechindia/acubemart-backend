import { Router } from "express";

import { 
    addNewCategory,
    getCategories,
    getAllActiveCategories,
    updateCategoryById,
    deleteCategory,
    getCategoryById
 } from "../controllers/category.controller.js";


const router = Router();

//GET Routes
/* Get All Categories Route -GET `/api/category/all` */
router.get("/all", getCategories);

/* Get All Active Categories Route -GET `/api/category/active` */
router.get("/active", getAllActiveCategories);


/* Get Category by Id Route -GET `/api/category/:id` */
router.get("/:id", getCategoryById);

//POST Routes
/* Add New Category Route -POST `/api/category/add` */
router.post("/add", addNewCategory);    


//PATCH Routes
/* Update Category Route -PATCH `/api/category/update` */
router.patch("/update/:id", updateCategoryById);


//DELETE Routes
/* Delete Category Route -DELETE `/api/category/delete` */
router.delete("/delete/:id", deleteCategory);


export default router