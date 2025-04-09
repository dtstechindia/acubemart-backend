import { Router } from "express";

import {
    addNewServiceProvider,
    getAllServiceProviders,
    getServiceProviderById,
    updateServiceProvider,
    deleteServiceProvider,
    getAllActiveServiceProviders,
    getServiceProviderByServiceIdAndVehicleTypeId
} from "../controllers/serviceprovider.controller.js";

const router = Router();

//GET Routes
// Get All Service Providers Route -GET `/api/serviceprovider/all`
router.get("/all", getAllServiceProviders);


// Get All Active Service Providers Route -GET `/api/serviceprovider/active`
router.get("/active", getAllActiveServiceProviders);

// Get Service Provider by Id Route -GET `/api/serviceprovider/:id`
router.get("/:id", getServiceProviderById);


// Get Service Provider by Service Id and Vehicle Type Id Route -GET `/api/serviceprovider/service/:serviceId/vehicletype/:vehicleTypeId`
router.get("/service/:serviceId/vehicletype/:vehicleTypeId", getServiceProviderByServiceIdAndVehicleTypeId);


//POST Routes
// Add New Service Provider Route -POST `/api/serviceprovider/add`
router.post("/add", addNewServiceProvider);


//PATCH Routes
// Update Service Provider Route -PATCH `/api/serviceprovider/update/:id`
router.patch("/update/:id", updateServiceProvider);


//DELETE Routes
// Delete Service Provider Route -DELETE `/api/serviceprovider/delete/:id`
router.delete("/delete/:id", deleteServiceProvider);

export default router