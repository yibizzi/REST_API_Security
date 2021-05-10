//requiring modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const MONGO_URI = require("./app/config/config").MONGO_URI;
const PORT = require("./app/config/config").PORT;
const appointmentRoutes = require("./app/routes/appointment");
const doctorRoutes = require("./app/routes/doctor");
const patientRoutes = require("./app/routes/patient");

const app = express();


//Cors policy :
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Body limits :
app.use(bodyParser.json({limit:"30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended: true}));


// use routes
app.use("/appointments", appointmentRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);



mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);



