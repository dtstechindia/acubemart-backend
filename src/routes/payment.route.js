import { Router } from "express";

import { createPayment } from "../controllers/payments.controller.js";

const router = Router();

//POST Routes
/* Add New Payment Route -POST `/api/payment/order/add` */
router.post("/add", createPayment);

export default router;
