import { Router } from "express";

import {
	createPayment,
	handlePaymentWebhook,
	recoverCapturedPayment,
	verifyPaymentAndCreateOrder,
} from "../controllers/payments.controller.js";

const router = Router();

//POST Routes
/* Add New Payment Route -POST `/api/payment/order/add` */
router.post("/add", createPayment);
router.post("/verify", verifyPaymentAndCreateOrder);
router.post("/recover", recoverCapturedPayment);
router.post("/webhook", handlePaymentWebhook);

export default router;
