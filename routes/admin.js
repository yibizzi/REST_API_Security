const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");


router.get("/", adminControllers.getAdmin);
router.get("/:adminId", adminControllers.getAdminById);
router.post("/", adminControllers.createAdmin);
router.put("/:adminId", adminControllers.updateAdmin);
router.delete("/:adminId", adminControllers.deleteAdmin);


module.exports = router;