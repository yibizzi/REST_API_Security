const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Email validation
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const patientSchema = mongoose.Schema({
  ProfileImg: String,
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      details: {
        type: String,
      },
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
  age: {
    type: Number,
    // required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  sendRequest: Array,
  appointments: Array,
  payments: Array
});

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Patient", patientSchema);
