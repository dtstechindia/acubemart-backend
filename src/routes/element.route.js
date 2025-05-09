import { Router } from "express";

import { 
    addNewElement,
    getAllElements,
    getElementById,
    getAllElementsByCategoryId,
    updateElementById,
    deleteElementById,
    getAllActiveElements
 } from "../controllers/element.controller.js";


const router = Router();


//GET Routes
/* Get Elements Route -GET `/api/element/all` */
router.get("/all", getAllElements);

/* Get All Active Elements Route -GET `/api/element/active` */
router.get("/active", getAllActiveElements);

/* Get All Elements by Category Id Route -GET `/api/element/category/:id` */
router.get("/category/:id", getAllElementsByCategoryId);

/* Get Element by Id Route -GET `/api/element/:id` */
router.get("/:id", getElementById);


//POST Routes
/* Add New Element Route -POST `/api/element/add` */
router.post("/add", addNewElement);


//PATCH Routes
/* Update Element by Id Route -PATCH `/api/element/update/:id` */
router.patch("/update/:id", updateElementById);


//DELETE Routes
/* Delete Element by Id Route -DELETE `/api/element/delete/:id` */
router.delete("/delete/:id", deleteElementById);


export default router