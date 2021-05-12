const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { RESET_PASSWORD_URL } = require("../config/config");
const { smtpTransport, email } = require("../config/email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var async = require("async");
var crypto = require("crypto");
const { stringify } = require("querystring");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const patient = new Patient({
        avatar: req.body.avatar,
        fullName: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        email: req.body.email,
        password: hash,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
      });
      patient
        .save()
        .then(() =>
          res.status(201).json({
            message: "Patient created!",
          })
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};

exports.login = (req, res, next) => {
  Patient.findOne({ email: req.body.email })
    .then((patient) => {
      if (!patient) {
        return res.status(401).json({ error: "Patient not found!" });
      }
      bcrypt
        .compare(req.body.password, patient.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Worng password" });
          }
          res.status(200).json({
            patientId: patient._id,
            token: jwt.sign({ patientId: patient._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.forgetPassword = function (req, res) {
  async.waterfall(
    [
      function (done) {
        Patient.findOne({
          email: req.body.email,
        }).exec(function (err, patient) {
          if (patient) {
            done(err, patient);
          } else {
            done("Patient Not Found.");
          }
        });
      },
      function (patient, done) {
        // create the random token
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString("hex");
          done(err, patient, token);
        });
      },
      function (patient, token, done) {
        Patient.findByIdAndUpdate(
          {
            _id: patient._id,
          },
          {
            reset_password_token: token,
            reset_password_expires: Date.now() + 86400000,
          },
          {
            upsert: true,
            new: true,
          }
        ).exec(function (err, new_patient) {
          done(err, token, new_patient);
        });
      },
      function (token, patient, done) {
        var data = {
          to: patient.email,
          from: email,
          template: "forgot_password_email",
          subject: "Password help has arrived!",
          context: {
            url: RESET_PASSWORD_URL + token,
            name: patient.fullName.firstName,
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
      return res.status(422).json({
        message: err,
      });
    }
  );
};

exports.resetPassword = function (req, res, next) {
  Patient.findOne({
    reset_password_token: req.query.token,
  }).exec(function (err, patient) {
    if (!err && patient) {
      if (req.body.newPassword === req.body.verifyPassword) {
        patient.password = bcrypt.hashSync(req.body.newPassword, 10);
        patient.reset_password_token = undefined;
        patient.reset_password_expires = undefined;
        patient.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: err,
            });
          } else {
            var data = {
              to: patient.email,
              from: email,
              template: "reset_password_email",
              subject: "Password Reset Confirmation",
              context: {
                name: patient.fullName.split(" ")[0],
              },
            };

            smtpTransport.sendMail(data, function (err) {
              if (!err) {
                return res.json({
                  message: "Password reset",
                });
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

exports.getPatients = (req, res) => {
  const query = req.query;
  if (Object.entries(query).length == 0) {
    Patient.find({})
      .then((patient) => res.json(patient))
      .catch((err) =>
        res.status(404).send({
          error: "Patient Not Found",
        })
      );
  } else {
    Patient.find(query)
      .then((patient) => res.json(patient))
      .catch((err) =>
        res.status(404).send({
          error: "Patient Not Found",
        })
      );
  }
};

exports.getPatientById = (req, res) => {
  Patient.findById({
    _id: req.params.patientId,
  })
    .then((patient) => res.status(202).json(patient))
    .catch((err) =>
      res.status(404).json({
        error: "Patient Not Found",
      })
    );
};

exports.updatePatientInfo = (req, res) => {
  Patient.updateOne(
    {
      _id: req.params.patientId,
    },
    req.body
  ).then(function (err) {
    if (err.nModified === 1) {
      res.status(200).send("Patient updated successfully");
    } else {
      res.status(404).send(err);
    }
  });
};

const cancelAppointmentPatient = (patient, req, res) => {
  const requests = patient.sendRequest;
  const appointments = patient.appointments;
  const indexReq = requests.indexOf(req.body.appointmentId);
  const indexApp = appointments.indexOf(req.body.appointmentId);
  var stateReq = false;
  var stateApp = false;
  if (indexReq !== -1) {
    patient.sendRequest.splice(indexReq, 1);
    stateReq = true;
    patient.save();
  } else if (indexApp !== -1) {
    patient.appointments.splice(indexApp, 1);
    stateApp = true;
    patient.save();
  }
  return stateApp || stateReq;
};

const cancelAppointmentDoctor = (doctor, req, res) => {
  const requests = doctor.recievedRequests;
  const appointments = doctor.appointments;
  const indexReq = requests.indexOf(req.body.appointmentId);
  const indexApp = appointments.indexOf(req.body.appointmentId);
  var stateReq = false;
  var stateApp = false;
  if (indexReq !== -1) {
    doctor.recievedRequests.splice(indexReq, 1);
    stateReq = true;
    doctor.save();
  } else if (indexApp !== -1) {
    doctor.appointments.splice(indexApp, 1);
    stateApp = true;
    doctor.save();
  }
  return stateApp || stateReq;
};

exports.cancelAppointment = (req, res) => {
  Appointment.findOne({
    _id: req.body.appointmentId,
  })
    .then(
      Patient.findOne({
        _id: req.params.patientId,
      })
        .then((patient) => {
          Doctor.findOne({
            _id: req.body.doctorId,
          })
            .then((doctor) => {
              const check =
                cancelAppointmentDoctor(doctor, req, res) &&
                cancelAppointmentPatient(patient, req, res);
              console.log(check);
              if (check) {
                return res.send({
                  message: "appointment was canceld",
                });
              } else {
                return res.send({
                  message: "Something goes wrong",
                });
              }
            })
            .catch(() =>
              res.send({
                error: "doctor not found",
              })
            );
        })
        .catch(() =>
          res.send({
            erroe: "patient not found",
          })
        )
    )
    .catch(() =>
      res.send({
        error: "apoointment not found",
      })
    );
};

exports.rateDoctor = (req, res) => {
  Doctor.findOne({ _id: req.body.doctorId })
    .then((doctor) => {
      const rating = {
        patientId: req.body.patientId,
        rating: req.body.rating,
      };
      doctor.ratings.push(rating);
      doctor
        .save()
        .then(() =>
          res.send({ message: "your rating has been stored successfully" })
        )
        .catch(() => res.send({ error: "rating not saved" }));
    })
    .catch(() => res.send({ error: "Doctor Not Found" }));
};

exports.updateRating = (req, res) => {
  Doctor.findOne({ _id: req.body.doctorId })
    .then((doctor) => {
      doctor.ratings.map((rate, index) => {
        if (req.body.patientId == rate.patientId) {
          doctor.ratings.splice(index, 1);
          console.log(true);
          const rating = {
            patientId: req.body.patientId,
            rating: req.body.rating,
          };
          doctor.ratings.push(rating);
        }
      });
      doctor
        .save()
        .then(() =>
          res.send({ message: "your rating has been updated successfully" })
        )
        .catch(() => res.send({ error: "rating not updated" }));
    })
    .catch(() => res.send({ error: "Doctor Not Found" }));
};

exports.deletePatient = (req, res) => {
  Patient.updateOne({
    _id: req.params.patientId,
  }).then(function (err) {
    if (!err) {
      res.status(200).send("patient deleted successfully");
    } else {
      res.status(204).send(err);
    }
  });
};
