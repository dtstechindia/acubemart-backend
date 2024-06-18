import { Router } from "express";

import {
    addNewImage,
    addImagesByProductId,
    getImagesByProductId,
    getImageById,
    updateImageById,
    deleteImage
} from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import multer from "multer";

const router = Router();


//GET Routes
/* Get Image by ProductId Route -GET `/api/image/all` */
router.get("/all", getImagesByProductId);

/* Get Image by Id Route -GET `/api/image/:id` */
router.get("/:id", getImageById);


//POST Routes
/* Add New Image Route -POST `/api/image/add` */
router.post("/add", upload.single("image"), addNewImage);

/* Add Images by ProductId Route -POST `/api/image/add/multiple` */
router.post("/add/multiple", upload.array("images"), addImagesByProductId);


//PATCH Routes
/* Update Image Route -PATCH `/api/image/update` */
router.patch("/update/:id", upload.single("image"), updateImageById);


//DELETE Routes
/* Delete Image Route -DELETE `/api/image/delete` */
router.delete("/delete", deleteImage);


export default router