import mongoose from "mongoose";
import Appoitment from "./appoitment";

const rating = {
    patienfId: ObjectId,
    rating: Number
};

const doctorSchema = mongoose.Schema({
    avatar: String,
    name: {
        firstName: String,
        lastName: String
    },
    eamil: String,
    password: String,
    phoneNumber: String,
    speciality: String,
    location: {
        longitude: Number,
        latitude: Number
    },
    description: String,
    ratings: [rating],
    recievedRequests: [Appoitment],
    appoitments: [Appoitment],
    history: []
});

const Doctor = mongoose.model("doctor", doctorSchema);

module.exports = Doctor;
