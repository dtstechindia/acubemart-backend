import bcryptjs from "bcryptjs";

import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import User from "../models/user.model.js";


/* Register New User */
const registerUser = async (req, res, next) => {
    const { name, email, password, phone } = req.body;
    //console.log(name, email, password);
    if (!name || !email || !password) return next(apiErrorHandler(400, "Please provide all fields"));

    
    try {

        const userExists = await User.findOne({ email });
        if (userExists) return next(apiErrorHandler(400, "User Already Exists"));

        const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPTJS_SALT));
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            phone
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

/* Login User with access token and refresh token */
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return next(apiErrorHandler(400, "Email is required"));
    if (!password) return next(apiErrorHandler(400, "Password is required"));

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) return next(apiErrorHandler(404, "No User Found"));

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return next(apiErrorHandler(400, "Incorrect Credentials"));

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(200).json({
            success: true,
            message: "User Logged In Successfully",
            data: userWithoutPassword
        })
        
    } catch (error) {
        next(error);
    }
}


/* User Logout */
const logoutUser = (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "User Logged Out Successfully"
    })
}

/* Get User by Id */
const getUserById = async (req, res, next) => {
    const userId  = req.params.id;
    if (!userId) return next(apiErrorHandler(400, "Please provide all fields"));
    
    try {
        const user = await User.findById(userId)
        .populate({path: "orders", select: "total _id", strictPopulate: false  })
        .populate({path: "address", select: "street city state country pincode _id", strictPopulate: false  })
        .populate({path: "avatar", select: "url _id", strictPopulate: false  });
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
        const users = await User.find()
        .populate({path: "address", select: "street city state country pincode _id", strictPopulate: false  })
        .populate({path: "avatar", select: "url _id", strictPopulate: false  });
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

        const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPTJS_SALT));
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
    const userId = req.params.id;
    const { name, email, phone, address, avatar } = req.body;
    if (!userId) return next(apiErrorHandler(400, "userId is required"));
    
    try {
        const user = await User.findByIdAndUpdate(
            userId, 
            { 
                name, 
                email, 
                phone,
                address, 
                avatar
            },
            { 
                new: true, 
                runValidators: true 
            }
    );
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
    loginUser,
    logoutUser,
    getAllUsers,
    updateUser,
    getUserById,
    updateUserPassword,
    deleteUser
}