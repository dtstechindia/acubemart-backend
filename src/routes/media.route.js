import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
    addNewMediaForCategory,
    addNewMediaForElement,
    addNewMediaForModel,
    addNewMediaForBrand,
    addNewMediaForAdmin,
    addNewMediaForUser,
    getMediaById,
    deleteMediaById
} from "../controllers/media.controller.js";


const router = Router();


//GET Routes
/* Get Media by Id Route -GET `/api/media/:id` */
router.get("/:id", getMediaById);


//POST Routes
/* Add New Media Route -POST `/api/media/add/category/:id` */
router.post("/add/category/:id", upload.single("image"), addNewMediaForCategory);

/* Add New Media Route -POST `/api/media/add/element/:id` */
router.post("/add/element/:id", upload.single("image"), addNewMediaForElement);

/* Add New Media Route -POST `/api/media/add/model/:id` */
router.post("/add/model/:id", upload.single("image"), addNewMediaForModel);

/* Add New Media Route -POST `/api/media/add/brand/:id` */
router.post("/add/brand/:id", upload.single("image"), addNewMediaForBrand);

/* Add New Media Route -POST `/api/media/add/admin/:id` */
router.post("/add/admin/:id", upload.single("image"), addNewMediaForAdmin);

/* Add New Media Route -POST `/api/media/add/user/:id` */
router.post("/add/user/:id", upload.single("image"), addNewMediaForUser);


//DELETE Routes
/* Delete Media Route -DELETE `/api/media/delete/:id` */
router.delete("/delete/:id", deleteMediaById);


export default router