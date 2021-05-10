const mongoose = require("mongoose");


const adminSchema = mongoose.Schema({
    fullName: {
        firstName: String,
        lastName: String
    },
    email: String,
    password: String
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;