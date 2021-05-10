const express = require("express");
const router = express.Router();
const doctorControllers = require("../controllers/doctor")
const { doctorAuth } = require('../middlewares/auth');

//Auth:
router.post('/auth/signup',doctorControllers.signup);
router.post('/auth/login', doctorControllers.login);
router.post('/auth/forget-password',doctorControllers.forgetPassword);
router.put('/auth/reset-password',doctorControllers.resetPassword);
router.get('/auth/logout', doctorControllers.logout);

//Other Routes:
router.get("/", doctorControllers.getDoctors);
router.get("/:doctorId" , doctorControllers.getDoctorById);
router.put("/:doctorId" , doctorControllers.updateDoctorInfo);
router.put("/:doctorId/confirm-appointment" , doctorControllers.confirmAppointment);
router.delete("/:doctorId" , doctorControllers.deleteDoctor);


module.exports = router;