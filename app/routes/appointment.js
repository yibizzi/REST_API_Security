const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");
const paymentControllers = require("../controllers/payment");
const {auth} = require("../middlewares/auth");


router.get("/", auth, appointmentController.getAppointments);
router.get("/:appointmentId", auth, appointmentController.getAppointmentbyId);
router.post("/", auth, appointmentController.askforAppointment);
router.post("/:appointmentId/pay", auth , paymentControllers.pay);
router.put("/:appointmentId", auth ,appointmentController.updateAppointment);
router.delete("/:appointmentId", auth , appointmentController.deleteAppointment);

module.exports = router;




