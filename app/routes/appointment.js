const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");
const auth = require("../middlewares/auth");

router.get("/:appointmentId", appointmentController.getAppointmentbyId);
router.post("/",auth.patient_Auth_With_Id_Body, appointmentController.askforAppointment);
router.get("/", appointmentController.getAppointments);
router.put("/:appointmentId", appointmentController.updateAppointment);
router.delete("/:appointmentId", appointmentController.deleteAppointment);

module.exports = router;


