import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import User from "../models/user.model.js";


/* Register New User */
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    //console.log(name, email, password);
    if (!name || !email || !password) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const user = await User.create({ 
            name, 
            email, 
            password 
        });
        return res.status(201).json({
            success: true,
            data: user
        })
        
    } catch (error) {
        next(apiErrorHandler(error.statusCode, error.message));
    }
};


/* Get All Users from DB */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        next(apiErrorHandler(error.statusCode, error.message));
    }
}

export {
    registerUser,
    getAllUsers,

}