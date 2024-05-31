import { Router } from "express";

import {
    addNewProduct,
    getAllProducts
} from "../controllers/product.controller.js";


const router = Router();

router.post("/add", addNewProduct);
router.get("/all", getAllProducts);

export default router