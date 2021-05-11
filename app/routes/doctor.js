const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor")
const {auth} = require('../middlewares/auth');

//Auth:
router.post('/auth/signup', doctorController.signup);
router.post('/auth/login', doctorController.login);
router.post('/auth/forget-password', doctorController.forgetPassword);
router.put('/auth/reset-password', doctorController.resetPassword);


//Other Routes:
router.get("/", doctorController.getDoctors);
router.get("/:doctorId", doctorController.getDoctorById);
router.put("/:doctorId", doctorController.updateDoctorInfo);
router.put("/:doctorId/confirm-appointment", doctorController.confirmAppointment);
router.delete("/:doctorId", doctorController.deleteDoctor);


module.exports = router;