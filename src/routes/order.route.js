import { Router } from "express";

import {
    addNewOrder,
    getAllOrders,
    getOrderById,
    updateOrder
} from "../controllers/order.controller.js";


const router = Router();


//GET Routes
/* Get All Orders by UserId Route -GET `/api/order/all` */
router.get("/all", getAllOrders);

/* Get Order by Id Route -GET `/api/order/:id` */
router.get("/:id", getOrderById);

//POST Routes
/* Add New Order Route -POST `/api/order/add` */
router.post("/add", addNewOrder);


//PATCH Routes
/* Update Order Route -PATCH `/api/order/update` */
router.patch("/update", updateOrder);


export default router;