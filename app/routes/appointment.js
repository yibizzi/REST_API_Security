const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");
const {auth} = require("../middlewares/auth");


router.get("/", appointmentController.getAppointments);
router.get("/:appointmentId", appointmentController.getAppointmentbyId);
router.post("/", appointmentController.askforAppointment);
router.put("/:appointmentId", appointmentController.updateAppointment);
router.delete("/:appointmentId", appointmentController.deleteAppointment);

module.exports = router;




