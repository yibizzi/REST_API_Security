const mongoose = require("mongoose");


const appointmentSchema = mongoose.Schema({
    doctorId: mongoose.Types.ObjectId,
    patientId: mongoose.Types.ObjectId,
    perception: String,
    date: Date,
    isDone: Boolean,
    price: Number
});

const Appointment = mongoose.model("Appointment", appointmentSchema);


module.exports = Appointment;
