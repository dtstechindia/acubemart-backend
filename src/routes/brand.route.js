import { Router } from "express";

import {
    addNewBrand,
    deleteBrand,
    getAllBrands
} from "../controllers/brand.controller.js";


const router = Router();    

//GET Routes
/* Get All Brands Route -GET `/api/brand/all` */
router.get("/all", getAllBrands);

//POST Routes
/* Add New Brand Route -POST `/api/brand/add` */
router.post("/add", addNewBrand);

//DELETE Routes
/* Delete Brand Route -DELETE `/api/brand/delete` */
router.delete("/delete", deleteBrand);

export default router