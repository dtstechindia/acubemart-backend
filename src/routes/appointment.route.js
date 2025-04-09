import { Router } from "express";

import { 
    addNewAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByUserId
 } from "../controllers/appointment.controller.js";

const router = Router();

//GET Routes
/* Get All Appointments Route -GET `/api/appointment/all` */
router.get("/all", getAllAppointments);

/* Get Appointment by Id Route -GET `/api/appointment/:id` */
router.get("/:id", getAppointmentById);

/* Get Appointments by User Id Route -GET `/api/appointment/user/:id` */
router.get("/user/:id", getAppointmentsByUserId);

//POST Routes
/* Add New Appointment Route -POST `/api/appointment/add` */
router.post("/add", addNewAppointment);

//PATCH Routes
/* Update Appointment Route -PATCH `/api/appointment/update` */
router.patch("/update/:id", updateAppointment);

//DELETE Routes
/* Delete Appointment Route -DELETE `/api/appointment/delete` */
router.delete("/delete/:id", deleteAppointment);

export default router;