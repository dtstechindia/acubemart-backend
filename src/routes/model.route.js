import { Router } from "express";

import {
    addNewModel,
    getAllModels,
    deleteModel
} from "../controllers/model.controller.js";


const router = Router();

//GET Routes
// Get All Models Route -GET `/api/model/all`
router.get("/all", getAllModels);


//POST Routes
// Add New Model Route -POST `/api/model/add`
router.post("/add", addNewModel);


//DELETE Routes
// Delete Model Route -DELETE `/api/model/delete`
router.delete("/delete", deleteModel);


export default router