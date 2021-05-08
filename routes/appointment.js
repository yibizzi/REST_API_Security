const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");

router.get("/:appointmentId", appointmentController.getAppointmentbyId);
router.post("/", appointmentController.askforAppointment);
router.get("/", appointmentController.getAppointments);
router.put("/:appointmentId", appointmentController.updateAppointment);
router.delete("/:appointmentId", appointmentController.deleteAppointment);

module.exports = router;


