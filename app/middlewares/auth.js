const jwt = require("jsonwebtoken");


function getRole (req) {
  try{
    const token = req.headers.authorization.split(" ")[1];
    let decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    return decodedToken.role;
  }catch(error){
    return {message : error}
  }
  
}


const doctorAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const doctorId = decodedToken.doctorId;
    req.body.doctorId = doctorId;
    next()
    
  } catch (error) {
    res.status(401).json({ error: error | "Request not authentified" });
  }
};


const patientAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const patientId = decodedToken.patientId;
    req.body.patientId = patientId;
    next()
    
  } catch (error) {
    res.status(401).json({ error: error | "Request not authentified" });
  }
};

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const adminId = decodedToken.adminId;
    req.body.adminId = adminId;
    next()
    
  } catch (error) {
    res.status(401).json({ error: error | "Request not authentified" });
  }
};

exports.auth = (req, res, next) => {
  const role = getRole(req);
  if (role == "admin") {
    adminAuth(req, res, next);
  } else if (role == "doctor") {
    doctorAuth(req, res, next);
  } else if (role == "patient") {
    patientAuth(req, res, next);
  } else {
    res.status(401).json({
      error: "Your token does't contain a role!"
    });
  }
};