import { Router } from "express";

import {
    addAllPublishedProductsToGoogleSheet
} from "../controllers/googlesheetproducts.controller.js";

const router = Router();


//POST Routes
/* Add All Published Products to Google Sheet Route -POST `/api/googlesheetproducts/add` */
router.post("/add", addAllPublishedProductsToGoogleSheet);

export default router