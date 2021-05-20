const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");
const { auth } = require('../middlewares/auth');

router.post("/",auth, paymentController.pay);


module.exports = router;