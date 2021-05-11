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
router.get("/", patientController.getPatients);
router.get("/:patientId", patientController.getPatientById);
router.put("/:patientId/cancel-appointment", patientController.cancelAppointment);
router.put("/:patientId", patientController.updatePatientInfo);
router.delete("/:patientId", patientController.deletePatient);

module.exports = router;