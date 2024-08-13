import { Router } from "express";

import { 
    addNewAddress,
    getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
 } from "../controllers/address.controller.js";


const router = Router();


//GET Routes
/* Get All Addresses by UserId Route -GET `/api/address/all` */
router.get("/all/:id", getAllAddresses);

/* Get Address by Id Route -GET `/api/address/:id` */
router.get("/:id", getAddressById);


//POST Routes
/* Add New Address Route -POST `/api/address/add` */
router.post("/add", addNewAddress);


//PATCH Routes
/* Update Address Route -PATCH `/api/address/update` */
router.patch("/update/:id", updateAddress);


//DELETE Routes
/* Delete Address Route -DELETE `/api/address/delete` */
router.delete("/delete", deleteAddress);


export default router