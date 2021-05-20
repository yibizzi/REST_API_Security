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
router.get("/", auth,doctorController.getDoctors);
router.get("/:doctorId" ,auth, doctorController.getDoctorById);
router.put("/:doctorId" ,auth, doctorController.updateDoctorInfo);
router.get("/:doctorId/rating",auth, doctorController.doctorRating);
router.get("/:doctorId/appointments",auth, doctorController.doctorAppointments);
router.get("/:doctorId/recieved-requests",auth, doctorController.doctorRecievedRequests);
router.put("/:doctorId/confirm-appointment" ,auth, doctorController.confirmAppointment);
router.put("/:doctorId/cancel-appointment",auth, appointmentController.cancelAppointment);
router.delete("/:doctorId" ,auth, doctorController.deleteDoctor);

module.exports = router;