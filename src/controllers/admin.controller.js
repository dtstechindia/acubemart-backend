import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";

import Admin from "../models/admin.model.js";
import bcryptjs from "bcryptjs";


/* Add New Admin with session token and refresh token */
const registerAdmin = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return next(apiErrorHandler(400, "Please provide all fields"));

    try {
        const adminExists = await Admin.findOne({ email });
        if (adminExists) return next(apiErrorHandler(400, "Admin Already Exists"));
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const admin = new Admin({ 
            name, 
            email, 
            password: hashedPassword, 
            role
        });
        await admin.save();
        let adminWithoutPassword = { ...admin._doc };
        delete adminWithoutPassword.password;
        return res.status(201).json({ success: true, message: "Admin Added Successfully", admin: adminWithoutPassword });
    } catch (error) {
        next(error);
    }
}

/* Get All Admins */
const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find().select("-password");
        return res.status(200).json({ success: true, message: "Admins Fetched Successfully", admins });
    } catch (error) {
        next(error);
    }
}


/* Get Admin by Id */
const getAdminById = async (req, res, next) => {
    const adminId = req.params.id;
    if (!adminId) return next(apiErrorHandler(400, "Please provide Admin Id"));
    try {
        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) return next(apiErrorHandler(404, "No Admin Found"));
        return res.status(200).json({ success: true, message: "Admin Fetched Successfully", admin });
    } catch (error) {
        next(error);
    }
}


/* Update Admin Password */
const updateAdminPassword = async (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) return next(apiErrorHandler(400, "Please provide all fields"));
    try {
        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) return next(apiErrorHandler(404, "No Admin Found"));
        const isMatch = await bcryptjs.compare(oldPassword, admin.password);
        if (!isMatch) return next(apiErrorHandler(400, "Incorrect Credentials"));
        const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPTJS_SALT));
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        admin.password = hashedPassword;
        await admin.save();
        let adminWithoutPassword = { ...admin._doc };
        delete adminWithoutPassword.password;
        return res.status(200).json({ success: true, message: "Password Updated Successfully", admin: adminWithoutPassword });
    } catch (error) {
        next(error);
    }
}


/* Delete Admin */
const deleteAdmin = async (req, res, next) => {
    const adminId = req.params.id;
    if (!adminId) return next(apiErrorHandler(400, "Please provide Admin Id"));
    try {
        const admin = await Admin.findByIdAndDelete(adminId);
        if (!admin) return next(apiErrorHandler(404, "No Admin Found"));
        return res.status(200).json({ success: true, message: "Admin Deleted Successfully", admin });
    } catch (error) {
        next(error);
    }
}


/* Login Admin */
const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(apiErrorHandler(400, "Please provide all fields"));
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return next(apiErrorHandler(404, "No Admin Found"));
        const isMatch = await bcryptjs.compare(password, admin.password);
        if (!isMatch) return next(apiErrorHandler(400, "Incorrect Credentials"));
        let adminWithoutPassword = { ...admin._doc };
        delete adminWithoutPassword.password;
        return res.status(200).json({ success: true, message: "Admin Logged In Successfully", admin: adminWithoutPassword });
    } catch (error) {
        next(error);
    }
}


/* Logout Admin */
const logoutAdmin = (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Admin Logged Out Successfully"
    })
}

export { 
    registerAdmin,
    loginAdmin, 
    logoutAdmin, 
    updateAdminPassword, 
    deleteAdmin,
    getAllAdmins, 
    getAdminById,
}