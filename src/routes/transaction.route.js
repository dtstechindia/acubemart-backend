import { Router } from "express";

import { 
    addNewTransaction,
    getTransactionById,
    getTransactionsByOrderId,
    getTransactionsByUserId,
    deleteTransaction
 } from "../controllers/transaction.controller.js";


const router = Router();


//GET Routes

/* Get Transaction by Id Route -GET `/api/transaction/:id` */
router.get("/:id", getTransactionById);

/* Get Transactions by OrderId Route -GET `/api/transaction/order/:id` */
router.get("/order/:id", getTransactionsByOrderId);

/* Get Transactions by UserId Route -GET `/api/transaction/user/:id` */
router.get("/user/:id", getTransactionsByUserId);


//POST Routes
/* Add New Transaction Route -POST `/api/transaction/add` */
router.post("/add", addNewTransaction);


//DELETE Routes
/* Delete Transaction Route -DELETE `/api/transaction/delete` */
router.delete("/delete", deleteTransaction);

export default router;