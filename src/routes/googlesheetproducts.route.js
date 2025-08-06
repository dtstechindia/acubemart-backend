import { Router } from "express";

import {
    addAllPublishedProductsToGoogleSheet,
    updateAllPublishedProductsInGoogleSheet,
} from "../controllers/googlesheetproducts.controller.js";

const router = Router();


//POST Routes
/* Add All Published Products to Google Sheet Route -POST `/api/googlesheetproducts/add` */
router.post("/add", addAllPublishedProductsToGoogleSheet);

//PUT Routes
/* Update All Published Products in Google Sheet Route -PUT `/api/googlesheetproducts/update` */
router.put("/update", updateAllPublishedProductsInGoogleSheet);

export default router