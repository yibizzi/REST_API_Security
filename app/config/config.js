require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 9000;
const RESET_PASSWORD_URL = "http://localhost:4200/auth/reset_password?token=";
const TOKEN_SECRET = process.env.TOKEN_SECRET;


exports.TOKEN_SECRET = TOKEN_SECRET;
exports.MONGO_URI = MONGO_URI;
exports.PORT = PORT;
exports.RESET_PASSWORD_URL = RESET_PASSWORD_URL;

