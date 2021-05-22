const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient");
const { auth } = require('../middlewares/auth');

//Auth
router.post('/auth/signup', patientController.signup);
router.post('/auth/login', patientController.login);
router.post('/auth/forget-password',patientController.forgetPassword);
router.put('/auth/reset-password',patientController.resetPassword);


//Other Routes
router.get("/", auth, patientController.getPatients);
router.get("/:patientId", auth, patientController.getPatientById);
router.post("/:patientId/rate-doctor", auth, patientController.rateDoctor);
router.put("/:patientId/rate-doctor", auth, patientController.updateRating);
router.get("/:patientId/appointments", auth, patientController.patientAppointments);
router.get("/:patientId/send-requests", auth, patientController.patientSendRequests);
router.get("/:patientId/payments", auth, patientController.patientPayment);
router.put("/:patientId", auth, patientController.updatePatientInfo);
router.delete("/:patientId", auth, patientController.deletePatient);


module.exports = router;