const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor");
const appointmentController = require("../controllers/appointment");

const {auth} = require('../middlewares/auth');

//Auth:
router.post('/auth/signup', doctorController.signup);
router.post('/auth/login', doctorController.login);
router.post('/auth/forget-password', doctorController.forgetPassword);
router.put('/auth/reset-password', doctorController.resetPassword);

//Other Routes:
router.get("/",doctorController.getDoctors);
router.get("/:doctorId" , doctorController.getDoctorById);
router.put("/:doctorId" , doctorController.updateDoctorInfo);
router.get("/:doctorId/rating", doctorController.doctorRating);
router.get("/:doctorId/appointments", doctorController.doctorAppointments);
router.get("/:doctorId/recieved-requests", doctorController.doctorRecievedRequests);
router.put("/:doctorId/confirm-appointment" , doctorController.confirmAppointment);
router.put("/:doctorId/cancel-appointment", appointmentController.cancelAppointment);
router.delete("/:doctorId" , doctorController.deleteDoctor);

module.exports = router;