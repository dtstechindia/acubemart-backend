import { Router } from "express";

import {
    addNewService,
    getAllServices,
    updateService,
    deleteService,
    getAllActiveServices,
    getServiceById
} from "../controllers/service.controller.js";

const router = Router();

//GET Routes
/* Get All Services Route -GET `/api/service/all` */
router.get("/all", getAllServices);

/* Get All Active Services Route -GET `/api/service/active` */
router.get("/active", getAllActiveServices);

/* Get Service by Id Route -GET `/api/service/:id` */
router.get("/:id", getServiceById);

//POST Routes
/* Add New Service Route -POST `/api/service/add` */
router.post("/add", addNewService);

//PATCH Routes
/* Update Service Route -PATCH `/api/service/update` */
router.patch("/update/:id", updateService);

//DELETE Routes
/* Delete Service Route -DELETE `/api/service/delete/:id` */
router.delete("/delete/:id", deleteService);

export default router