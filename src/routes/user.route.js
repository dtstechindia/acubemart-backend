import { Router } from "express";

import { 
    createUser,
    getAllUsers,
 } from "../controllers/user.controller.js";

const router = Router();

router.post("/create", createUser);
router.get("/all", getAllUsers);


export default router