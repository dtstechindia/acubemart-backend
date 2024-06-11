import { Router } from "express";

import {
    addNewAttribute,
    getAllAttributes,
    deleteAttribute
} from "../controllers/attribute.controller.js";


const router = Router();

//GET Routes
/* Get All Attributes Route -GET `/api/attribute/all` */
router.get("/all", getAllAttributes);


//POST Routes
/* Add New Attribute Route -POST `/api/attribute/add` */
router.post("/add", addNewAttribute);


//DELETE Routes
/* Delete Attribute Route -DELETE `/api/attribute/delete` */
router.delete("/delete", deleteAttribute);


export default router;