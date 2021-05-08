const express = require("express");
const router = express.Router();
const doctorControllers = require("../controllers/doctor")

router.get("/", doctorControllers.getDoctors);
router.post("/", doctorControllers.createDoctor);
router.get("/:doctorId", doctorControllers.getDoctorById);
router.put("/:doctorId", doctorControllers.updateDoctor);
router.put("/:doctorId/confirm-appointment", doctorControllers.confirmAppointment);
router.delete("/:doctorId", doctorControllers.deleteDoctor);

module.exports = router;