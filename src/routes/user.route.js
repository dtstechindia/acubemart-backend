import { Router } from "express";

import { 
    registerUser,
    loginUser,
    logoutUser,
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

/* Login User Route - POST `/api/user/login` */
router.post("/login", loginUser);

/* Logout User Route - POST `/api/user/logout` */
router.post("/logout", logoutUser);


//PATCH Routes
/* Update User Route - PATCH `/api/user/update/:id` */
router.patch("/update/:id", updateUser);

/* Update User Password Route - PATCH `/api/user/password` */
router.patch("/password", updateUserPassword);



//DELETE Routes
/* Delete User Route - DELETE `/api/user/delete/:id` */
router.delete("/delete/:id", deleteUser);

export default router