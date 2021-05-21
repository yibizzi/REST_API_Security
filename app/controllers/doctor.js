const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const pagination = require("../helpers/pagination");
const { RESET_PASSWORD_URL, TOKEN_SECRET } = require("../config/config");
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
        .then(() =>
          res.status(201).json({
            message: "Doctor created!",
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
  Doctor.findOne({
    email: req.body.email,
  })
    .then((doctor) => {
      if (!doctor) {
        return res.status(401).json({ error: "Doctor not found!" });
      }
      bcrypt
        .compare(req.body.password, doctor.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Worng password" });
          }
          res.status(200).json({
            doctorId: doctor._id,
            token: jwt.sign(
              {
                doctorId: doctor._id,
                role: "doctor",
              },
              TOKEN_SECRET,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) =>
          res.status(500).json({
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
          {
            _id: doctor._id,
          },
          {
            reset_password_token: token,
            reset_password_expires: Date.now() + 86400000,
          },
          {
            upsert: true,
            new: true,
          }
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
      return res.status(422).json({
        message: err,
      });
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

exports.getDoctors = (req, res) => {
  const query = req.query;
  const offset = parseInt(pagination.setOffset(req.body.offset));
  const limit = parseInt(pagination.setLimit(req.body.limit));
  Doctor.find(query)
    .skip(offset)
    .limit(limit)
    .then((doctors) => {
      let secureDoctor = [];
      doctors.map((doctor) => {
        doctor = doctor.toObject();
        delete doctor.password;
        delete doctor.appointments;
        delete doctor.recievedRequests;
        delete doctor.ratings;
        secureDoctor.push(doctor);
      });
      res.status(200).json(secureDoctor);
    })
    .catch((err) =>
      res.status(404).json({
        error: err,
      })
    );
};

exports.getDoctorById = (req, res) => {
  Doctor.findById({
    _id: req.params.doctorId,
  })
    .then((doctor) => {
      doctor = doctor.toObject();
      delete doctor.password;
      delete doctor.appointments;
      delete doctor.recievedRequests;
      delete doctor.ratings;
      res.status(200).json(doctor);
    })
    .catch((error) =>
      res.status(404).json({
        error: "Doctor not found",
      })
    );
};

exports.updateDoctorInfo = (req, res) => {
  Doctor.updateOne(
    {
      _id: req.params.doctorId,
    },
    req.body
  )
    .then(() =>
      res.status(201).send({ message: "Doctor updated successfully!" })
    )
    .catch((error) =>
      res.status(404).json({
        error: "Doctor not found",
      })
    );
};

exports.confirmAppointment = (req, res) => {
  Appointment.findOne({ _id: req.body.appointmentId })
    .then((appointment) => {
      Doctor.findOne({ _id: appointment.doctorId })
        .then((doctor) => {
          Patient.findOne({ _id: appointment.patientId })
            .then((patient) => {
              const requestDoctor = doctor.recievedRequests;
              const requestPatient = patient.sendRequest;
              const indexPatient = requestPatient.indexOf(
                req.body.appointmentId
              );
              const indexDoctor = requestDoctor.indexOf(req.body.appointmentId);
              doctor.recievedRequests.splice(indexDoctor, 1);
              patient.sendRequest.splice(indexPatient, 1);
              if (req.body.isConfirmed == "true") {
                patient.appointments.push(req.body.appointmentId);
                doctor.appointments.push(req.body.appointmentId);
                doctor.save();
                patient.save();
                return res
                  .status(200)
                  .json({ message: "Appointment was accepted" });
              }
              patient.save();
              doctor.save();
              return res
                .status(200)
                .json({ message: "Appointment was refused" });
            })
            .catch(() => res.status(404).json({ error: "Patient Not Found" }));
        })
        .catch(() => res.status(404).json({ error: "Doctor Not Found" }));
    })
    .catch(() => res.status(404).json({ error: "AppointmentId is not valid" }));
};

exports.doctorAppointments = (req, res) => {
  Doctor.findOne({ _id: req.params.doctorId })
    .then((doctor) => res.status(200).send(doctor.appointments))
    .catch((err) => res.status(404).json({ error: "Doctor Not Found" }));
};

exports.doctorRecievedRequests = (req, res) => {
  Doctor.findOne({ _id: req.params.doctorId })
    .then((doctor) => res.status(200).send(doctor.recievedRequests))
    .catch((err) => res.status(404).json({ error: "Doctor Not Found" }));
};

exports.doctorRating = (req, res) => {
  Doctor.findOne({ _id: req.params.doctorId })
    .then((doctor) => res.status(200).send(doctor.ratings))
    .catch((err) => res.status(404).json({ error: "Doctor Not Found" }));
};

exports.deleteDoctor = (req, res) => {
  Doctor.deleteOne({
    _id: req.params.doctorId,
  })
    .then(() => res.json({ message: "Doctor deleted successfully" }))
    .catch((err) => res.json(err));
};
