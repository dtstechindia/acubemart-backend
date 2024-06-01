import { Router } from "express";

import { 
    addNewCategory,
    getCategories,
    deleteCategory
 } from "../controllers/category.controller.js";


const router = Router();

//GET Routes
/* Get All Categories Route -GET `/api/category/all` */
router.get("/all", getCategories);

//POST Routes
/* Add New Category Route -POST `/api/category/add` */
router.post("/add", addNewCategory);    

//DELETE Routes
/* Delete Category Route -DELETE `/api/category/delete` */
router.delete("/delete", deleteCategory);


export default router