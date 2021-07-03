//requiring modules

var http = require('http');
var https = require('https');
var fs = require('fs');


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
});


var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {

        httpServer.listen(8080);
        httpsServer.listen(8443);

        // app.listen(PORT, () =>
        //   console.log(`Server Running on: http://localhost:${PORT}`)
        // )
    })
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);