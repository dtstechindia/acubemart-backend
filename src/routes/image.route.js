import { Router } from "express";

import {
    addNewImage,
    addImagesByProductId,
    getImagesByProductId,
    getImageById,
    updateImageById,
    deleteImage
} from "../controllers/image.controller.js";

const router = Router();


//GET Routes
/* Get Image by ProductId Route -GET `/api/image/all` */
router.get("/all", getImagesByProductId);

/* Get Image by Id Route -GET `/api/image/:id` */
router.get("/:id", getImageById);


//POST Routes
/* Add New Image Route -POST `/api/image/add` */
router.post("/add", addNewImage);

/* Add Images by ProductId Route -POST `/api/image/add/:id` */
router.post("/add/multiple/:id", addImagesByProductId);


//PATCH Routes
/* Update Image Route -PATCH `/api/image/update` */
router.patch("/update/:id", updateImageById);


//DELETE Routes
/* Delete Image Route -DELETE `/api/image/delete` */
router.delete("/delete", deleteImage);


export default router