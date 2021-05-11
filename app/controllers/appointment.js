const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");


exports.getAppointmentbyId = (req, res) => {
    Appointment.findOne({ _id: req.params.appointmentId })
        .then(appointments => res.status(200).json(appointments))
        .catch(err => res.status(404).json({ error: "Appointment Not Found" }));
}

exports.getAppointments = (req, res) => {
    Appointment.find({})
        .then(appointments => res.status(200).json(appointments))
        .catch(err => res.status(404).json({ error: "Appointment Not Found" }));
}

// create appointment 

exports.askforAppointment = (req, res) => {
    const appointment = Appointment({
        patientId: req.body.patientId,
        doctorId: req.body.doctorId,
        perception: req.body.perception,
        price: req.body.price,
        date: req.body.date
    });
    appointment.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send("appointment created successfully");
        }
    });
    Doctor.findOne({ _id: req.body.doctorId })
        .then(doctor => {
            const requests = doctor.recievedRequests;
            requests.push(appointment._id);
            doctor.save();
        })
        .catch(err => res.status(404).json({ error: "Doctor Not Found" }));
    Patient.findOne({ _id: req.body.patientId })
        .then(patient => {
            const requests = patient.sendRequest;
            requests.push(appointment._id);
            patient.save();
        })
        .catch(err => res.status(404).json({ error: "Patient Not Found" }));
}


exports.updateAppointment = (req, res) => {
    Appointment.updateOne({ _id: req.params.appointmentId }, req.body)
        .then(function (err) {
            if (err) {
                res.status(204).send(err)
            }
        })
        .catch(err => res.status(404).json({ error: "Appointment Not Found" }))
}

exports.deleteAppointment = (req, res) => {
    Appointment.deleteOne({ _id: req.params.appointmentId })
        .then(res.status(200).json({message: "Appointment deleted successfully"}))
        .catch(err => res.status(404).json(err));
}