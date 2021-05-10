const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const { RESET_PASSWORD_URL } = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { smtpTransport, email } = require("../config/email");
var async = require("async");
var crypto = require("crypto");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const doctor = new Doctor({
        // avatar: req.body.avatar,
        fullName: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        email: req.body.email,
        password: hash,
        phoneNumber: req.body.phoneNumber,
        speciality: req.body.speciality,
      });
      doctor
        .save()
        .then(() => res.status(201).json({ message: "Doctor created!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  Doctor.findOne({ email: req.body.email })
    .then((doctor) => {
      if (!doctor) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, doctor.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }

          res.status(200).json({
            doctorId: doctor._id,
            token: jwt.sign({ doctorId: doctor._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });

          res.cookie("c", token, {
            expire: new Date() + 9999,
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.logout = (req, res) => {
  res.clearCookie("c");
  return res.status("200").json({
    message: "Loged out successfully",
  });
};

exports.forgetPassword = function (req, res) {
  async.waterfall(
    [
      function (done) {
        Doctor.findOne({
          email: req.body.email,
        }).exec(function (err, doctor) {
          if (doctor) {
            done(err, doctor);
          } else {
            done("Doctor not found.");
          }
        });
      },
      function (doctor, done) {
        // create the random token
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString("hex");
          done(err, doctor, token);
        });
      },
      function (doctor, token, done) {
        Doctor.findByIdAndUpdate(
          { _id: doctor._id },
          {
            reset_password_token: token,
            reset_password_expires: Date.now() + 86400000,
          },
          { upsert: true, new: true }
        ).exec(function (err, new_doctor) {
          done(err, token, new_doctor);
        });
      },
      function (token, doctor, done) {
        var data = {
          to: doctor.email,
          from: email,
          template: "forgot_password_email",
          subject: "Password help has arrived!",
          context: {
            url: RESET_PASSWORD_URL + token,
            name: doctor.fullName.firstName,
          },
        };

        smtpTransport.sendMail(data, function (err) {
          if (!err) {
            return res.json({
              message: "Kindly check your email for further instructions",
            });
          } else {
            return done(err);
          }
        });
      },
    ],
    function (err) {
      return res.status(422).json({ message: err });
    }
  );
};

/**
 * Reset password
 */
exports.resetPassword = function (req, res, next) {
  Doctor.findOne({
    reset_password_token: req.query.token,
  }).exec(function (err, doctor) {
    if (!err && doctor) {
      if (req.body.newPassword === req.body.verifyPassword) {
        doctor.password = bcrypt.hashSync(req.body.newPassword, 10);
        doctor.reset_password_token = undefined;
        doctor.reset_password_expires = undefined;
        doctor.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: err,
            });
          } else {
            var data = {
              to: doctor.email,
              from: email,
              template: "reset_password_email",
              subject: "Password Reset Confirmation",
              context: {
                name: doctor.fullName.firstName,
              },
            };

            smtpTransport.sendMail(data, function (err) {
              if (!err) {
                return res.json({ message: "Password reset" });
              } else {
                return done(err);
              }
            });
          }
        });
      } else {
        return res.status(422).send({
          message: "Passwords do not match",
        });
      }
    } else {
      return res.status(400).send({
        message: "Password reset token is invalid or has expired.",
      });
    }
  });
};

exports.getDoctors = (req, res) => {
  const query = req.query;
  if (Object.entries(query).length == 0) {
    Doctor.find({})
      .then((doctors) => res.json(doctors))
      .catch((err) => res.status(404).json({ error: err }));
  } else {
    Doctor.find(query)
      .then((doctor) => res.status(200).json(doctor))
      .catch((error) => res.status(404).json({ error: "Doctor not found" }));
  }
};

exports.getDoctorById = (req, res) => {
  Doctor.findById({ _id: req.params.doctorId })
    .then((doctor) => res.status(200).json(doctor))
    .catch((error) => res.status(404).json({ error: "Doctor not found" }));
};

exports.updateDoctorInfo = (req, res) => {
  // console.log(req.body);
  Doctor.updateOne({ _id: req.params.doctorId }, req.body)
    .then(function (err) {
      if (err.nModified === 1) {
        res.status(200).send("doctor updated successfully");
      } else {
        res.status(404).send(err);
      }
    })
    .catch((error) => res.status(404).json({ error: "Doctor not found" }));
};

const confirmAppointmentForDoctor = (req, res) => {
  Doctor.findOne({ _id: req.params.doctorId })
    .then((doctor) => {
      const requests = doctor.recievedRequests;
      const appointments = doctor.appointments;
      const index = requests.indexOf(req.body.appointmentId);
      requests.splice(index, 1);
      if (req.body.isConfirmed) {
        appointments.push(req.body.appointmentId);
        res.status(200).send("appointment was accepted");
      } else {
        res.status(200).send("appointment was refused");
      }
      doctor.save();
    })
    .catch((error) => res.status(404).json({ error: "Doctor not found" }));
};

const confirmAppointmentForPatient = (req, res) => {
  Patient.findOne({ _id: req.body.patientId })
    .then((patient) => {
      const requests = patient.sendRequest;
      const appointments = patient.appointments;
      const index = requests.indexOf(req.body.appointmentId);
      requests.splice(index, 1);
      if(req.body.isConfirmed){
        appointments.push(req.body.appointmentId);
        res.status(202).json({message:"Appointment was accepted"});
      }else{
        res.status(202).json({message: "Appointment was refused"});
      }
      patient.save();
    })
    .catch((error) => res.status(404).json({ error: "Patient not found" }));
};

exports.confirmAppointment = (req, res) => {
  console.log(req.body);
  Appointment.findOne({_id: req.body.appointmentId})
  .then(() => {
    Doctor.findOne({_id: req.params.doctorId})
    .then(doctor => {
      Patient.findOne({_id: req.body.patientId})
      .then(patient => {
        const requestDoctor = doctor.recievedRequests;
        const requestPatient = patient.sendRequest;
        const indexPatient = requestPatient.indexOf(req.body.appointmentId);
        const indexDoctor = requestDoctor.indexOf(req.body.appointmentId);
        requestDoctor.splice(indexDoctor, 1);
        requestPatient.splice(indexPatient, 1);
        if(req.body.isConfirmed){
          requestPatient.push(req.body.appointmentId);
          requestDoctor.push(req.body.appointmentId);
          res.json({message: "Appointment was accepted"});
        }else{
          res.json({message: "Appointment was refused"});
        }
        patient.save();
      }).catch(res.json({error: "Patient Not Found"}));
      doctor.save();
    }).catch(res.json({error: "Doctor Not Found"}));
  }).catch(res.json({error: "AppointmentId is not valid"}));
  
};

exports.deleteDoctor = (req, res) => {
  Doctor.deleteOne({ _id: req.params.doctorId }).then((err) => {
    if (!err) {
      res.status(200).send("doctor delted successfully");
    }
  });
};
