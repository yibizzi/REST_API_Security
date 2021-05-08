const mongoose = require("mongoose");

const rating = {
    patienfId: Number,
    rating: Number
};

const doctorSchema = mongoose.Schema({
    avatar: String,
    name: {
        firstName: String,
        lastName: String
    },
    email: String,
    password: String,
    phoneNumber: String,
    speciality: String,
    location: {
        longitude: Number,
        latitude: Number
    },
    description: String,
    ratings: [rating],
    recievedRequests: Array,
    appointments: Array,
    history: Array
});


const Doctor = mongoose.model("doctor", doctorSchema);

module.exports = Doctor;
