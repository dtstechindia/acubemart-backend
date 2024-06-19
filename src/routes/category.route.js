import { Router } from "express";

import { 
    addNewCategory,
    getCategories,
    getAllActiveCategories,
    updateCategoryById,
    deleteCategory
 } from "../controllers/category.controller.js";


const router = Router();

//GET Routes
/* Get All Categories Route -GET `/api/category/all` */
router.get("/all", getCategories);

/* Get All Active Categories Route -GET `/api/category/active` */
router.get("/active", getAllActiveCategories);

//POST Routes
/* Add New Category Route -POST `/api/category/add` */
router.post("/add", addNewCategory);    


//PATCH Routes
/* Update Category Route -PATCH `/api/category/update` */
router.patch("/update/:id", updateCategoryById);


//DELETE Routes
/* Delete Category Route -DELETE `/api/category/delete` */
router.delete("/delete", deleteCategory);


export default router