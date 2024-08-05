import { Router } from "express";

import { 
    registerAdmin,
    getAllAdmins,
    getAdminById,
    updateAdminPassword,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin
} from "../controllers/admin.controller.js";


const router = Router();

//GET Routes
/* Get All Admins Route -GET `/api/admin/all` */
router.get("/all", getAllAdmins);

/* Get Admin by Id Route -GET `/api/admin/:id` */
router.get("/:id", getAdminById);

//POST Routes
/* Register Admin Route -POST `/api/admin/register` */
router.post("/register", registerAdmin);

/* Login Admin Route -POST `/api/admin/login` */
router.post("/login", loginAdmin);

/* Logout Admin Route -POST `/api/admin/logout` */
router.post("/logout", logoutAdmin);


//PATCH Routes
/* Update Admin Route -PATCH `/api/admin/update/password/:id` */
router.patch("/update/password/:id", updateAdminPassword);

/* Update Admin Route -PATCH `/api/admin/update/:id` */
router.patch("/update/:id", updateAdmin);

//DELETE Routes
/* Delete Admin Route -DELETE `/api/admin/delete/:id` */
router.delete("/delete/:id", deleteAdmin);


export default router