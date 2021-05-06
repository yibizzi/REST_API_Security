import mongoose from "mongoose";
import Appoitment from "./appoitment";


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
    sendRequest: [Appoitment],
    appoitments: [Appoitment],
    history: []
});


const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;

