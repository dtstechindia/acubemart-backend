import { Router } from "express";

import { 
    addNewVariant,
    getAllVariantsByProductId,
    getVariantById,
    updateVariant,
    deleteVariant,
    updateVariantImagesOrder,
    deleteVariantImage
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
/* Update Variant Route -PATCH `/api/variant/update/:id` */
router.patch("/update/:id", updateVariant);

/* Update Variant Images Order Route -PATCH `/api/variant/image/update/:id` */
router.patch("/image/update/:id", updateVariantImagesOrder);


//DELETE Routes
/* Delete Variant Route -DELETE `/api/variant/delete/:id` */
router.delete("/delete/:id", deleteVariant);

/* Delete Variant Image Route -DELETE `/api/variant/image/delete/:id` */
router.delete("/:variantId/image/delete/:imageId", deleteVariantImage);


export default router