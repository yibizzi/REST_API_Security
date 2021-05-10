const MONGO_URI = "mongodb+srv://dahikon:easypassword@cluster0.7lugq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 9000;
const RESET_PASSWORD_URL = "http://localhost:4200/auth/reset_password?token=";

exports.MONGO_URI = MONGO_URI;
exports.PORT = PORT;
exports.RESET_PASSWORD_URL = RESET_PASSWORD_URL;

