import { Router } from "express";

import { 
    registerUser,
    registerUserWithPhone,
    verifyRegistrationOtpAndLogin,
    loginUser,
    sendOtpToUserPhone,
    loginUserWithPhoneOtp,
    logoutUser,
    getAllUsers,
    getAllUsersCount,
    updateUser,
    updateUserPassword,
    getUserById,
    deleteUser,
    checkUserByEmailOrPhone
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

/* Register User with Phone Route - POST `/api/user/registerwithphone` */
router.post("/registerwithphone", registerUserWithPhone);

/* Verify Registration OTP and Login Route - POST `/api/user/verifyotpandlogin` */
router.post("/verifyotpandlogin", verifyRegistrationOtpAndLogin);

/* Send OTP to User Phone Route - POST `/api/user/sendotp` */
router.post("/sendotp", sendOtpToUserPhone);

/* Login User with Phone OTP Route - POST `/api/user/loginwithphoneotp` */
router.post("/loginwithphoneotp", loginUserWithPhoneOtp);

/* Login User Route - POST `/api/user/login` */
router.post("/login", loginUser);

/* Logout User Route - POST `/api/user/logout` */
router.post("/logout", logoutUser);

/* All Users Count Route - POST `/api/user/count` */
router.post("/count", getAllUsersCount);

/* Check User Email or Phone Route - POST `/api/user/check` */
router.post("/checkuser", checkUserByEmailOrPhone);


//PATCH Routes
/* Update User Route - PATCH `/api/user/update/:id` */
router.patch("/update/:id", updateUser);

/* Update User Password Route - PATCH `/api/user/password` */
router.patch("/password", updateUserPassword);



//DELETE Routes
/* Delete User Route - DELETE `/api/user/delete/:id` */
router.delete("/delete/:id", deleteUser);

export default router