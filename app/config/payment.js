require('dotenv').config();

const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

exports.PUBLISHABLE_KEY = PUBLISHABLE_KEY;
exports.SECRET_KEY = SECRET_KEY;