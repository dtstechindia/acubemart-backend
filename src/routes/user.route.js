import { Router } from "express";

import { 
    registerUser,
    getAllUsers,
 } from "../controllers/user.controller.js";

const router = Router();

 /* Register User Route - POST `/api/user/register` */
router.post("/register", registerUser);   

/* Get All Users Route - GET `/api/user/all` */
router.get("/all", getAllUsers);                


export default router