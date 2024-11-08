import { Router } from "express";

import {
    addNewBrand,
    deleteBrand,
    updateBrandById,
    getAllBrands,
    getBrandById,
    getAllActiveBrands
} from "../controllers/brand.controller.js";


const router = Router();    

//GET Routes
/* Get All Brands Route -GET `/api/brand/all` */
router.get("/all", getAllBrands);

/* Get All Active Brands Route -GET `/api/brand/active` */
router.get("/active", getAllActiveBrands);

/* Get Brand by Id Route -GET `/api/brand/:id` */
router.get("/:id", getBrandById);

//POST Routes
/* Add New Brand Route -POST `/api/brand/add` */
router.post("/add", addNewBrand);


//PATCH Routes
/* Update Brand Route -PATCH `/api/brand/update/:id` */
router.patch("/update/:id", updateBrandById);

//DELETE Routes
/* Delete Brand Route -DELETE `/api/brand/delete/:id` */
router.delete("/delete/:id", deleteBrand);

export default router