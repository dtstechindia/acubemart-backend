import bcryptjs from "bcryptjs";

import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import User from "../models/user.model.js";


/* Register New User */
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    //console.log(name, email, password);
    if (!name || !email || !password) return next(apiErrorHandler(400, "Please provide all fields"));

    
    try {

        const userExists = await User.findOne({ email });
        if (userExists) return next(apiErrorHandler(400, "User Already Exists"));

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword
        });

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: userWithoutPassword
        })
        
    } catch (error) {
        next(error);
    }
};


/* Get User by Id */
const getUserById = async (req, res, next) => {
    const userId  = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const user = await User.findById(userId);
        if (!user) return next(apiErrorHandler(404, "No User Found"));

        return res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            data: user
        })
        
    } catch (error) {
        next(error);
    }
};

/* Get All Users from DB */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) return next(apiErrorHandler(404, "No Users Found"));

        return res.status(200).json({
            success: true,
            message: "Users Fetched Successfully",
            data: users
        })
    } catch (error) {
        next(error);
    }
}


/* Update User Password */
const updateUserPassword = async (req, res, next) => {
   
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {

        const user = await User.findOne({ email }).select("+password");
        if (!user) return next(apiErrorHandler(404, "No User Found"));

        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) return next(apiErrorHandler(400, "Incorrect Credentials"));

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully",
            data: userWithoutPassword
        })
        
    } catch (error) {
        next(error);
    }
};

/* Update User Information */
const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, phone, address, avatar } = req.body;
    if (!id || !name || !email) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const user = await User.findByIdAndUpdate(id, { 
            name, 
            email, 
            phone,
            address, 
            avatar
        });
        if (!user) return next(apiErrorHandler(404, "No User Found"));

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            data: user
        })
        
    } catch (error) {
        next(error);
    }
};

/* Delete User */
const deleteUser = async (req, res, next) => {
    const userId  = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "Please provide User Id"));
    
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return next(apiErrorHandler(404, "No User Found"));

        return res.status(200).json({
            success: true,
            data: user
        })
        
    } catch (error) {
        next(error);
    }
};

export {
    registerUser,
    getAllUsers,
    updateUser,
    getUserById,
    updateUserPassword,
    deleteUser
}