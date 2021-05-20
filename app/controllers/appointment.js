const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");


exports.getAppointmentbyId = (req, res) => {
    Appointment.findOne({ _id: req.params.appointmentId })
        .then(appointment => res.status(200).json(appointment))
        .catch(err => res.status(404).json({ error: "Appointment Not Found" }));
}

exports.getAppointments = (req, res) => {
    Appointment.find({})
        .then(appointments => res.status(200).json(appointments))
        .catch(err => res.status(404).json({ error: "Appointments Not Found" }));
}

// create appointment 

exports.askforAppointment = (req, res) => {
    
    Doctor.findOne({_id: req.body.doctorId})
    .then(doctor => {
        Patient.findOne({_id: req.body.patientId})
        .then(patient => {
            const appointment = Appointment({
                patientId: patient._id,
                doctorId: doctor._id,
                perception: req.body.perception,
                price: req.body.price,
                date: req.body.date
            });

            appointment.save()
            .then(() => res.status(201).json({message: "Apppointment created successfully"}))
            .catch(err => res.status(500).json(err));

            doctor.recievedRequests.push(appointment._id);
            patient.sendRequest.push(appointment._id);
            doctor.save();
            patient.save();
        })
        .catch(() => res.status(404).json({error: "Patient Not Found"}));
    })
    .catch(() => res.status(404).json({error: "Doctor Not Found"}));
}

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
      .then( appointment => {
        Patient.findOne({
          _id: appointment.patientId,
        })
          .then((patient) => {
            Doctor.findOne({
              _id: appointment.doctorId,
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
                    error: "Something goes wrong",
                  });
                }
              })
              .catch(() =>
                res.send({
                  error: "Doctor Not Found",
                })
              );
          })
          .catch(() =>
            res.send({
              erroe: "Patient Not Found",
            })
          )
        })
      .catch(() =>
        res.send({
          error: "Appointment Not Found",
        })
      );
  };


exports.updateAppointment = (req, res) => {
    Appointment.updateOne({ _id: req.params.appointmentId }, req.body)
        .then(() => res.status(201).json({message: "Appointment updated successfully"}))
        .catch(err => res.status(404).json({ error: "Appointment Not Found" }))
}

exports.deleteAppointment = (req, res) => {
    Appointment.findByIdAndDelete({ _id: req.params.appointmentId })
        .then(res.status(200).json({message: "Appointment deleted successfully"}))
        .catch(err => res.status(404).json(err));
}