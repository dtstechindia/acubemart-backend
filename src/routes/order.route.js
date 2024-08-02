import { Router } from "express";

import {
    addNewOrder,
    getAllOrdersList,
    getAllOrdersByUserId,
    getOrderById,
    updateOrder
} from "../controllers/order.controller.js";


const router = Router();


//GET Routes
/* Get All Orders List Route -GET `/api/order/all` */
router.get("/all", getAllOrdersList);

/* Get All Orders by UserId Route -GET `/api/order/user/:id` */
router.get("/user/:id", getAllOrdersByUserId);

/* Get Order by Id Route -GET `/api/order/:id` */
router.get("/:id", getOrderById);

//POST Routes
/* Add New Order Route -POST `/api/order/add` */
router.post("/add", addNewOrder);


//PATCH Routes
/* Update Order Route -PATCH `/api/order/update` */
router.patch("/update", updateOrder);


export default router;