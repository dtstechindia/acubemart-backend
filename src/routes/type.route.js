import { Router } from "express";

import {
    addNewType,
    getAllTypes,
    deleteType
} from "../controllers/type.controller.js";


const router = Router();


//GET Routes
// Get All Types Route -GET `/api/type/all`
router.get("/all", getAllTypes);


//POST Routes
/* Add New Type Route -POST `/api/type/add` */
router.post("/add", addNewType);


//DELETE Routes
/* Delete Type Route -DELETE `/api/type/delete` */
router.delete("/delete/:id", deleteType);


export default router