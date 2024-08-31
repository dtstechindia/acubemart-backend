import { Router } from "express";

import {
  addNewCoupon,
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  updateCouponById,
  deleteCouponById,
} from "../controllers/coupon.controller.js";

const router = Router();

//GET Routes
/* Get All Coupons Route -GET `/api/coupon/all` */
router.get("/all", getAllCoupons);

/* Get Coupon by Id Route -GET `/api/coupon/:id` */
router.get("/:id", getCouponById);

/* get coupon by COUPON Code -GET `/api/coupon/code/:code` */
router.get("/code/:code", getCouponByCode);

//POST Routes
/* Add New Coupon Route -POST `/api/coupon/add` */
router.post("/add", addNewCoupon);

//PATCH Routes
/* Update Coupon Route -PATCH `/api/coupon/update/:id` */
router.patch("/update/:id", updateCouponById);

//DELETE Routes
/* Delete Coupon Route -DELETE `/api/coupon/delete/:id` */
router.delete("/delete/:id", deleteCouponById);

export default router;
