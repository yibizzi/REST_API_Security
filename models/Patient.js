const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
    avatar: String,
    name: {
        firstName: String,
        lastName: String
    },
    email: String,
    age: Number,
    password: String,
    phoneNumber: String,
    sendRequest: Array,
    appointments: Array,
    history: Array
});


const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;

