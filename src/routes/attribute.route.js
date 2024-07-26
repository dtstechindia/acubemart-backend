import { Router } from "express";

import {
    addNewAttribute,
    getAllAttributes,
    updateAttribute,
    deleteAttribute
} from "../controllers/attribute.controller.js";


const router = Router();

//GET Routes
/* Get All Attributes Route -GET `/api/attribute/all` */
router.get("/all", getAllAttributes);


//POST Routes
/* Add New Attribute Route -POST `/api/attribute/add` */
router.post("/add", addNewAttribute);


//PATCH Routes
/* Update Attribute Route -PATCH `/api/attribute/update` */
router.patch("/update", updateAttribute);


//DELETE Routes
/* Delete Attribute Route -DELETE `/api/attribute/delete/:id` */
router.delete("/delete/:id", deleteAttribute);


export default router;