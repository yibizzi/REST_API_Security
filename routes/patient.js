const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient");


router.get("/", patientController.getPatients);
router.post("/", patientController.createPatient);
router.get("/:patientId", patientController.getPatientById);
router.put("/:patientId/cancel-appointment", patientController.cancelAppointment);
router.put("/:patientId", patientController.updatePatient);

module.exports = router;