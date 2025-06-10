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


/* Register New User with otp and phone */
const registerUserWithPhone = async (req, res, next) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return next(apiErrorHandler(400, "Please provide all fields"));

    try {
        
        const userExists = await User.findOne({ phone });
        if (userExists) return next(apiErrorHandler(400, "User Already Exists"));
        // Generate a random 6-digit OTP
        const geteratedOTP = Math.floor(100000 + Math.random() * 900000);
        // Send OTP to user phone number
        const response = await fetch(`http://123.108.46.13/sms-panel/api/http/index.php?username=Deuscreation&apikey=4554A-7EDC0&apirequest=Text&sender=ROHIAL&mobile=${phone}&message=${geteratedOTP} is your OTP, Please enter this code to confirm your Registration. : SMS Sent Via ACUBEMART ROHAIL&route=OTP&TemplateID=1507165087189012738&format=JSON`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }   
        )
        if (!response.ok) {
            return next(apiErrorHandler(500, "Failed to send OTP"));
        }

        const user = await User.create({ 
            name, 
            email, 
            phone,
            otp: geteratedOTP
        });

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user,
        })
        
    } catch (error) {
        next(error);
    }
}


const verifyRegistrationOtpAndLogin = async (req, res, next) => {
    const { phone, otp } = req.body;
    if (!phone) return next(apiErrorHandler(400, "Phone Number is required"));
    if (!otp) return next(apiErrorHandler(400, "OTP is required"));

    try {
        const user = await User.findOne({ phone, otp });
        if (!user) return next(apiErrorHandler(404, "No User Found"));
        if (user.otp !== otp) return next(apiErrorHandler(400, "Incorrect OTP"));
        return res.status(200).json({
            success: true,
            message: "User Logged In Successfully",
            data: user
        })
        
    } catch (error) {
        next(error);
    }
}


/* Login User with access token and refresh token */
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    //console.log(email, password);
    if (!email) return next(apiErrorHandler(400, "Email is required"));
    if (!password) return next(apiErrorHandler(400, "Password is required"));

    try {
        const user = await User.findOne({ email }).select("+password");
        //console.log(user);
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


/* Send OTP to user phone number */
const sendOtpToUserPhone = async (req, res, next) => {
    const { phone } = req.body;
    if (!phone) return next(apiErrorHandler(400, "Phone Number is required"));

    try {
        const user = await User.findOne({ phone });
        if (!user) return next(apiErrorHandler(404, "No User Found"));
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
        const response = await fetch(`http://123.108.46.13/sms-panel/api/http/index.php?username=Deuscreation&apikey=4554A-7EDC0&apirequest=Text&sender=ROHIAL&mobile=${phone}&message=${otp} is your OTP, Please enter this code to confirm your Registration. : SMS Sent Via ACUBEMART ROHAIL&route=OTP&TemplateID=1507165087189012738&format=JSON`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }   
        )
        if (!response.ok) {
            return next(apiErrorHandler(500, "Failed to send OTP"));
        }
        user.otp = otp; // Assuming otp is generated and passed in the request body
        await user.save();
        //console.log(user);
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            data: user
        })
        
    } catch (error) {
        next(error);
    }
}


/* User Loging with Phone Number and otp */
const loginUserWithPhoneOtp = async (req, res, next) => {
    const { phone, otp } = req.body;

    if (!phone) return next(apiErrorHandler(400, "Phone Number is required"));
    if (!otp) return next(apiErrorHandler(400, "OTP is required"));

    try {
        //console.log(phone, otp);
        const user = await User.findOne({ phone });
        
        if (!user) return next(apiErrorHandler(404, "No User Found with this Phone Number"));
        //console.log(user);
        if (user.otp !== otp) return next(apiErrorHandler(400, "Incorrect OTP"));
        return res.status(200).json({
            success: true,
            message: "User Logged In Successfully",
            data: user
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


/* Get User by email */
const checkUserByEmailOrPhone = async (req, res, next) => {
    const {email, phone} = req.body;
    if (!email) return next(apiErrorHandler(400, "Please provide email or phone number"));
    
    try {
        const user = await User.findOne({ email, phone }).select("+password");
        if (!user) return next(apiErrorHandler(404, "No User Found"));
        console.log(user);
        return res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            data: user
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
        const users = await User.find().sort({ createdAt: -1 })
        .populate({path: "address", select: "street city state country pincode _id", strictPopulate: false  })
        .populate({path: "avatar", select: "url _id", strictPopulate: false  })
        .populate({path: "orders", select: "total orderNumber _id", strictPopulate: false  });
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


/* Get All users count */
const getAllUsersCount = async (req, res, next) => {
    try {
        const count = await User.countDocuments();
        return res.status(200).json({
            success: true,
            message: "All Users Count",
            data: count,
        });
    } catch (error) {
        next(error);
    }
};

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
    const { name, email, phone } = req.body;
    if (!userId) return next(apiErrorHandler(400, "userId is required"));
    
    try {
        const user = await User.findByIdAndUpdate(
            userId, 
            { 
                name, 
                email, 
                phone,
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
    registerUserWithPhone,
    verifyRegistrationOtpAndLogin,
    loginUser,
    sendOtpToUserPhone,
    loginUserWithPhoneOtp,
    logoutUser,
    getAllUsers,
    getAllUsersCount,
    updateUser,
    getUserById,
    updateUserPassword,
    checkUserByEmailOrPhone,
    deleteUser
}