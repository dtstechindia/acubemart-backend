import { Router } from "express";

import { 
    addNewVariant,
    getAllVariantsByProductId,
    getVariantById,
    updateVariant,
    deleteVariant
 } from "../controllers/variant.controller.js";


const router = Router();


//GET Routes
/* Get Variants by ProductId Route -GET `/api/variant/all` */
router.get("/all", getAllVariantsByProductId);

/* Get Variant by Id Route -GET `/api/variant/:id` */
router.get("/:id", getVariantById);


//POST Routes
/* Add New Variant Route -POST `/api/variant/add` */
router.post("/add", addNewVariant);


//PATCH Routes
/* Update Variant Route -PATCH `/api/variant/update` */
router.patch("/update", updateVariant);


//DELETE Routes
/* Delete Variant Route -DELETE `/api/variant/delete` */
router.delete("/delete", deleteVariant);