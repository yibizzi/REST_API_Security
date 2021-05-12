const mongoose = require("mongoose");


const adminSchema = mongoose.Schema({
    profileImg: String, 
    fullName:{
        firstName: String,
        lastName: String,
    },
    email: String,
    password: String
});

module.exports = Admin = mongoose.model("admin", adminSchema);