import { Router } from "express";

import {
    addNewModel,
    getAllModels,
    getModelById,
    updateModelById,
    deleteModel,
    getAllActiveModels
} from "../controllers/model.controller.js";


const router = Router();

//GET Routes
// Get All Models Route -GET `/api/model/all`
router.get("/all", getAllModels);


// Get All Active Models Route -GET `/api/model/active`
router.get("/active", getAllActiveModels);

// Get Model by Id Route -GET `/api/model/:id`
router.get("/:id", getModelById);


//POST Routes
// Add New Model Route -POST `/api/model/add`
router.post("/add", addNewModel);


//PATCH Routes
// Update Model Route -PATCH `/api/model/update`
router.patch("/update/:id", updateModelById);


//DELETE Routes
// Delete Model Route -DELETE `/api/model/delete`
router.delete("/delete/:id", deleteModel);


export default router