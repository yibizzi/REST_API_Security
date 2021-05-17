const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient");
const paymentController = require("../controllers/payment");
const appointmentController = require("../controllers/appointment");
const { auth } = require('../middlewares/auth');

//Auth
router.post('/auth/signup', patientController.signup);
router.post('/auth/login', patientController.login);
router.post('/auth/forget-password',patientController.forgetPassword);
router.put('/auth/reset-password',patientController.resetPassword);


//Other Routes
router.get("/", patientController.getPatients);
router.get("/:patientId", patientController.getPatientById);
router.post("/:patientId/rate-doctor", patientController.rateDoctor);
router.put("/:patientId/rate-doctor", patientController.updateRating);
router.put("/:patientId/cancel-appointment", appointmentController.cancelAppointment);
// router.post("/:patientId/payment", paymentController.pay);
router.get("/:patientId/appointments", patientController.patientAppointments);
router.get("/:patientId/send-requests", patientController.patientSendRequests);
router.put("/:patientId", patientController.updatePatientInfo);
router.delete("/:patientId", patientController.deletePatient);



module.exports = router;