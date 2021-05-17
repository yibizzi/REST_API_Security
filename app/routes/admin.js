const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const {auth} = require("../middlewares/auth");

//Auth:
router.post('/auth/signup',adminController.signup);
router.post('/auth/login', adminController.login);
router.post('/auth/forget-password',adminController.forgetPassword);
router.put('/auth/reset-password',adminController.resetPassword);


//Other routes:
router.get("/", adminController.getAdmins);
router.get("/:adminId", adminController.getAdminById);
router.put("/:adminId", adminController.updateAdmin);
router.delete("/:adminId",  adminController.deleteAdmin);


module.exports = router;
