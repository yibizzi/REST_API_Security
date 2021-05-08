//requiring modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const MONGO_URI = require("./app/config/config").MONGO_URI;
const PORT = require("./app/config/config").PORT;


const appointmentRoutes = require("./routes/appointment");
const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");

const app = express();

app.use(bodyParser.json({limit:"100mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"100mb", extended: true}));
app.use(cors());


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



