const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const pagination = require("../helpers/pagination");
const { RESET_PASSWORD_URL, TOKEN_SECRET } = require("../config/config");
const { smtpTransport, email } = require("../config/email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var async = require("async");
var crypto = require("crypto");

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
  Patient.findOne({
    email: req.body.email,
  })
    .then((patient) => {
      if (!patient) {
        return res.status(401).json({ error: "Patient not found!" });
      }
      bcrypt
        .compare(req.body.password, patient.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Wrong password" });
          }
          res.status(200).json({
            patientId: patient._id,
            token: jwt.sign(
              {
                patientId: patient._id,
                role: "patient",
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
        Patient.findOne({
          email: req.body.email,
        }).exec(function (err, patient) {
          if (patient) {
            done(err, patient);
          } else {
            done({ error: "Patient Not Found." });
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
            return res.status(201).json({
              message: "Kindly check your email for further instructions",
            });
          } else {
            return done(err);
          }
        });
      },
    ],
    function (err) {
      return res.status(422).json(err);
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
                return res.status(201).json({
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
          error: "Passwords do not match",
        });
      }
    } else {
      return res.status(400).send({
        error: "Password reset token is invalid or has expired.",
      });
    }
  });
};

exports.getPatients = (req, res) => {
  const offset = parseInt(pagination.setOffset(req.body.offset));
  const limit = parseInt(pagination.setLimit(req.body.limit));
  Patient.find({})
    .skip(offset)
    .limit(limit)
    .then((patients) => {
      securePatients = [];
      patients.map((patient) => {
        patient = patient.toObject();
        delete patient.password;
        delete patient.appointments;
        delete patient.sendRequest;
        securePatients.push(patient);
      });
      res.status(200).json(securePatients);
    })
    .catch((err) =>
      res.status(404).send({
        error: "Patient Not Found",
      })
    );
};

exports.getPatientById = (req, res) => {
  Patient.findById({
    _id: req.params.patientId,
  })
    .then((patient) => {
      patient = patient.toObject();
      delete patient.password;
      delete patient.appointments;
      delete patient.sendRequest;
      res.status(200).json(patient);
    })
    .catch((err) =>
      res.status(404).json({
        error: "Patient Not Found",
      })
    );
};

exports.updatePatientInfo = (req, res) => {
  Patient.updateOne({ _id: req.params.patientId }, req.body)
    .then(() =>
      res.status(201).send({ message: "Patient updated successfully" })
    )
    .catch((err) => res.status(404).json({ error: "Patient Not Founde" }));
};

exports.rateDoctor = (req, res) => {
  Doctor.findOne({ _id: req.body.doctorId })
    .then((doctor) => {
      const rating = {
        patientId: req.params.patientId,
        rating: req.body.rating,
      };
      doctor.ratings.push(rating);
      doctor
        .save()
        .then(() =>
          res
            .status(201)
            .send({ message: "Your rating has been saved successfully" })
        )
        .catch(() => res.status(500).send({ error: "Rating not saved" }));
    })
    .catch(() => res.status(404).send({ error: "Doctor Not Found" }));
};

exports.updateRating = (req, res) => {
  Doctor.findOne({ _id: req.body.doctorId })
    .then((doctor) => {
      doctor.ratings.map((rate, index) => {
        if (req.params.patientId == rate.patientId) {
          doctor.ratings.splice(index, 1);
          const rating = {
            patientId: req.params.patientId,
            rating: req.body.rating,
          };
          doctor.ratings.push(rating);
        }
      });
      doctor
        .save()
        .then(() =>
          res
            .status(201)
            .send({ message: "Your rating has been updated successfully" })
        )
        .catch(() => res.status(503).send({ error: "Rating not updated" }));
    })
    .catch(() => res.status(404).send({ error: "Doctor Not Found" }));
};

exports.patientAppointments = (req, res) => {
  Patient.findOne({ _id: req.params.patientId })
    .then((patient) => res.status(200).send(patient.appointments))
    .catch((err) => res.status(404).json({ error: "Patient Not Found" }));
};

exports.patientSendRequests = (req, res) => {
  Patient.findOne({ _id: req.params.patientId })
    .then((patient) => res.status(200).send(patient.sendRequest))
    .catch((err) => res.status(404).json({ error: "Patient Not Found" }));
};

exports.deletePatient = (req, res) => {
  Patient.deleteOne({
    _id: req.params.patientId,
  })
    .then(() =>
      res.status(200).json({ message: "Patient deleted successfully" })
    )
    .catch((err) => res.status(404).json(err));
};
