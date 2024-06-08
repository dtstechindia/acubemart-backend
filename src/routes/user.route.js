import { Router } from "express";

import { 
    registerUser,
    getAllUsers,
    updateUser,
    updateUserPassword,
    getUserById,
    deleteUser
 } from "../controllers/user.controller.js";

const router = Router();

//GET Routes
/* Get All Users Route - GET `/api/user/all` */
router.get("/all", getAllUsers);  

/* Get User by Id Route - GET `/api/user/:id` */
router.get("/:id", getUserById);


//POST Routes
 /* Register User Route - POST `/api/user/register` */
router.post("/register", registerUser);   


//PATCH Routes
/* Update User Route - PATCH `/api/user/update` */
router.patch("/update", updateUser);

/* Update User Password Route - PATCH `/api/user/password` */
router.patch("/password", updateUserPassword);



//DELETE Routes
/* Delete User Route - DELETE `/api/user/delete` */
router.delete("/delete", deleteUser);

export default router