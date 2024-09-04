import { Router } from "express";

import {
    addNewPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod
} from "../controllers/paymentMethod.controller.js";


const router = Router();


//GET Routes
/* Get All Payment Methods Route -GET `/api/paymentMethod/all` */
router.get("/all", getAllPaymentMethods);

/* Get Payment Method by Id Route -GET `/api/paymentMethod/:id` */
router.get("/:id", getPaymentMethodById);

//POST Routes
/* Add New Payment Method Route -POST `/api/paymentMethod/add` */
router.post("/add", addNewPaymentMethod);


//PATCH Routes
/* Update Payment Method Route -PATCH `/api/paymentMethod/update/:id` */
router.patch("/update/:id", updatePaymentMethod);


//DELETE Routes
/* Delete Payment Method Route -DELETE `/api/paymentMethod/delete/:id` */
router.delete("/delete/:id", deletePaymentMethod);


export default router;
