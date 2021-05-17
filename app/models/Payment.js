const mongoose = require("mongoose");


const paymentSchema = mongoose.Schema({
    doctorId: mongoose.Types.ObjectId,
    patientId: mongoose.Types.ObjectId,
    appointmentId: mongoose.Types.ObjectId,
    customerId: String,
    amount: Number,
    description: String,
    date: Date
});


module.exports = Payment = mongoose.model("payment", paymentSchema);