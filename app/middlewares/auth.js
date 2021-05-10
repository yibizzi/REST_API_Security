const jwt = require("jsonwebtoken");

//Rah token kayna f headers.Cookie 3la chkl string
exports.doctorAuth = (req, res, next) => {
  try {
    console.log(req);
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const doctorId = decodedToken.doctorId;
    if (req.params.doctorId && req.params.doctorId !== doctorId) {
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};

exports.patientAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const patientId = decodedToken.patientId;
    if (req.body.patientId && req.body.patientId !== patientId) {
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
