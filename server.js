//requiring modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { PORT, MONGO_URI } = require("./app/config/config");
const appointmentRoutes = require("./app/routes/appointment");
const doctorRoutes = require("./app/routes/doctor");
const patientRoutes = require("./app/routes/patient");
const adminRoutes = require("./app/routes/admin");


const app = express();


//Cors policy :
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Body limits :
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


//Use routes :
app.use("/appointments", appointmentRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/admins", adminRoutes);
app.get("/", (req, res) => {
  res.send("<h1> Welcome to our RESTfull Health API</h1> ");
})

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);



