import { Router } from "express";

import {
    addNewVehicleType,
    getAllVehicleTypes,
    getVehicleTypeById,
    getAllActiveVehicleTypes,
    updateVehicleType,
    deleteVehicleType,
} from "../controllers/vehicletype.controller.js";


const router = Router();


//GET Routes
// Get All Vehicle Types Route -GET `/api/vehicletype/all`
router.get("/all", getAllVehicleTypes);

// Get All Active Vehicle Types Route -GET `/api/vehicletype/active`
router.get("/active", getAllActiveVehicleTypes);

// Get Vehicle Type by Id Route -GET `/api/vehicletype/:id`
router.get("/:id", getVehicleTypeById);


//POST Routes
// Add New Vehicle Type Route -POST `/api/vehicletype/add`
router.post("/add", addNewVehicleType);


//PATCH Routes
/* Update Vehicle Type Route -PATCH `/api/vehicletype/update` */
router.patch("/update/:id", updateVehicleType);

//DELETE Routes
/* Delete Vehicle Type Route -DELETE `/api/vehicletype/delete` */
router.delete("/delete/:id", deleteVehicleType);


export default router;