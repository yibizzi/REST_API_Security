const jwt = require("jsonwebtoken");

//Rah token kayna f headers.Cookie 3la chkl string

exports.doctorAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const doctorId = decodedToken.doctorId;
    if (req.body.doctorId && req.body.doctorId !== doctorId) {
      throw "Doctor ID not valid";
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | "Request not authentified" });
  }
};

exports.patientAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const patientId = decodedToken.patientId;
    if (req.body.patientId && req.body.patientId !== patientId) {
      throw "Patient ID not valid";
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | "Request not authentified" });
  }
};

exports.adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const adminId = decodedToken.adminId;
    if (req.body.adminId && req.body.adminId !== adminId) {
      throw "Admin ID not valid";
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | "Request not authentified" });
  }
};

exports.auth = (req, res, next) => {
  const role = req.body.role;
  if (role == "admin") {
    adminAuth(req, res, next);
  } else if (role == "doctor") {
    doctorAuth(req, res, next);
  } else if (role == "patient") {
    patientAuth(req, res, next);
  } else {
    res.json({
      error: "Please assign one of these roles ( admin, patient, doctor",
    });
  }
};
