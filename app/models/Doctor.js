const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Email validation
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

//Rating object
const rating = {
  patientId: mongoose.Types.ObjectId,
  rating: Number,
};

const doctorSchema = mongoose.Schema({
  profileImg: String,
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: { type: String, required: true },
  reset_password_token: {
    type: String,
  },
  reset_password_expires: {
    type: Date,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  location: {
    longitude: Number,
    latitude: Number,
  },
  description: String,
  ratings: [rating],
  recievedRequests: Array,
  appointments: Array,
  history: Array,
});

doctorSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Doctor", doctorSchema);
